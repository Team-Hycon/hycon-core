import { randomBytes } from "crypto"
import ipaddr = require("ipaddr.js")
import { getLogger } from "log4js"
import * as net from "net"
import { Block } from "../../common/block"
import { ITxPool } from "../../common/itxPool"
import { RobustPromises } from "../../common/robustPromises"
import { IConsensus } from "../../consensus/iconsensus"
import { globalOptions } from "../../main"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { INetwork } from "../inetwork"
import { IPeer } from "../ipeer"
import { NatUpnp } from "../nat"
import { PeerDatabase } from "../peerDatabase"
import { PeerModel } from "../peerModel"
import { UpnpClient, UpnpServer } from "../upnp"
import { RabbitPeer } from "./rabbitPeer"

const logger = getLogger("Network")

export class RabbitNetwork implements INetwork {
    public static socketTimeout: number = 2048 * 8

    public static seeds: proto.IPeer[] = [
        { host: "rapid.hycon.io", port: 8148 },
    ]

    public static normalizeHost(host: string): string {
        try {
            let ipAddress = ipaddr.parse(host)
            if (ipAddress instanceof ipaddr.IPv6) {
                if (!ipAddress.isIPv4MappedAddress()) {
                    return ipAddress.toNormalizedString()
                }
                ipAddress = ipAddress.toIPv4Address()
            }
            return ipAddress.toNormalizedString()
        } catch (e) {
            return host
        }
    }

    public networkid: string = "hycon"
    public readonly version: number = 10
    public port: number
    public publicPort: number
    public guid: string // unique id to prevent self connecting
    public peers: Map<string, RabbitPeer>
    private txPool: ITxPool
    private consensus: IConsensus
    private server: net.Server

    private peerDatabase: PeerDatabase
    private targetConnectedPeers: number
    private pendingConnections: Set<string>
    private connections: Set<string>
    private upnpServer: UpnpServer
    private upnpClient: UpnpClient
    private natUpnp: NatUpnp

    constructor(txPool: ITxPool, consensus: IConsensus, port: number = 8148, peerDbPath: string = "peerdb", networkid: string = "hycon") {
        this.txPool = txPool
        this.consensus = consensus
        this.port = port
        this.networkid = networkid
        this.targetConnectedPeers = 50
        this.peers = new Map<string, RabbitPeer>()
        this.pendingConnections = new Set<string>()
        this.connections = new Set<string>()
        this.peerDatabase = new PeerDatabase(peerDbPath)
        this.guid = new Hash(randomBytes(32)).toString()
        this.consensus.on("txs", (txs) => { this.broadcastTxs(txs) })
        this.consensus.on("blockBroadcast", (block: Block) => { this.broadcastBlocks([block]) })
        logger.info(`TcpNetwork Port=${port} Session Guid=${this.guid}`)
    }

    public async getPeerDb(): Promise<PeerModel[]> {
        return this.peerDatabase.getAll()
    }

    public async addPeer(ip: string, port: number): Promise<void> {
        await this.connect(ip, port)
    }

    public async getConnection(): Promise<PeerModel[]> {
        const connection: PeerModel[] = []
        for (const [host, peer] of this.peers) {
            try {
                let peerModel = await this.peerDatabase.get(host)
                if (peer === undefined) {
                    peerModel = new PeerModel()
                    peerModel.host = host
                    peerModel.port = peer.listenPort
                }
                connection.push(peerModel)
            } catch (e) {
                logger.debug(`GetConnection: ${e}`)
            }
        }
        return connection
    }

    public getConnectionCount(): number {
        return this.peers.size
    }
    public getIPeers(exempt?: RabbitPeer): proto.IPeer[] {
        const ipeers: proto.IPeer[] = []
        for (const peer of this.peers.values()) {
            if (!peer.listenPort || exempt === peer) {
                continue
            }
            ipeers.push({
                host: RabbitNetwork.normalizeHost(peer.socketBuffer.getIp()),
                port: peer.listenPort,
            })
        }
        return ipeers
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
        if (this.peerDatabase !== undefined) {
            try {
                await this.peerDatabase.init()
            } catch (e) {
                logger.error(`Fail to init peerdatabase table: ${e}`)
            }
        }

        this.server = net.createServer((socket) => this.accept(socket).catch(() => undefined))
        this.server.on("error", (e) => logger.warn(`Listen socket error: ${e}`))
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
            if (this.natUpnp.publicPort) {
                this.publicPort = this.natUpnp.publicPort
            }
        }

        this.connectSeeds()

        this.connectLoop()

        setInterval(() => {
            this.showInfo()
            logger.info(`Peers Count=${this.peers.size}`)
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

    public getPeers(): IPeer[] {
        const peers: IPeer[] = []
        for (const peer of this.peers.values()) {
            peers.push(peer)
        }
        return peers
    }

    public async connect(host: string, port: number, save: boolean = true): Promise<RabbitPeer> {
        host = RabbitNetwork.normalizeHost(host)

        if (this.peers.has(host)) {
            throw new Error(`Already connected to ${host}:${port}`)
        }

        if (this.pendingConnections.has(host)) {
            throw new Error(`Already connecting to ${host}:${port}`)
        }
        this.pendingConnections.add(host)

        try {
            logger.debug(`Attempting to connect to ${host}:${port}...`)
            await this.peerDatabase.connecting(host, port)
            let connected = false
            const socket = new net.Socket()
            socket.on("error", () => {
                if (!connected) {
                    this.peerDatabase.failedToConnect(host, port)
                }
            })

            return await new Promise<RabbitPeer>((resolve, reject) => {
                socket.connect({ host, port }, async () => {
                    connected = true
                    try {
                        const newPeer = await this.newConnection(socket, host, save)
                        socket.on("close", async () => { this.peerDatabase.disconnect(host, port) })
                        this.peerDatabase.outBoundConnection(host, port)
                        resolve(newPeer)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
        } finally {
            this.pendingConnections.delete(host)
        }
    }

    private async accept(socket: net.Socket): Promise<void> {
        try {
            socket.once("error", (e) => logger.debug(`Accept socket error: ${e}`))
            const host = RabbitNetwork.normalizeHost(socket.remoteAddress)
            const peer = await this.newConnection(socket, host)
            socket.on("close", async () => { this.peerDatabase.disconnect(host, peer.listenPort) })
            this.peerDatabase.inBoundConnection(host, peer.listenPort)
        } catch (e) {
            logger.debug(e)
        }
    }

    private async newConnection(socket: net.Socket, host: string, save: boolean = true): Promise<RabbitPeer> {
        if (this.connections.has(host)) {
            socket.end()
            socket.destroy()
            throw new Error(`Already connected to ${host}`)
        }
        this.connections.add(host)
        socket.on("close", async () => { this.connections.delete(host) })

        socket.on("error", async (e) => {
            logger.debug(`error in connection to ${host}:${socket.remotePort}: ${e}`)
        })
        socket.on("timeout", async () => {
            socket.end()
            socket.destroy()
        })
        socket.on("end", async () => {
            socket.end()
            socket.destroy()
        })
        socket.setKeepAlive(true, 2048)
        socket.setNoDelay(true)
        socket.setTimeout(RabbitNetwork.socketTimeout)

        const peer = new RabbitPeer(socket, this, this.consensus, this.txPool, this.peerDatabase)
        if (this.peers.has(host)) {
            socket.end()
            socket.destroy()
            throw new Error(`Already connected to ${host}`)
        }
        this.peers.set(host, peer)
        socket.on("close", async () => {
            this.peers.delete(host)
        })
        const peerStatus = await peer.detectStatus()
        logger.info(`Connected to ${host}:${socket.remotePort}\tVersion:${peerStatus.version}\tGUID: ${peerStatus.guid}\tListening Port: ${peer.listenPort}`)
        return peer
    }

    private async connectLoop() {
        if (this.peers.size < 5) {
            try {
                const connectPromises = new RobustPromises<RabbitPeer>()
                const ipeers = await this.peerDatabase.getRecentPeers(30)
                for (const { host, port } of ipeers) {
                    const connectPromise = this.connect(host, port).catch((e) => logger.debug(e))
                    connectPromises.add(connectPromise)
                }
                await connectPromises.all()
            } catch (e) {
                logger.warn(`Connecting to Peer: ${e}`)
            }
        }
        if (this.peers.size < this.targetConnectedPeers) {
            try {
                const [randomPeer] = await this.peerDatabase.getRandomPeer(1)
                this.connect(randomPeer.host, randomPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.warn(`Connecting to Peer: ${e}`)
            }
            try {
                const [recentPeer] = await this.peerDatabase.getSeenPeers(1)
                this.connect(recentPeer.host, recentPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.warn(`Connecting to Peer: ${e}`)
            }
            try {
                const [leastRecentPeer] = await this.peerDatabase.getLeastRecentPeer(1)
                this.connect(leastRecentPeer.host, leastRecentPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.warn(`Connecting to Peer: ${e}`)
            }
        }
        setTimeout(() => this.connectLoop(), 3000)
    }

    private async connectSeeds() {
        for (const seed of RabbitNetwork.seeds) {
            try {
                const rabbitPeer = await this.connect(seed.host, seed.port, false)
                const peers = await rabbitPeer.getPeers()
                rabbitPeer.disconnect()
                const info: proto.IPeer[] = []
                for (let { host, port } of peers) {
                    host = RabbitNetwork.normalizeHost(host)
                    if (port < 0 || port > 65535) {
                        continue
                    }
                    info.push({ host, port })
                }
                await this.peerDatabase.putPeers(info)
            } catch (e) {
                logger.debug(`Error occurred while connecting to seeds: ${e}`)
            }
        }
    }
}
