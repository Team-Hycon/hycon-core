import { randomBytes } from "crypto"
import { getLogger } from "log4js"
import * as net from "net"
import { ITxPool } from "../../common/itxPool"
import { IConsensus } from "../../consensus/iconsensus"
import { globalOptions } from "../../main"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { INetwork } from "../inetwork"
import { IPeer } from "../ipeer"
import { NatUpnp } from "../nat"
import { PeerDatabase } from "../peerDatabase"

import { UpnpClient, UpnpServer } from "../upnp"
import { RabbitPeer } from "./rabbitPeer"

const logger = getLogger("Network")

export class RabbitNetwork implements INetwork {
    public static useSelfConnection = false
    public static seeds: any[] = [
        { host: "rapid1.hycon.io", port: 8148 },
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
    public readonly version: number = 5
    public port: number
    public publicPort: number
    public guid: string // unique id to prevent self connecting
    public peers: Map<number, RabbitPeer>
    private txPool: ITxPool
    private consensus: IConsensus
    private server: net.Server

    private peerDatabase: PeerDatabase
    private targetConnectedPeers: number
    private pendingConnections: Map<number, Promise<RabbitPeer>>
    private upnpServer: UpnpServer
    private upnpClient: UpnpClient
    private natUpnp: NatUpnp

    constructor(txPool: ITxPool, consensus: IConsensus, port: number = 8148, peerDbPath: string = "peerdb", networkid: string = "hycon") {
        RabbitNetwork.failLimit = 10
        RabbitNetwork.socketTimeout = 300000
        this.txPool = txPool
        this.consensus = consensus
        this.port = port
        this.publicPort = -1
        this.networkid = networkid
        this.targetConnectedPeers = 50
        this.peers = new Map<number, RabbitPeer>()
        this.pendingConnections = new Map<number, Promise<RabbitPeer>>()
        this.peerDatabase = new PeerDatabase(peerDbPath)
        this.guid = new Hash(randomBytes(32)).toString()
        this.consensus.on("txs", (txs) => { this.broadcastTxs(txs) })
        logger.info(`TcpNetwork Port=${port} Session Guid=${this.guid}`)
    }

    public async getPeerDb(): Promise<proto.IPeer[]> {
        const peerList: proto.IPeer[] = []
        let isActive: boolean = false
        const keys: number[] = await this.peerDatabase.getKeys()
        for (const key of keys) {
            isActive = this.peers.has(key)
            const value = await this.peerDatabase.get(key)
            if (value) {
                value.active = isActive
                peerList.push(value)
            }
        }
        return peerList
    }

    public async addPeer(ip: string, port: number): Promise<void> {
        // add or update to the database
        await this.peerDatabase.put({ host: ip, port })
        await this.connect(ip, port)
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

    public getIPeers(exempt?: RabbitPeer): proto.IPeer[] {
        const ipeers: proto.IPeer[] = []
        for (const peer of this.peers.values()) {
            if (!peer.listenPort || exempt === peer) {
                continue
            }
            ipeers.push({
                host: peer.socketBuffer.getIp(),
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

        if (this.peerDatabase !== undefined) {
            await this.peerDatabase.init()
        }
        // initial peerDB

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
            this.natUpnp.run()
            if (!isNaN(this.natUpnp.publicPort)) {
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

    public async connect(host: string, port: number, save: boolean = true): Promise<RabbitPeer> {
        const ipeer = { host, port }
        const key = PeerDatabase.ipeer2key(ipeer)

        if (this.pendingConnections.has(key)) {
            return this.pendingConnections.get(key)
        }

        try {
            const peerPromise = new Promise<RabbitPeer>(async (resolve, reject) => {
                logger.debug(`Attempting to connect to ${host}:${port}...`)
                const socket = new net.Socket()
                socket.once("error", () => reject(`Failed to connect to ${key}: ${host}:${port}`))
                socket.once("timeout", () => reject(`Timeout to connect to ${key}: ${host}:${port}`))
                socket.connect({ host, port }, async () => {
                    try {
                        const newPeer = await this.newConnection(socket, save)
                        ipeer.host = socket.remoteAddress
                        resolve(newPeer)
                    } catch (e) {
                        reject(e)
                    }
                })
            })

            this.pendingConnections.set(key, peerPromise)
            const peer = await peerPromise // Await here to delay the finally block
            return peer
        } catch (e) {
            // and we don't have connection
            if (save && !this.peers.has(key)) {
                await this.peerDatabase.fail(ipeer, RabbitNetwork.failLimit)
            }
        } finally {
            this.pendingConnections.delete(key)
        }
        return undefined
    }

    private async accept(socket: net.Socket): Promise<void> {
        try {
            socket.once("error", (e) => logger.warn(`Accept socket error: ${e}`))
            logger.debug(`Detect a incoming peer ${RabbitNetwork.ipNormalise(socket.remoteAddress)}:${socket.remotePort}`)
            const peer = await this.newConnection(socket)
        } catch (e) {
            logger.debug(e)
        }
    }

    private async newConnection(socket: net.Socket, save: boolean = true): Promise<RabbitPeer> {

        const peer = new RabbitPeer(socket, this, this.consensus, this.txPool, this.peerDatabase)
        const peerStatus = await peer.detectStatus()
        const port = peerStatus.publicPort > 0 ? peerStatus.publicPort : peerStatus.port
        const ipeer = { host: socket.remoteAddress, port }
        const key = PeerDatabase.ipeer2key(ipeer)

        socket.on("error", async () => {
            socket.end()
            this.peers.delete(key)
            logger.debug(`error in connection to ${key} ${ipeer.host}:${ipeer.port}`)
        })
        socket.on("timeout", async () => {
            socket.end()
            this.peers.delete(key)
            logger.debug(`connection timeout on ${key} ${ipeer.host}:${ipeer.port}`)
        })
        socket.on("close", async () => {
            socket.end()
            this.peers.delete(key)
            logger.debug(`disconnected from ${key} ${ipeer.host}:${ipeer.port}`)
        })
        socket.on("end", async () => {
            socket.end()
            this.peers.delete(key)
            logger.debug(`ended connection with ${key} ${ipeer.host}:${ipeer.port}`)
        })
        socket.setTimeout(RabbitNetwork.socketTimeout)
        this.peers.set(key, peer)

        if (save) {
            await this.peerDatabase.seen({ port, host: socket.remoteAddress })
            // only receive connected peers
            // so failCount is 0
            const newIPeers = await peer.getPeers()
            for (const peer of newIPeers) {
                await this.peerDatabase.put({ host: peer.host, port: peer.port, failCount: 0 })
            }
        }

        logger.info(`Connected to ${peer.socketBuffer.getInfo()} GUID: ${peerStatus.guid}, Listening Port: ${port}`)
        return peer
    }

    private connectLoop() {
        this.connectToPeer()
        setTimeout(() => this.connectLoop(), 1000)
    }
    private async connectToPeer(): Promise<void> {
        if (this.peers.size >= this.targetConnectedPeers) {
            return
        }

        try {
            const exempt = this.getIPeers()
            const ipeer = await this.peerDatabase.getRandomPeer(exempt)
            if (ipeer === undefined) {
                return
            }
            const rabbitPeer = await this.connect(ipeer.host, ipeer.port)
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
                // these list can be very huge
                // accept host, port only
                for (const peer of peers) {
                    await this.peerDatabase.put({ host: peer.host, port: peer.port })
                }
            }
        } catch (e) {
            logger.debug(`Error occurred while connecting to seeds: ${e}`)
        }
    }
}
