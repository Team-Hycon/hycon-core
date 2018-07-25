import { getLogger } from "log4js"
import "reflect-metadata"
import { Connection, createConnection } from "typeorm"
import { AsyncLock } from "../common/asyncLock"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { INetwork } from "./inetwork"
import { IPeerDatabase } from "./ipeerDatabase"
import { PeerModel } from "./peerModel"
const logger = getLogger("PeerDb")
export class PeerDatabase implements IPeerDatabase {
    public static ipeer2key(peer: proto.IPeer): number {
        const hash = new Hash(peer.host + "!" + peer.port.toString())
        let key = 0
        for (let i = 0; i < 6; i++) {
            key = key * 256 + hash[i]
        }
        return key
    }

    public static model2ipeer(peerModel: PeerModel): proto.IPeer {
        const peer: proto.IPeer = {
            active: peerModel.active,
            currentQueue: peerModel.currentQueue,
            failCount: peerModel.failCount,
            host: peerModel.host,
            lastAttempt: peerModel.lastAttempt,
            lastSeen: peerModel.lastSeen,
            port: peerModel.port,
            successCount: peerModel.successCount,
        }
        return peer
    }

    private connection: Connection
    private maxPeerCount: number = 200
    private network: INetwork
    private path: string
    private dbLock: AsyncLock
    constructor(network: INetwork, path: string) {
        this.network = network
        this.path = path
        this.dbLock = new AsyncLock(1)
    }

    public async init() {
        try {
            this.connection = await createConnection({
                database: `${this.path}sql`,
                entities: [PeerModel],
                synchronize: true,
                type: "sqlite",
            })
            await this.dbLock.releaseLock()
            await this.reset()
        } catch (e) {
            logger.debug(`DB init error: ${e}`)
            throw e
        }
    }

    public async seen(peer: proto.IPeer): Promise<proto.IPeer> {
        try {
            if (peer.port > 10000) {
                return
            }
            return this.dbLock.critical(async () => {
                const key = PeerDatabase.ipeer2key(peer)
                const peerExist = await this.connection.manager.findOne(PeerModel, { key })
                if (peerExist) {
                    peerExist.lastSeen = Date.now()
                    peerExist.successCount += 1
                    peerExist.active = true
                    const ret = PeerDatabase.model2ipeer(await this.connection.manager.save(peerExist))
                    logger.debug(`seen peer : ${ret.host}~${ret.port}~${ret.active}`)
                    return ret
                } else {
                    const newPeer = new PeerModel()
                    newPeer.key = key
                    newPeer.host = peer.host
                    newPeer.port = peer.port
                    newPeer.lastSeen = Date.now()
                    newPeer.successCount = 1
                    newPeer.active = true
                    const ret = PeerDatabase.model2ipeer(await this.connection.manager.save(newPeer))
                    logger.debug(`seen peer : ${ret.host}~${ret.port}~${ret.active}`)
                    return ret
                }
            })
        } catch (e) {
            logger.debug(`seen peer error: ${e}`)
            throw e
        }
    }

    public async fail(peer: proto.IPeer): Promise<proto.IPeer> {
        try {
            if (peer.port > 10000) {
                return
            }
            return this.dbLock.critical(async () => {
                const key = PeerDatabase.ipeer2key(peer)
                const peerExist = await this.connection.manager.findOne(PeerModel, { key })
                if (peerExist) {
                    peerExist.lastAttempt = Date.now()
                    peerExist.failCount += 1
                    const ret = PeerDatabase.model2ipeer(await this.connection.manager.save(peerExist))
                    logger.debug(`fail peer : ${ret.host}~${ret.port}~${ret.active}`)
                    return ret
                } else {
                    const newPeer = new PeerModel()
                    newPeer.key = key
                    newPeer.host = peer.host
                    newPeer.port = peer.port
                    newPeer.lastAttempt = Date.now()
                    newPeer.active = false
                    const ret = PeerDatabase.model2ipeer(await this.connection.manager.save(newPeer))
                    logger.debug(`fail peer : ${ret.host}~${ret.port}~${ret.active}`)
                    return ret
                }
            })
        } catch (e) {
            logger.debug(`fail peer error: ${e}`)
            throw e
        }
    }

    public async deactivate(key: number) {
        try {
            return this.dbLock.critical(async () => {
                const peerExist = await this.connection.manager.findOne(PeerModel, { key })
                if (peerExist) {
                    peerExist.active = false
                    await this.connection.manager.save(peerExist)
                    logger.debug(`deactivate peer successful with key ${key}`)
                }
            })
        } catch (e) {
            logger.debug(`deactivate peer error: ${e}`)
            throw e
        }
    }

    public async putPeers(peers: proto.IPeer[]) {
        try {
            const tp = peers.splice(0, this.maxPeerCount)
            await this.doPutPeers(tp)
        } catch (e) {
            logger.debug(`put peers error: ${e}`)
            throw e
        }
    }

    public async getRandomPeer(): Promise<proto.IPeer> {
        try {
            let sql: string
            let wSuccess: number
            let wFail: number
            let wLastSeen: number
            let params: number[] = []
            let size = 0
            if (this.network) {
                size = this.network.getConnectionCount()
            }
            if (size < 20) {
                wLastSeen = 0.5
                wSuccess = 2
                wFail = 10
                sql = `SELECT * FROM peer_model WHERE active = 0 ORDER BY ABS(RANDOM()%100+1) *
                CASE WHEN
                    (?*successCount - ?*failCount + ?*(
                        CASE
                            WHEN (lastSeen = 0) THEN 0
                            WHEN (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60 > 100 THEN 0
                            ELSE 100 - (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60
                        END
                    )) = 0 THEN 1
                ELSE
                    (?*successCount - ?*failCount + ?*(
                        CASE
                            WHEN (lastSeen = 0) THEN 0
                            WHEN (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60 > 100 THEN 0
                            ELSE 100 - (strftime('%s', 'now')*1000 - lastSeen)/1000/60/60
                        END
                    ))
                END
                DESC LIMIT 1`
                params = [wSuccess, wFail, wLastSeen, wSuccess, wFail, wLastSeen]
            }
            if (size >= 20 && size < 40) {
                wSuccess = 2
                wFail = 10
                sql = `SELECT * FROM peer_model WHERE active = 0 ORDER BY ABS(RANDOM()%100+1) *
                CASE WHEN
                    (?*successCount - ?*failCount) = 0 THEN 1
                ELSE
                    (?*successCount - ?*failCount)
                END
                DESC LIMIT 1`
                params = [wSuccess, wFail, wSuccess, wFail]
            }
            if (size >= 40) {
                sql = `SELECT * FROM peer_model WHERE active = 0 ORDER BY RANDOM() DESC LIMIT 1`
            }
            return this.dbLock.critical(async () => {
                const rows = await this.connection.manager.query(sql, params)
                const res = PeerDatabase.model2ipeer(rows[0])
                logger.debug(`peer pick: ${res.host}~${res.port}~${res.successCount}~${res.lastSeen}~${res.failCount}~${res.lastAttempt}~${res.active}`)
                return res
            })
        } catch (e) {
            logger.debug(`get random peer error: ${e}`)
            throw e
        }
    }

    public async get(key: number): Promise<proto.IPeer> {
        try {
            return this.dbLock.critical(async () => {
                const res = await this.connection.manager.findOne(PeerModel, { key })
                if (res) {
                    return PeerDatabase.model2ipeer(res)
                } else {
                    // peer with the key not exist
                    return undefined
                }
            })
        } catch (e) {
            logger.debug(`get peer key error: ${e}`)
            throw e
        }
    }

    public async getKeys(): Promise<number[]> {
        try {
            return this.dbLock.critical(async () => {
                const rets = await this.connection.manager.query("Select key from peer_model")
                if (rets) {
                    const keys = []
                    for (const ret of rets) {
                        keys.push(ret.key)
                    }
                    return keys
                } else {
                    // no peers in db
                    return undefined
                }
            })
        } catch (e) {
            logger.debug(`get keys error: ${e}`)
            throw e
        }
    }

    public async removeAll(): Promise<void> {
        try {
            return this.dbLock.critical(async () => {
                await this.connection.manager.clear(PeerModel)
            })
        } catch (e) {
            logger.debug(`remove all peers: ${e}`)
        }
    }
    private async doPutPeers(peers: proto.IPeer[]) {
        try {
            await this.dbLock.critical(async () => {
                await this.connection.manager.transaction(async (manager) => {
                    for (const peer of peers) {
                        const key = PeerDatabase.ipeer2key(peer)
                        const peerExist = await manager.findOne(PeerModel, { key })
                        if (!peerExist) {
                            const peerModel = new PeerModel()
                            peerModel.key = key
                            peerModel.host = peer.host
                            peerModel.port = peer.port
                            await manager.save(peerModel)
                        }
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    private async reset() {
        try {
            const keys = await this.getKeys()
            this.dbLock.critical(async () => {
                await this.connection.manager.transaction(async (manager) => {
                    for (const key of keys) {
                        const res = await manager.findOne(PeerModel, { key })
                        res.active = false
                        await manager.save(res)
                    }
                })
            })
        } catch (e) {
            logger.debug(`reset error: ${e}`)
            throw e
        }
    }
}
