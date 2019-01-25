import { randomBytes } from "crypto"
import ipaddr = require("ipaddr.js")
import { getLogger } from "log4js"
import * as net from "net"
import { Block } from "../common/block"
import { RobustPromises } from "../common/robustPromises"
import { TxPool } from "../common/txPool"
import { Consensus } from "../consensus/consensus"
import { userOptions } from "../main"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { NatUpnp } from "./nat"
import { Peer } from "./peer"
import { PeerDatabase } from "./peerDatabase"
import { PeerModel } from "./peerModel"
import { UpnpClient, UpnpServer } from "./upnp"

const logger = getLogger("Network")

export class Network {
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
    public readonly version: number = 13
    public port: number
    public publicPort: number
    public guid: string // unique id to prevent self connecting
    public peers: Map<string, Peer>
    private txPool: TxPool
    private consensus: Consensus
    private server: net.Server

    private peerDatabase: PeerDatabase
    private targetConnectedPeers: number
    private upnpServer: UpnpServer
    private upnpClient: UpnpClient
    private natUpnp: NatUpnp

    constructor(txPool: TxPool, consensus: Consensus, port: number = 8148, peerDbPath: string = "peerdb", networkid: string = "hycon") {
        this.txPool = txPool
        this.consensus = consensus
        this.port = port
        this.networkid = networkid
        this.targetConnectedPeers = 50
        this.peers = new Map<string, Peer>()
        this.peerDatabase = new PeerDatabase(peerDbPath)
        this.guid = new Hash(randomBytes(32)).toString()
        this.consensus.on("txs", (txs) => { this.broadcastTxs(txs) })
        this.consensus.on("blockBroadcast", (block: Block) => { this.broadcastBlocks([block]) })
        this.consensus.on("missingUncles", (height: number, missingHashes: Hash[]) => { this.getMissingUncles(height, missingHashes) })
        logger.info(`TcpNetwork Port=${port} Session Guid=${this.guid}`)
    }

    public async getPeerDb(): Promise<PeerModel[]> {
        return this.peerDatabase.getAll()
    }

    public async addPeer(ip: string, port: number): Promise<void> {
        await this.connect(ip, port)
    }

    public async getConnection(): Promise<PeerModel[]> {
        return this.peerDatabase.getAll()
    }

    public getConnectionCount(): number {
        return this.peers.size
    }
    public getIPeers(exempt?: Peer): proto.IPeer[] {
        const ipeers: proto.IPeer[] = []
        for (const peer of this.peers.values()) {
            if (!peer.listenPort || exempt === peer) {
                continue
            }
            ipeers.push({
                host: Network.normalizeHost(peer.socketBuffer.getIp()),
                port: peer.listenPort,
            })
        }
        return ipeers
    }

    public broadcastTxs(txs: proto.ITx[], exempt?: Peer): void {
        const packet = proto.Network.encode({ putTx: { txs } }).finish()
        this.broadcast(packet, exempt)
    }

    public broadcastHeaders(headers: proto.IBlockHeader[]): void {
        const packet = proto.Network.encode({ putHeaders: { headers } }).finish()
        this.broadcast(packet)
    }

    public broadcastBlocks(blocks: proto.IBlock[]): void {
        const packet = proto.Network.encode({ putBlock: { blocks } }).finish()
        this.broadcast(packet)
    }

    public broadcast(packet: Uint8Array, exempt?: Peer) {
        for (const peer of this.peers.values()) {
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

        if (userOptions.disable_upnp) {
            useUpnp = false
        }

        if (userOptions.disable_nat) {
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
            logger.info(`Peers Count=${this.peers.size}`)
        }, 20 * 1000)
        setInterval(() => {
            this.connectSeeds()
        }, 5 * 60 * 1000)

        return true
    }

    public getPeers(): Peer[] {
        const peers: Peer[] = []
        for (const peer of this.peers.values()) {
            peers.push(peer)
        }
        return peers
    }

    public async connect(host: string, port: number, save: boolean = true): Promise<Peer> {
        host = Network.normalizeHost(host)
        await this.peerDatabase.connecting(host, port)
        let owned = false
        const socket = new net.Socket()
        socket.on("error", async (e) => logger.debug(e))
        return await new Promise<Peer>((resolve, reject) => {
            socket.on("close", async () => {
                reject("Disconnect")
                if (owned) {
                    this.peerDatabase.disconnect(host, port)
                } else {
                    this.peerDatabase.failedToConnect(host, port)
                }
            })
            socket.connect({ host, port }, async () => {
                try {
                    const newPeer = await this.newConnection(socket, host, save)
                    owned = true
                    this.peerDatabase.outBoundConnection(host, port)
                    resolve(newPeer)
                } catch (e) {
                    socket.destroy()
                    reject(e)
                }
            })
        })
    }

    public getPeerDatabase() {
        return this.peerDatabase
    }

    private async accept(socket: net.Socket): Promise<void> {
        try {
            socket.once("error", (e) => logger.debug(`Accept socket error: ${e}`))
            const host = Network.normalizeHost(socket.remoteAddress)
            const peer = await this.newConnection(socket, host)
            socket.on("close", async () => { this.peerDatabase.disconnect(host, peer.listenPort) })
            this.peerDatabase.inBoundConnection(host, peer.listenPort)
        } catch (e) {
            socket.destroy()
            logger.debug(e)
        }
    }

    private async newConnection(socket: net.Socket, host: string, save: boolean = true): Promise<Peer> {
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
        socket.setTimeout(Network.socketTimeout)

        const peer = new Peer(socket, this, this.consensus, this.txPool, this.peerDatabase)
        const peerStatus = await peer.detectStatus()

        logger.info(`Connected to ${host}:${socket.remotePort}\tVersion:${peerStatus.version}\tGUID: ${peerStatus.guid}\tListening Port: ${peer.listenPort}`)
        return peer
    }

    private async connectLoop() {
        if (this.peers.size < 5) {
            try {
                const connectPromises = new RobustPromises<Peer>()
                const targetRecentPeers = Math.max(Math.floor(this.targetConnectedPeers / 2), 5)
                const ipeers = await this.peerDatabase.getRecentPeers(targetRecentPeers)
                for (const { host, port } of ipeers) {
                    const connectPromise = this.connect(host, port).catch((e) => logger.debug(e))
                    connectPromises.add(connectPromise)
                }
                await connectPromises.all()
            } catch (e) {
                logger.debug(`Connecting to recentPeer: ${e}`)
            }
        }
        if (this.peers.size < this.targetConnectedPeers) {
            try {
                const [randomPeer] = await this.peerDatabase.getRandomPeer(1)
                this.connect(randomPeer.host, randomPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.debug(`Connecting to randomPeer: ${e}`)
            }
            try {
                const [recentPeer] = await this.peerDatabase.getSeenPeers(1)
                this.connect(recentPeer.host, recentPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.debug(`Connecting to seenPeer: ${e}`)
            }
            try {
                const [leastRecentPeer] = await this.peerDatabase.getLeastRecentPeer(1)
                this.connect(leastRecentPeer.host, leastRecentPeer.port).catch((e) => logger.debug(e))
            } catch (e) {
                logger.debug(`Connecting to leastRecentPeer: ${e}`)
            }
        }
        const delay = 3000 + Math.min(this.peers.size * 1000, 17000)
        setTimeout(() => this.connectLoop(), delay)
    }

    private async connectSeeds() {
        const index = Math.floor(Math.random() * Network.seeds.length)
        const seed = Network.seeds[index]
        try {
            const rabbitPeer = await this.connect(seed.host, seed.port, false)
            const peers = await rabbitPeer.getPeers()
            rabbitPeer.disconnect()
            const info: proto.IPeer[] = []
            for (let { host, port } of peers) {
                host = Network.normalizeHost(host)
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

    private async getMissingUncles(height: number, missingUncles: Hash[]) {
        const peers = this.getPeers()
        for (const peer of peers) {
            const tipHeight = peer.getTipHeight()
            if (tipHeight === undefined || tipHeight < height) { continue }
            try {
                if (await peer.getMissingUncles(missingUncles)) { break }
            } catch (e) {
                logger.debug(`Could not get get Missing Uncles : ${e}`)
            }
        }
    }
}
