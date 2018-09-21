import { getLogger } from "log4js"
import "reflect-metadata"
import { Connection, createConnection } from "typeorm"
import { AsyncLock } from "../common/asyncLock"
import * as proto from "../serialization/proto"
import { IPeerDatabase } from "./ipeerDatabase"
import { PeerModel } from "./peerModel"
import { RabbitNetwork } from "./rabbit/rabbitNetwork"
const logger = getLogger("PeerDb")

const PEER_EXPIRATION_TIME = 1000 * 60 * 60 * 6

export class PeerDatabase implements IPeerDatabase {
    private connection: Connection
    private dbLock: AsyncLock
    private readonly path: string

    constructor(path: string) {
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
            await this.connection.createQueryBuilder().update(PeerModel).set({ active: 0 }).execute()
            await this.dbLock.releaseLock()
        } catch (e) {
            logger.debug(`DB init error: ${e}`)
            throw e
        }
    }

    public async connecting(host: string, port: number): Promise<void> {
        return this.dbLock.critical(async () => {
            let peerData = await this.connection.manager.findOne(PeerModel, { where: { host, port } })
            if (peerData === undefined) {
                peerData = new PeerModel()
                peerData.failCount = 0
                peerData.successOutCount = 0
                peerData.successInCount = 0
                peerData.host = host
                peerData.port = port
            }
            peerData.lastAttempt = Date.now()
            if (peerData.active === 1) {
                throw new Error("Already connecting to peer")
            }
            if (peerData.active === 2) {
                throw new Error("Already connected to peer")
            }
            peerData.active = 1
            await this.connection.manager.save(peerData)
        })
    }
    public async inBoundConnection(host: string, port: number): Promise<void> {
        return this.dbLock.critical(async () => {
            try {
                let peerData = await this.connection.manager.findOne(PeerModel, { where: { host, port } })
                if (peerData === undefined) {
                    peerData = new PeerModel()
                    peerData.failCount = 0
                    peerData.successOutCount = 0
                    peerData.successInCount = 0
                    peerData.host = host
                    peerData.port = port
                }
                peerData.lastSeen = Date.now()
                peerData.successInCount += 1
                if (peerData.active === 2) {
                    logger.warn(`It seems like peer ${host}:${port} is using multiple GUIDs`)
                }
                peerData.active = 2
                await this.connection.manager.save(peerData)
            } catch (e) {
                logger.debug(`inBoundConnection: ${e}`)
            }
        })
    }
    public async outBoundConnection(host: string, port: number): Promise<void> {
        return this.dbLock.critical(async () => {
            try {
                let peerData = await this.connection.manager.findOne(PeerModel, { where: { host, port } })
                if (peerData === undefined) {
                    peerData = new PeerModel()
                    peerData.failCount = 0
                    peerData.successOutCount = 0
                    peerData.successInCount = 0
                    peerData.host = host
                    peerData.port = port
                }
                peerData.lastSeen = Date.now()
                peerData.successOutCount += 1
                if (peerData.active === 2) {
                    logger.warn(`It seems like peer ${host}:${port} is using multiple GUIDs`)
                }
                peerData.active = 2
                await this.connection.manager.save(peerData)
            } catch (e) {
                logger.debug(`outBoundConnection: ${e}`)
            }
        })
    }

    public async failedToConnect(host: string, port: number): Promise<void> {
        return this.dbLock.critical(async () => {
            try {
                let peerData = await this.connection.manager.findOne(PeerModel, { where: { host, port } })
                if (peerData === undefined) {
                    peerData = new PeerModel()
                    peerData.failCount = 0
                    peerData.successOutCount = 0
                    peerData.successInCount = 0
                    peerData.host = host
                    peerData.port = port
                }
                if (peerData.active === 2) {
                    // Some other connection may have taken ownership of this peer
                    throw new Error("Could not mark failure to connect, as it seems to be connected.")
                }

                peerData.active = 0
                peerData.lastAttempt = Date.now()
                peerData.failCount += 1

                if (peerData.failCount >= 5 && peerData.lastSeen < Date.now() - PEER_EXPIRATION_TIME) {
                    await this.connection.manager.delete(PeerModel, { host, port })
                } else {
                    await this.connection.manager.save(peerData)
                }
            } catch (e) {
                logger.debug(`failedToConnect: ${e}`)
            }
        })
    }

    public async get(host: string) {
        return this.connection.manager.findOne(PeerModel, { where: { host } })
    }

    public async disconnect(host: string, port: number) {
        await this.connection.createQueryBuilder().update(PeerModel).set({ active: 0 }).where("host = :host and port = :port", { host, port }).execute()
    }

    public async putPeers(peers: proto.IPeer[]) {
        for (let { host, port } of peers) {
            try {
                host = RabbitNetwork.normalizeHost(host)
                const peerExist = await this.connection.manager.findOne(PeerModel, { where: { host, port } })
                if (peerExist === undefined) {
                    const peerModel = new PeerModel()
                    peerModel.host = host
                    peerModel.port = port
                    await this.connection.manager.save(peerModel)
                }
            } catch (e) {
                logger.debug(`putPeers error: ${e}`)
            }
        }
    }

    public async getRecentPeers(limit: number = 20): Promise<proto.IPeer[]> {
        const rows = await this.connection.manager.query(`SELECT * FROM peer_model where active = 0 ORDER BY lastAttempt != 0 DESC, lastAttempt == lastSeen DESC, lastSeen DESC LIMIT ?`, [limit])
        if (rows === undefined || rows.length === 0) {
            throw new Error("Unexpected return from peer database")
        }
        const peers: proto.IPeer[] = []
        for (const row of rows) {
            if (peers.length >= limit) {
                break
            }
            peers.push({ host: row.host, port: row.port })
        }
        return peers
    }

    public async getSeenPeers(limit: number = 1): Promise<proto.IPeer[]> {
        const rows = await this.connection.manager.query(`SELECT * FROM peer_model where active = 0 ORDER BY lastSeen !=0 DESC, failCount ASC, random() ASC LIMIT ?`, [limit])
        if (rows === undefined || rows.length === 0) {
            throw new Error("Unexpected return from peer database")
        }
        const peers: proto.IPeer[] = []
        for (const row of rows) {
            if (peers.length >= limit) {
                break
            }
            peers.push({ host: row.host, port: row.port })
        }
        return peers
    }

    public async getLeastRecentPeer(limit: number = 1): Promise<proto.IPeer[]> {
        return this.dbLock.critical(async () => {
            const rows = await this.connection.manager.query(`SELECT * FROM peer_model WHERE active = 0 ORDER BY lastAttempt ASC, random() DESC LIMIT ?`, [limit])
            if (rows === undefined || rows.length === 0) {
                throw new Error("Unexpected return from peer database")
            }
            const peers: proto.IPeer[] = []
            for (const row of rows) {
                if (peers.length >= limit) {
                    break
                }
                peers.push({ host: row.host, port: row.port })
            }
            return peers
        })
    }

    public async getRandomPeer(limit: number = 1): Promise<proto.IPeer[]> {
        return this.dbLock.critical(async () => {
            const rows = await this.connection.manager.query(`SELECT * FROM peer_model WHERE active = 0 ORDER BY RANDOM() DESC LIMIT ?`, [limit])
            if (rows === undefined || rows.length === 0) {
                throw new Error("Unexpected return from peer database")
            }
            const peers: proto.IPeer[] = []
            for (const row of rows) {
                if (peers.length >= limit) {
                    break
                }
                peers.push({ host: row.host, port: row.port })
            }
            return peers
        })
    }

    public getAll(): Promise<PeerModel[]> {
        return this.connection.manager.find(PeerModel)
    }
}
