import { randomBytes } from "crypto"
import { getLogger } from "log4js"
import * as net from "net"
import { createServer, Socket } from "net"
import * as netmask from "netmask"
import { ITxPool } from "../../common/itxPool"
import { IConsensus } from "../../consensus/iconsensus"
import { globalOptions } from "../../main"
import * as proto from "../../serialization/proto"
import { Server } from "../../server"
import { Hash } from "../../util/hash"
import { INetwork } from "../inetwork"
import { IPeer } from "../ipeer"
import { NatUpnp } from "../nat"
import { PeerDb } from "../peerDb"
import { UpnpClient, UpnpServer } from "../upnp"
import { RabbitPeer } from "./rabbitPeer"

const logger = getLogger("Network")

export class RabbitNetwork implements INetwork {
    public static useSelfConnection = false
    public static seeds: any[] = [
        { host: "rapid1.hycon.io", port: 8148 },
        { host: "rapid2.hycon.io", port: 8148 },
        { host: "rapid3.hycon.io", port: 8148 },
    ]
    public static failLimit: number

    public static socketTimeout: number

    public static ipNormalise(ipv6: string): string {
        const ipTemp: string[] = ipv6.split(":")
        if (ipTemp.length === 4) {
            return ipTemp[3]
        } else { return ipv6 }
    }
    public networkid: string = "hycon"
    public readonly version: number = 4
    public port: number
    public publicPort: number
    public guid: string // unique id to prevent self connecting
    private txPool: ITxPool
    private consensus: IConsensus
    private server: net.Server
    private peerDB: PeerDb
    private targetConnectedPeers: number
    private peers: Map<number, RabbitPeer>
    private endPoints: Map<number, proto.IPeer>
    private pendingConnections: Map<number, proto.IPeer>
    private upnpServer: UpnpServer
    private upnpClient: UpnpClient
    private natUpnp: NatUpnp

    constructor(txPool: ITxPool, consensus: IConsensus, port: number = 8148, peerDbPath: string = "peerdb", networkid: string = "hycon") {
        RabbitNetwork.failLimit = 10
        RabbitNetwork.socketTimeout = 5000
        this.txPool = txPool
        this.consensus = consensus
        this.port = port
        this.publicPort = -1
        this.networkid = networkid
        this.targetConnectedPeers = 50
        this.peers = new Map<number, RabbitPeer>()
        this.endPoints = new Map<number, proto.IPeer>()
        this.pendingConnections = new Map<number, proto.IPeer>()
        this.peerDB = new PeerDb(peerDbPath)
        this.guid = new Hash(randomBytes(32)).toString()
        this.consensus.on("txs", (txs) => { this.broadcastTxs(txs) })
        logger.info(`TcpNetwork Port=${port} Session Guid=${this.guid}`)
    }

    public async peerDBCheck(peer: RabbitPeer, peerStatus: proto.IStatus): Promise<void> {
        if (peerStatus && peerStatus.publicPort > 0) {
            logger.info(`Write PublicIP=${peerStatus.publicPort}  ${peer.socketBuffer.getInfo()}`)
            // it's not my self
            const socket = peer.getSocket()
            const ipeer = { host: RabbitNetwork.ipNormalise(socket.remoteAddress), port: peerStatus.publicPort }
            await this.peerDB.seen(ipeer)
            const key = PeerDb.ipeer2key(ipeer)
            this.endPoints.set(key, ipeer)
        }
    }
    public async guidCheck(peer: RabbitPeer, peerStatus: proto.IStatus): Promise<void> {
        if (peerStatus && peerStatus.guid !== this.guid) {
            // ok
            this.peerDBCheck(peer, peerStatus)
        } else {
            // the self connection
            logger.debug(`GuidCheck Self-Connection Disconnect ${peer.socketBuffer.getInfo()}`)
            peer.disconnect()
        }
    }

    public async getPeerDb(): Promise<proto.IPeer[]> {
        const peerList: proto.IPeer[] = []
        let isActive: boolean = false
        for (const key of this.peerDB.keys) {
            if (this.peers.has(key)) {
                isActive = true
            }
            const value = await this.peerDB.get(key)
            value.active = isActive
            peerList.push(value)
            isActive = false
        }
        return peerList
    }

    public getConnection(): proto.IPeer[] {
        const values = Array.from(this.peers.values())
        const connection: proto.IPeer[] = []
        for (const value of values) {
            const tp = {
                active: true,
                currentQueue: value.socketBuffer.getQueueLength(),
                host: value.socketBuffer.getIp(),
                port: value.socketBuffer.getPort(),
            }
            connection.push(tp)
        }
        return connection
    }

    public broadcastTxs(txs: proto.ITx[], exempt?: RabbitPeer): void {
        const packet = proto.Network.encode({ putTx: { txs } }).finish()
        this.broadcast(packet, exempt)
    }

    public broadcastBlocks(blocks: proto.IBlock[]): void {
        const packet = proto.Network.encode({ putBlock: { blocks } }).finish()
        this.broadcast(packet)
    }

    public broadcast(packet: Uint8Array, exempt?: RabbitPeer) {
        for (const [key, peer] of this.peers) {
            if (peer !== exempt) {
                peer.sendPacket(packet).catch((e) => logger.debug(e)) // TODO:
            }
        }
    }
    public async start(): Promise<boolean> {
        logger.debug(`Tcp Network Started`)
        // initial peerDB

        this.server = createServer((socket) => this.accept(socket).catch(() => undefined))
        await new Promise<boolean>((resolve, reject) => {
            this.server.once("error", reject)
            this.server.listen(this.port, () => {
                logger.info(`Listening ${this.port}`)
                resolve()
            })
        })

        this.server.on("error", (error) => logger.error(`${error}`))
        let useUpnp = true
        let useNat = true

        if (globalOptions.disable_upnp) {
            useUpnp = false
        }

        if (globalOptions.disable_nat) {
            useNat = false
        }

        if (useUpnp) {
            this.upnpServer = new UpnpServer(this.port)
            this.upnpClient = new UpnpClient(this)

        }

        if (useNat) {
            this.natUpnp = new NatUpnp(this.port, this)
            await this.natUpnp.run()
            if (!isNaN(this.natUpnp.publicPort)) {
                this.publicPort = this.natUpnp.publicPort
            }
        }

        await this.connectSeeds()

        this.connectLoop()

        setInterval(() => {
            logger.info(`Peers Count=${this.peers.size}  PeerDB Size= ${this.peerDB.peerCount()}`)
            this.showInfo()
            this.peerDB.printDB()
        }, 10 * 1000)
        setInterval(() => {
            this.connectSeeds()
        }, 60 * 1000)

        return true
    }

    public showInfo() {
        let i = 1
        logger.debug(`All Peers ${this.peers.size}`)
        for (const [key, value] of this.peers) {
            logger.debug(`${i}/${this.peers.size} ${value.socketBuffer.getInfo()}`)
            i++
        }
    }

    public getRandomPeer(): IPeer {
        const index = Math.floor(Math.random() * this.peers.size)
        const key = Array.from(this.peers.keys())[index]
        return this.peers.get(key)
    }

    public getRandomPeers(count: number = 1): IPeer[] {
        const randomList: number[] = []
        const iPeer: IPeer[] = []
        const key: number[] = Array.from(this.peers.keys())
        while (randomList.length < count) {
            const index = Math.floor(Math.random() * this.peers.size)
            if (randomList.indexOf(index) === -1) {
                randomList.push(index)
                iPeer.push(this.peers.get(key[index]))
            }
        }
        return iPeer
    }

    public async failedConnecting(key: number, ipeer: proto.IPeer) {
        try {
            this.pendingConnections.delete(key)
            await this.peerDB.fail(ipeer, RabbitNetwork.failLimit)
        } catch (e) {
            logger.debug(e)
        }
    }

    public async connect(host: string, port: number, save: boolean = true): Promise<RabbitPeer> {
        return new Promise<RabbitPeer>(async (resolve, reject) => {
            const ipeer = { host, port }
            const key = PeerDb.ipeer2key(ipeer)
            if (this.pendingConnections.has(key)) {
                reject(`Already connecting to ${host}:${port} `)
                return
            }

            if (this.endPoints.has(key)) {
                reject(`Already connected to ${host}:${port} `)
                return
            }
            this.pendingConnections.set(key, ipeer)
            logger.debug(`Attempting to connect to ${host}:${port}...`)
            const socket = new Socket()
            socket.setTimeout(RabbitNetwork.socketTimeout)
            socket.once("error", async () => {
                this.failedConnecting(key, ipeer)
                reject(`Failed to connect to ${key}: ${host}:${port}`)
            })
            socket.once("timeout", async () => {
                this.failedConnecting(key, ipeer)
                reject(`Timeout to connect to ${key}: ${host}:${port}`)
            })
            socket.connect({ host, port }, async () => {
                try {
                    const peer = await this.newConnection(socket)
                    logger.info(`Connected to ${key}: ${host}:${port} Info ${peer.socketBuffer.getInfo()}`)
                    ipeer.host = socket.remoteAddress
                    const peerStatus = await peer.detectStatus()
                    if (!RabbitNetwork.useSelfConnection) {
                        if (peerStatus !== undefined && peerStatus.guid === this.guid) {
                            reject("Peer is myself")
                            peer.disconnect()
                        }
                    }
                    if (peerStatus) {
                        if (save) {
                            this.endPoints.set(key, ipeer)
                            socket.on("close", () => this.endPoints.delete(key))
                            if (peerStatus.guid !== this.guid) { // if it is not local
                                await this.peerDB.seen(ipeer)
                            }
                        }
                        resolve(peer)
                        logger.debug(`Peer ${key} ${socket.remoteAddress}:${socket.remotePort}`)
                    } else {
                        await this.peerDB.fail(ipeer, RabbitNetwork.failLimit)
                        reject("Peer is using a different network")
                        peer.disconnect()
                    }
                    this.pendingConnections.delete(key)
                } catch (e) {
                    logger.warn(e)
                    reject(e)
                } finally {
                    reject("Unknown connection failure")
                }
            })
        })
    }

    private async accept(socket: Socket): Promise<void> {
        try {
            logger.debug(`Detect a incoming peer ${RabbitNetwork.ipNormalise(socket.remoteAddress)}:${socket.remotePort}`)
            const peer = await this.newConnection(socket)
        } catch (e) {
            logger.debug(e)
        }
    }

    private async newConnection(socket: Socket): Promise<RabbitPeer> {
        const peer = new RabbitPeer(socket, this, this.consensus, this.txPool, this.peerDB)
        const ipeer = { host: socket.remoteAddress, port: socket.remotePort }
        const key = PeerDb.ipeer2key(ipeer)
        this.peers.set(key, peer)
        // for (const newIPeer of await peer.getPeers()) {
        //     this.peerDB.put(newIPeer)
        // }
        socket.on("close", async () => {
            socket.end()
            this.peers.delete(key)
            this.endPoints.delete(key)
            logger.debug(`disconnected from ${key} ${ipeer.host}:${ipeer.port}`)
        })
        socket.on("end", async () => {
            socket.end()
            this.peers.delete(key)
            this.endPoints.delete(key)
            logger.debug(`ended connection with ${key} ${ipeer.host}:${ipeer.port}`)

        })
        socket.on("error", async (error) => {
            logger.debug(`Connection error ${key} ${ipeer.host}:${ipeer.port} : ${error}`)
        })
        return peer
    }

    private async connectLoop() {
        await this.connectToPeer()
        setTimeout(() => this.connectLoop(), 1000)
    }
    private async connectToPeer(): Promise<void> {
        try {
            const necessaryPeers = this.targetConnectedPeers - this.peers.size
            if (this.peers.size < this.targetConnectedPeers) {
                const ipeer = await this.peerDB.getRandomPeer(this.endPoints)
                if (ipeer !== undefined) {
                    const rabbitPeer = await this.connect(ipeer.host, ipeer.port)
                    const peers = await rabbitPeer.getPeers()
                    if (peers.length !== 0) {
                        for (const peer of peers) {
                            await this.peerDB.put({ host: peer.host, port: peer.port })
                        }
                    }
                }
            }
        } catch (e) {
            logger.debug(`Connecting to Peer: ${e}`)
        }
    }

    private async connectSeeds() {
        try {
            for (const seed of RabbitNetwork.seeds) {
                const rabbitPeer = await this.connect(seed.host, seed.port, false)
                const peers = await rabbitPeer.getPeers()
                rabbitPeer.disconnect()
                for (const peer of peers) {
                    await this.peerDB.put({ host: peer.host, port: peer.port })
                }
            }
        } catch (e) {
            logger.debug(`Error occurred while connecting to seeds: ${e}`)
        }
    }
}
