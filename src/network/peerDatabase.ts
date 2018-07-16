import * as delay from "delay"
import { getLogger } from "log4js"
import * as sqlite3 from "sqlite3"
import * as sqlite3Trans from "sqlite3Trans"
import { AsyncLock } from "../common/asyncLock"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { INetwork } from "./inetwork"
import { IPeerDatabase } from "./ipeerDatabase"
// tslint:disable-next-line:no-var-requires
const TransactionDatabase = require("sqlite3-transactions").TransactionDatabase
const logger = getLogger("PeerDatabase")

interface ITableInfo { cid: number, name: string, type: string, notnull: number, dflt_value: string, pk: number }
interface IRow { KEY: number, HOST: string, PORT: number, LASTSEEN: number, FAILCOUNT: number, SUCCESSCOUNT: number, LASTATTEMPT: number, ACTIVE: boolean, CURRENTQUEUE: number }
interface IRowCount { num: number }
export class PeerDatabase implements IPeerDatabase {
    public static ipeer2key(peer: proto.IPeer): number {
        const hash = new Hash(peer.host + "!" + peer.port.toString())
        let key = 0
        for (let i = 0; i < 6; i++) {
            key = key * 256 + hash[i]
        }
        return key
    }

    private network: INetwork
    private db: sqlite3Trans.Database
    private maxPeerCount: number = 200

    constructor(network: INetwork, path: string = "peerdb") {
        this.db = new TransactionDatabase(
            // tslint:disable-next-line:no-bitwise
            new sqlite3.Database(path + `sql`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE),
        )
        this.network = network
    }

    public async init(): Promise<boolean> {
        const sql = `CREATE TABLE IF NOT EXISTS peerdb (
                KEY INTEGER PRIMARY KEY NOT NULL,
                HOST TEXT NOT NULL,
                PORT INTEGER NOT NULL,
                LASTSEEN INTEGER,
                FAILCOUNT INTEGER,
                SUCCESSCOUNT INTEGER,
                LASTATTEMPT INTEGER,
                ACTIVE INTEGER,
                CURRENTQUEUE INTEGER
            )`
        await new Promise<void>((resolve, reject) => {
            this.db.run(sql, (err: Error) => {
                if (err) { reject(`Create table peerdb: ${err}`) }
                resolve()
            })
        })

        const tableInfo: ITableInfo[] = await new Promise<ITableInfo[]>((resolve, reject) => {
            this.db.all("PRAGMA table_info('peerdb')", (err: Error, rows: ITableInfo[]) => {
                if (err) { reject(`Get peerdb table info: ${err}`) }
                resolve(rows)
            })
        })

        let exist: boolean = false

        for (const i of tableInfo) {
            if (i.name === "SUCCESSCOUNT") {
                exist = true
            }
        }

        if (!exist) {
            const sqlAdd = `ALTER TABLE peerdb ADD COLUMN SUCCESSCOUNT INTEGER`
            await new Promise<void>((resolve, reject) => {
                this.db.run(sqlAdd, (err: Error) => {
                    if (err) { reject(`Add peerdb column: ${err}`) }
                    resolve()
                })
            })
        }
        return true
    }

    public async clearAll(): Promise<void> {
        const sql = `DELETE FROM peerdb`
        await new Promise<void>((resolve, reject) => {
            this.db.run(sql, (err: Error) => {
                if (err) { reject(`Destroy table peerdb: ${err}`) }
                resolve()
            })
        })
    }

    public close() {
        this.db.close()
    }

    public async put(peer: proto.IPeer): Promise<proto.IPeer> {
        return await this.doPut(peer)
    }
    public async putPeers(peers: proto.IPeer[]): Promise<boolean> {
        const length = peers.length
        if (length < this.maxPeerCount) {
            this.doPutPeers(peers)
        } else {
            const tp = peers.splice(0, this.maxPeerCount)
            this.doPutPeers(tp)
        }
        return true
    }

    public async seen(peerOriginal: proto.IPeer): Promise<proto.IPeer> {
        const key = PeerDatabase.ipeer2key(peerOriginal)
        // if exist, read data
        let peer = peerOriginal
        try {
            peer = await this.doGet(key)
        } catch (error) {
            // this is new peer!
        }
        peer.lastSeen = Date.now()

        if (peer.successCount === undefined) {
            peer.successCount = 1
        } else {
            peer.successCount++
        }
        // peer.failCount = 0
        return await this.doPut(peer)
    }

    public async fail(peerOriginal: proto.IPeer, limit: number): Promise<proto.IPeer> {
        const key = PeerDatabase.ipeer2key(peerOriginal)
        // if exist, read data
        let peer = peerOriginal
        try {
            peer = await this.doGet(key)
        } catch (error) {
            // this is new peer!
        }
        // it already exists
        peer.lastAttempt = Date.now()
        if (peer.failCount === undefined) {
            peer.failCount = 1
        } else {
            peer.failCount++
        }
        return await this.doPut(peer)

    }

    public async get(key: number): Promise<proto.IPeer> {
        const sql = `SELECT * FROM peerdb WHERE KEY = ${key}`
        return new Promise((resolve, reject) => {
            this.db.get(sql, (err: Error, row: IRow) => {
                if (err) { reject(`Get peer: ${err}`) }
                if (row) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                        successCount: row.SUCCESSCOUNT,
                    }
                    resolve(peer)
                } else {
                    reject(`Invalid Row Get peer: ${err}`)
                }
            })
        })

    }

    public async getRandomPeer(exemptions: proto.IPeer[]): Promise<proto.IPeer> {
        let condition = ""
        for (const exemption of exemptions) {
            const exemptionKey = PeerDatabase.ipeer2key(exemption)
            condition += `${exemptionKey},`
        }
        if (condition.length > 0) {
            condition = condition.substring(0, condition.length - 1)
        }

        let wSuccess: number
        let wFail: number
        let wLastSeem: number
        let sql: string
        let size = 0
        if (this.network) {
            size = this.network.getConnectionCount()
        }
        if (size < 20) {
            wLastSeem = 0.5
            wSuccess = 2
            wFail = 10
            sql = `SELECT * FROM peerdb WHERE KEY NOT IN ($condition) ORDER BY ABS(RANDOM()%100) *
            CASE WHEN
                ($wSuccess*successCount - $wFail*failCount + $wLastSeem*(
                    CASE
                        WHEN (lastSeen = 0) THEN 0
                        WHEN (lastSeen = '') THEN 0
                        WHEN (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60 > 100 THEN 0
                        ELSE 100 - (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60
                    END
                )) = 0 THEN 1
            ELSE
                ($wSuccess*successCount - $wFail*failCount + $wLastSeem*(
                    CASE
                        WHEN (lastSeen = 0) THEN 0
                        WHEN (lastSeen = '') THEN 0
                        WHEN (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60 > 100 THEN 0
                        ELSE 100 - (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60
                    END
                ))
            END
            DESC LIMIT 1`
        }
        if (size >= 20 && size < 40) {
            wSuccess = 2
            wFail = 10
            sql = `SELECT * FROM peerdb WHERE KEY NOT IN ($condition) ORDER BY ABS(RANDOM()%100) *
            CASE WHEN
                ($wSuccess*successCount - $wFail*failCount) = 0 THEN 1
            ELSE
                ($wSuccess*successCount - $wFail*failCount)
            END
            DESC LIMIT 1`
        }

        if (size >= 40) {
            sql = `SELECT * FROM peerdb WHERE KEY NOT IN (${condition}) ORDER BY RANDOM() DESC LIMIT 1`
        }

        return new Promise((resolve, reject) => {
            const params = {
                $condition: condition,
                $wFail: wFail,
                $wLastSeem: wLastSeem,
                $wSuccess: wSuccess,
            }
            this.db.get(sql, params, (err: Error, row: IRow) => {
                if (err) { reject(`Get random peer: ${err}`) }
                if (row === undefined) { reject(`Get random peer: no peer been picked`) } else {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                        successCount: row.SUCCESSCOUNT,
                    }
                    // logger.info(`Pick: ${peer.host}:${peer.port}:${peer.successCount}:${peer.failCount}:${peer.lastSeen}`)
                    resolve(peer)
                }
            })
        })

    }

    public async remove(peer: proto.IPeer, db: sqlite3Trans.Database = this.db): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const key = PeerDatabase.ipeer2key(peer)
            const sql = `DELETE FROM peerdb
                                WHERE KEY = $key`
            const params = {
                $key: key,
            }
            db.run(sql, params, (err: Error) => {
                if (err) { resolve(false) }
                resolve(true)
            })
        })

    }

    public async getKeys(): Promise<number[]> {
        const sql = `SELECT * FROM peerdb`
        return new Promise<number[]>((resolve, reject) => {
            this.db.all(sql, (err: Error, rows: IRow[]) => {
                if (err) { reject(`GetKeys: ${err}`) }
                const ret: number[] = []
                for (const row of rows) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                        successCount: row.SUCCESSCOUNT,
                    }
                    const key = PeerDatabase.ipeer2key(peer)
                    ret.push(key)
                }
                resolve(ret)
            })
        })

    }

    public async peerCount(): Promise<number> {
        const sql = `SELECT COUNT(*) as num FROM peerdb`
        return new Promise<number>((resolve, reject) => {
            this.db.get(sql, (err: Error, row: IRowCount) => {
                if (err) { reject(`PeerCount: ${err}`) }
                resolve(row.num)
            })
        })
    }

    private async update(peer: proto.IPeer, db = this.db): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const key = PeerDatabase.ipeer2key(peer)
            const original = await this.doGet(key, db)
            const sql = `UPDATE peerdb SET
                                LASTSEEN = $lastSeen,
                                FAILCOUNT = $failCount,
                                LASTATTEMPT = $lastAttempt,
                                ACTIVE = $active,
                                CURRENTQUEUE = $currentQueue,
                                SUCCESSCOUNT = $successCount
                            WHERE KEY = $key`
            const params = {
                $active: peer.active !== undefined ? peer.active : original.active,
                $currentQueue: peer.currentQueue !== undefined ? peer.currentQueue : original.currentQueue,
                $failCount: peer.failCount !== undefined ? original.failCount ? Math.max(peer.failCount, original.failCount) : peer.failCount : original.failCount,
                $key: key,
                $lastAttempt: peer.lastAttempt !== undefined ? original.lastAttempt ? Math.max(Number(peer.lastAttempt), Number(original.lastAttempt)) : peer.lastAttempt : original.lastAttempt,
                $lastSeen: peer.lastSeen !== undefined ? original.lastSeen ? Math.max(Number(peer.lastSeen), Number(original.lastSeen)) : peer.lastSeen : original.lastSeen,
                $successCount: peer.successCount !== undefined ? original.successCount ? Math.max(peer.successCount, original.successCount) : peer.successCount : original.successCount,
            }

            const stmt = db.prepare(sql)
            stmt.run(params)
            stmt.finalize()
            resolve()
        })
    }

    private async insert(peer: proto.IPeer, db = this.db): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const key = PeerDatabase.ipeer2key(peer)
            const sql = `INSERT INTO peerdb (
                                            KEY,
                                            HOST,
                                            PORT,
                                            LASTSEEN,
                                            FAILCOUNT,
                                            LASTATTEMPT,
                                            ACTIVE,
                                            CURRENTQUEUE,
                                            SUCCESSCOUNT
                                        ) VALUES (
                                            $key,
                                            $host,
                                            $port,
                                            $lastSeen,
                                            $failCount,
                                            $lastAttempt,
                                            $active,
                                            $currentQueue,
                                            $successCount
                                        )`
            const params = {
                $active: peer.active ? peer.active : 0,
                $currentQueue: peer.currentQueue ? peer.currentQueue : 0,
                $failCount: peer.failCount ? peer.failCount : 0,
                $host: peer.host,
                $key: key,
                $lastAttempt: peer.lastAttempt ? peer.lastAttempt : "",
                $lastSeen: peer.lastSeen ? peer.lastSeen : "",
                $port: peer.port,
                $successCount: peer.successCount ? peer.successCount : 0,
            }
            const stmt = db.prepare(sql)
            stmt.run(params)
            stmt.finalize()
            resolve()
        })
    }

    private async transaction() {
        return new Promise<sqlite3Trans.Transaction>((resolve, reject) => {
            const tmpdb: sqlite3Trans.Database = this.db
            tmpdb.beginTransaction((err: Error, tx: sqlite3Trans.Transaction) => {
                if (err) { reject(`Peerdb transaction init: ${err} `) }
                resolve(tx)
            })
        })
    }

    private async commit(transaction: sqlite3Trans.Transaction) {
        return new Promise<void>((resolve, reject) => {
            transaction.commit((err: Error) => {
                if (err) { reject(`Peerdb transaction commit: ${err}`) }
                resolve()
            })
        })
    }

    private async getAll(condition: string): Promise<proto.IPeer[]> {
        const sql = `SELECT * FROM peerdb WHERE KEY NOT IN (${condition}) AND FAILCOUNT=0`
        return new Promise<proto.IPeer[]>((resolve, reject) => {
            this.db.all(sql, (err: Error, rows: IRow[]) => {
                if (err) { reject(`Getall: ${err}`) }
                const ret: proto.IPeer[] = []
                for (const row of rows) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                    }
                    ret.push(peer)
                }
                resolve(ret)
            })
        })
    }

    private async doPutPeers(peers: proto.IPeer[]): Promise<void> {

        const transaction = await this.transaction()
        for (const peer of peers) {
            if (!this.isValidPort(peer.port)) {
                continue
            }
            const key = PeerDatabase.ipeer2key(peer)

            try {
                await this.doGet(key, transaction)
                await this.update(peer, transaction)
            } catch (e) {
                await this.insert(peer, transaction)
            }
        }
        await this.commit(transaction)
    }

    private async doPut(peer: proto.IPeer): Promise<proto.IPeer> {
        if (!this.isValidPort(peer.port)) {
            throw new Error(`doPut Error InvalidPort=${peer.port}`)
        }
        const key = PeerDatabase.ipeer2key(peer)
        const transaction = await this.transaction()
        let ret = peer
        try {
            await this.doGet(key, transaction)
            await this.update(peer, transaction)
        } catch (error) {
            await this.insert(peer, transaction)
        }

        // inserted or updated
        // it's latest
        try {
            ret = await this.doGet(key, transaction)
        } catch {
            // error in fetching get
        }
        await this.commit(transaction)
        return ret
    }

    private async doGet(key: number, db = this.db): Promise<proto.IPeer> {
        const params = { $key: key }
        const sql = `SELECT * FROM peerdb WHERE KEY = $key`
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(sql)
            stmt.get(params, (err: Error, row: IRow) => {
                if (err) { reject(`doGet peer: ${err} `) }
                if (row) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                        successCount: row.SUCCESSCOUNT,
                    }
                    stmt.finalize()
                    resolve(peer)
                } else {
                    stmt.finalize()
                    reject(`doGet InvalidRow peer: ${err} `)
                }
            })

        })
    }

    private isValidPort(port: number) {
        return 0 < port && port < 10000
    }
}
