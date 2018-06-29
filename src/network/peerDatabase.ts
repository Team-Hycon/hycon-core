import { getLogger } from "log4js"
import * as sqlite3 from "sqlite3"
import { AsyncLock } from "../common/asyncLock"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { IPeerDatabase } from "./ipeerDatabase"
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
const logger = getLogger("PeerDatabase")
const sqlite = sqlite3.verbose()
export class PeerDatabase implements IPeerDatabase {
    public static ipeer2key(peer: proto.IPeer): number {
        const hash = new Hash(peer.host + "!" + peer.port.toString())
        let key = 0
        for (let i = 0; i < 6; i++) {
            key = key * 256 + hash[i]
        }
        return key
    }
    private db: any

    constructor(path: string = "peerdb") {
        this.db = new TransactionDatabase(
            new sqlite3.Database(path + `sql`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
        )
    }

    public async init(): Promise<boolean> {
        const sql = `CREATE TABLE IF NOT EXISTS peerdb (
                KEY INTEGER PRIMARY KEY NOT NULL,
                HOST TEXT NOT NULL,
                PORT INTEGER NOT NULL,
                LASTSEEN INTEGER,
                FAILCOUNT TEXT,
                LASTATTEMPT INTEGER,
                ACTIVE INTEGER,
                CURRENTQUEUE INTEGER
            )`
        let ret: boolean = await new Promise<boolean>((resolve, reject) => {
            this.db.run(sql, (err: any) => {
                resolve(!err)
            })
        })
        return ret
    }

    public async peerCount(): Promise<number | undefined> {
        const sql = `SELECT COUNT(*) as num FROM peerdb`
        return new Promise<number>((resolve, reject) => {
            this.db.get(sql, (err: any, row: any) => {
                if (!err && row) {
                    resolve(row.num)
                }
                else {
                    resolve(undefined)
                }
            })
        })
    }
    public async put(peer: proto.IPeer): Promise<proto.IPeer | undefined> {
        if (peer.port > 10000) {
            return undefined
        }
        const key = PeerDatabase.ipeer2key(peer)
        if (await this.get(key)) {
            await this.update(peer)
        } else {
            await this.insert(peer)
        }
        return peer
    }

    // // the peer in for loop has an async issue, so the peer that passed inside will be a incorrect value (maybe is null)
    // public async putPeers(peers: proto.IPeer[]): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         this.db.beginTransaction((err: any, tx: any) => {
    //             for (let peer of peers) {
    //                 const key = PeerDatabase.ipeer2key(peer)
    //                 const sql = `SELECT * FROM peerdb WHERE KEY = ${key}`
    //                 this.db.get(sql, (err: any, row: any) => {
    //                     if (!err && row) {
    //                         this.doUpdate(tx, peer)
    //                     }
    //                     else {
    //                         this.doInsert(tx, peer)
    //                     }
    //                 })
    //             }
    //             tx.commit((err: any) => {
    //                 resolve()
    //             })
    //         })
    //     })
    // }

    public async putPeers(peers: proto.IPeer[]): Promise<Boolean> {
        return new Promise<Boolean>(async (resolve, reject) => {
            for (let peer of peers) {
                await this.put(peer)
            }
            resolve(true)
        })
    }

    public async seen(peerOriginal: proto.IPeer): Promise<proto.IPeer> {
        const key = PeerDatabase.ipeer2key(peerOriginal)
        // if exist, read data
        let peer = await this.get(key)
        if (peer === undefined) {
            peer = peerOriginal
        }
        peer.lastSeen = Date.now()
        peer.failCount = 0
        return await this.put(peer)
    }

    public async fail(peerOriginal: proto.IPeer, limit: number): Promise<proto.IPeer | undefined> {
        const key = PeerDatabase.ipeer2key(peerOriginal)
        const peer = await this.get(key)
        if (peer === undefined) {
            return undefined
        }
        // it already exists
        peer.lastAttempt = Date.now()
        peer.failCount++
        if (peer.failCount <= limit) {
            return await this.put(peer) // update or insert
        } else {
            // db is not removed
            //return await this.remove(peer)
            return await this.put(peer) // update or insert
        }
    }
    public async get(key: number): Promise<proto.IPeer | undefined> {
        const sql = `SELECT * FROM peerdb WHERE KEY = ${key}`
        return new Promise((resolve, reject) => {
            this.db.get(sql, (err: any, row: any) => {
                if (!err && row) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                    }
                    resolve(peer)
                }
                else {
                    resolve(undefined)
                }
            })
        })
    }


    protected doRemove(db: any, peer: proto.IPeer) {
        const key = PeerDatabase.ipeer2key(peer)
        const sql = `DELETE FROM peerdb
                    WHERE KEY = $key`
        const params = {
            $key: key,
        }
        db.run(sql, params, function (err: any) {
        })
    }

    public async remove(peer: proto.IPeer): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db.beginTransaction((err: any, tx: any) => {
                this.doRemove(tx, peer)
                tx.commit((err: any) => {
                    resolve(!err)
                })
            })
        })
    }

    public async getRandomPeer(exemptions: proto.IPeer[]): Promise<proto.IPeer | undefined> {
        let condition = ""
        for (let exemption of exemptions) {
            const exemptionKey = PeerDatabase.ipeer2key(exemption)
            condition += `${exemptionKey},`
        }
        if (condition.length > 0) {
            condition = condition.substring(0, condition.length - 1)
        }
        let allPeers = await this.getAll(condition)
        const length = allPeers.length
        const chosen = Math.floor(Math.random() * length)
        const info = allPeers[chosen]
        return info
    }

    public static async test() {
        const db = new PeerDatabase()
        await db.init()

        let i = 0
        /*let data: any[] = []        
        for (i = 0; i < 100; i++) {
            data.push({ host: `1.2.3.${i}`, port: `${1000 + i}` })
        }
        db.putPeers(data)
        */

        let port = 2000
        let peers: proto.IPeer[] = []
        for (i = 1; i < 200; i++) {
            const p1: proto.IPeer = {
                host: `192.168.0.${i}`,
                port: port,
            }

            const k1 = PeerDatabase.ipeer2key(p1)
            peers.push(p1)
            let info = await db.get(k1)
            if (info !== undefined) {
                let p2 = p1
                p2.currentQueue = 20 + info.currentQueue
                await db.update(p2)
                await db.fail(p1, 3)
            }
            else {
                await db.seen(p1)
            }
            port += 10
        }

        /*  for (i = 1; i < peers.length; i += 10) {
              let p2 = peers[i]
              await db.seen(p2)
          }*/


        logger.info(`OK Count=${await db.peerCount()}`)
        let info = await db.getRandomPeer([])
        const keys = await db.getKeys()
    }


    protected async doUpdate(db: any, peer: proto.IPeer) {
        const key = PeerDatabase.ipeer2key(peer)
        const original = await this.get(key)
        const sql = `UPDATE peerdb SET
                            LASTSEEN = $lastSeen,
                            FAILCOUNT = $failCount,
                            LASTATTEMPT = $lastAttempt,
                            ACTIVE = $active,
                            CURRENTQUEUE = $currentQueue
                        WHERE KEY = $key`
        const params = {
            $active: peer.active !== undefined ? peer.active : original.active,
            $currentQueue: peer.currentQueue !== undefined ? peer.currentQueue : original.currentQueue,
            $failCount: peer.failCount !== undefined ? peer.failCount : original.failCount,
            $key: key,
            $lastAttempt: peer.lastAttempt !== undefined ? peer.lastAttempt : original.lastAttempt,
            $lastSeen: peer.lastSeen !== undefined ? peer.lastSeen : original.lastSeen,
        }

        db.run(sql, params, function (err: any) {
        })
    }
    protected async update(peer: proto.IPeer): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db.beginTransaction((err: any, tx: any) => {
                this.doUpdate(tx, peer)
                tx.commit((err: any) => {
                    resolve(!err)
                })
            })
        })
    }

    // this is for debugging
    // use sqlite browser to view data
    public async printDB(): Promise<void> {
        logger.info(`PeerDB Size= ${await this.peerCount()}`)
        const keys: number[] = await this.getKeys()
        let i = 1
        for (const key of keys) {
            const peer = await this.get(key)
            logger.debug(`${i++}/${keys.length} host: ${peer.host}, port: ${peer.port}, failCount: ${peer.failCount}`)
        }
    }

    public async getKeys(): Promise<number[]> {
        const sql = `SELECT * FROM peerdb`
        return new Promise<number[]>((resolve, reject) => {
            this.db.all(sql, (err: any, rows: any) => {
                let ret: number[] = []
                for (let row of rows) {
                    const peer: proto.IPeer = {
                        active: row.ACTIVE,
                        currentQueue: row.CURRENTQUEUE,
                        failCount: row.FAILCOUNT,
                        host: row.HOST,
                        lastAttempt: row.LASTATTEMPT,
                        lastSeen: row.LASTSEEN,
                        port: row.PORT,
                    }
                    const key = PeerDatabase.ipeer2key(peer)
                    ret.push(key)
                }
                resolve(ret)
            })
        })
    }

    public async close() {
        this.db.close()
    }

    protected async getAll(condition: string): Promise<proto.IPeer[]> {
        const sql = `SELECT * FROM peerdb WHERE KEY NOT IN (${condition}) AND FAILCOUNT=0`
        return new Promise<proto.IPeer[]>((resolve, reject) => {
            this.db.all(sql, (err: any, rows: any) => {
                let ret: proto.IPeer[] = []
                for (let row of rows) {
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

    protected doInsert(db: any, peer: proto.IPeer) {
        const key = PeerDatabase.ipeer2key(peer)
        const sql = `INSERT INTO peerdb (
                                    KEY,
                                    HOST,
                                    PORT,
                                    LASTSEEN,
                                    FAILCOUNT,
                                    LASTATTEMPT,
                                    ACTIVE,
                                    CURRENTQUEUE
                                ) VALUES (
                                    $key,
                                    $host,
                                    $port,
                                    $lastSeen,
                                    $failCount,
                                    $lastAttempt,
                                    $active,
                                    $currentQueue
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
        }
        db.run(sql, params, function (err: any) {
        })
    }
    protected async insert(peer: proto.IPeer): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db.beginTransaction((err: any, tx: any) => {
                this.doInsert(tx, peer)
                tx.commit((err: any) => {
                    resolve(!err)
                })
            })
        })
    }


}
