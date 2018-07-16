import { getLogger } from "log4js"
import * as Long from "long"
import { Socket } from "net"
import { AnyBlock, Block } from "../../common/block"
import { AnyBlockHeader, BlockHeader } from "../../common/blockHeader"
import { ITxPool } from "../../common/itxPool"
import { SignedTx } from "../../common/txSigned"
import { IConsensus, IStatusChange } from "../../consensus/iconsensus"
import { BlockStatus, BYTES_OVERHEAD, HASH_SIZE, MAX_TX_SIZE, MAX_TXS_PER_BLOCK, REPEATED_OVERHEAD, Sync } from "../../consensus/sync"
import { globalOptions } from "../../main"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { IPeer } from "../ipeer"
import { IPeerDatabase } from "../ipeerDatabase"
import { BasePeer } from "./basePeer"
import { RabbitNetwork } from "./rabbitNetwork"
import { MAX_PACKET_SIZE } from "./socketParser"
const logger = getLogger("NetPeer")

export interface IBlockTxs { hash: Hash, txs: SignedTx[] }
export class RabbitPeer extends BasePeer implements IPeer {
    public listenPort: number
    public guid: string
    private consensus: IConsensus
    private txPool: ITxPool
    private network: RabbitNetwork
    private peerDatabase: IPeerDatabase
    private sync: Sync

    constructor(socket: Socket, network: RabbitNetwork, consensus: IConsensus, txPool: ITxPool, peerDB: IPeerDatabase) {
        super(socket)
        // tslint:disable-next-line:max-line-length
        logger.debug(`New Netpeer Local=${RabbitNetwork.ipNormalise(socket.localAddress)}:${socket.localPort} --> Remote=${RabbitNetwork.ipNormalise(socket.remoteAddress)}:${socket.remotePort}`)
        this.network = network
        this.consensus = consensus
        this.txPool = txPool
        this.peerDatabase = peerDB
    }

    public async detectStatus(): Promise<proto.IStatus> {
        try {
            const status = await this.status()
            if (status === undefined) {
                throw new Error("Peer did not respond to status request")
            }
            if (status.networkid !== globalOptions.networkid) {
                throw new Error(`Peer is using different NetworkID(${status.networkid}) to expected value(${globalOptions.networkid})`)
            }
            if (status.guid === this.network.guid) {
                throw new Error(`Connected to self`)
            }
            for (const peer of this.network.peers.values()) {
                if (status.guid === peer.guid) {
                    throw new Error(`Already connected to peer`)
                }
            }

            this.listenPort = status.port
            this.guid = status.guid
            if (status.version > this.network.version) {
                logger.warn(`Peer is using a higher version number(${status.version}) than current version(${this.network.version})`)
            }
            return status
        } catch (e) {
            logger.debug(`Disconnecting from ${this.socketBuffer.getIp()}:${this.socketBuffer.getPort()}: ${e}`)
            this.disconnect()
            throw e
        }

    }

    public async getTip(header = false): Promise<{ hash: Hash, height: number, totalwork: number }> {
        // Deprecated in favor of getHeaderTip and getBlockTip
        const { reply, packet } = await this.sendRequest({ getTip: { dummy: 0, header } })
        if (reply.getTipReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getTipReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }

        return { hash: new Hash(reply.getTipReturn.hash), height: Number(reply.getTipReturn.height), totalwork: reply.getTipReturn.totalwork }
    }

    public async putHeaders(headers: AnyBlockHeader[]): Promise<IStatusChange[]> {
        const { reply, packet } = await this.sendRequest({ putHeaders: { headers } })
        if (reply.putHeadersReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'putHeadersReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        return reply.putHeadersReturn.statusChanges
    }

    public async getHash(height: number): Promise<Hash | undefined> {
        try {
            const { reply, packet } = await this.sendRequest({ getHash: { height } })
            if (reply.getHashReturn === undefined) {
                this.protocolError(new Error(`Reply has no 'getHashReturn': ${JSON.stringify(reply)}`))
                throw new Error("Invalid response")
            }

            if (!reply.getHashReturn.success || reply.getHashReturn.hash === undefined || reply.getHashReturn.hash.length !== 32) {
                return
            }

            return new Hash(reply.getHashReturn.hash)
        } catch (e) {
            logger.debug(`Could not getHash() from peer: ${e}`)
            return
        }
    }

    public async putBlockTxs(txBlocks: proto.IBlockTxs[]): Promise<proto.IPutBlockTxsReturn> {
        try {
            const { reply, packet } = await this.sendRequest({ putBlockTxs: { txBlocks } })
            if (reply.putBlockTxsReturn === undefined) {
                this.protocolError(new Error(`Reply has no putBlockTxsReturn: ${JSON.stringify(reply)}`))
                throw new Error("Invalid response")
            }
            return reply.putBlockTxsReturn
        } catch (e) {
            throw new Error(`Could not send block transactions ${e}`)
        }
    }

    public async getBlockTxs(hashes: Hash[]): Promise<IBlockTxs[]> {
        const txBlocks: Array<{ hash: Hash, txs: SignedTx[] }> = []
        try {
            const { reply, packet } = await this.sendRequest({ getBlockTxs: { hashes } })
            if (reply.getBlockTxsReturn === undefined) {
                this.protocolError(new Error(`Reply has no getBlockTxsReturn: ${JSON.stringify(reply)}`))
                throw new Error("Invalid response")
            }
            for (const txBlock of reply.getBlockTxsReturn.txBlocks) {
                const hash = new Hash(txBlock.hash)
                const txs: SignedTx[] = []
                for (const itx of txBlock.txs) {
                    const tx = new SignedTx(itx)
                    txs.push(tx)
                }
                txBlocks.push({ hash, txs })
            }
            return txBlocks
        } catch (e) {
            throw new Error(`Could not getBlockTxs from peer: ${e}`)
        }
    }

    public async status(): Promise<proto.IStatus> {
        const { reply, packet } = await this.sendRequest({
            status: {
                guid: this.network.guid,
                networkid: this.network.networkid,
                port: this.network.port,
                publicPort: this.network.publicPort,
                version: this.network.version,
            },
        })
        if (reply.statusReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'statusReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        return reply.statusReturn.status
    }

    public async ping(): Promise<number> {
        const nonce = Math.round(Math.random() * Math.pow(2, 31))
        const { reply, packet } = await this.sendRequest({ ping: { nonce } })
        if (reply.pingReturn === undefined) {
            throw new Error("Invalid response")
        }
        const src = new Long(nonce)
        if (!src.equals(reply.pingReturn.nonce)) {
            throw new Error("Invalid ping value")
        }
        return reply.pingReturn.nonce as number
    }

    public async getPeers(count?: number): Promise<proto.IPeer[]> {
        const { reply, packet } = await this.sendRequest({ getPeers: { count } })
        if (reply.getPeersReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getPeersReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        return reply.getPeersReturn.peers
    }

    public async putTxs(txs: SignedTx[]): Promise<boolean> {
        const { reply, packet } = await this.sendRequest({ putTx: { txs } })
        if (reply.putTxReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'putTxReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }

        return reply.putTxReturn.success
    }

    public async getTxs(minFee?: number): Promise<SignedTx[]> {
        const { reply, packet } = await this.sendRequest({ getTxs: { minFee } })
        if (reply.getTxsReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getTxsReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        const txs: SignedTx[] = []
        for (const tx of reply.getTxsReturn.txs) {
            txs.push(new SignedTx(tx))
        }
        return txs
    }

    public async putBlocks(blocks: Block[]): Promise<IStatusChange[]> {
        const { reply, packet } = await this.sendRequest({ putBlock: { blocks } })
        if (reply.putBlockReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'putBlockReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }

        return reply.putBlockReturn.statusChanges
    }

    public async getBlocksByHashes(hashes: Hash[]): Promise<Block[]> {
        const { reply, packet } = await this.sendRequest({ getBlocksByHash: { hashes } })
        if (reply.getBlocksByHashReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getBlocksByHashReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        const blocks: Block[] = []
        for (const block of reply.getBlocksByHashReturn.blocks) {
            blocks.push(new Block(block))
        }
        return blocks
    }

    public async getHeadersByHashes(hashes: Hash[]): Promise<AnyBlockHeader[]> {
        const { reply, packet } = await this.sendRequest({ getHeadersByHash: { hashes } })
        if (reply.getHeadersByHashReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getHeadersByHashReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        const headers: AnyBlockHeader[] = []
        for (const header of reply.getHeadersByHashReturn.headers) {
            headers.push(new BlockHeader(header))
        }
        return headers
    }

    public async getBlocksByRange(fromHeight: number, count: number): Promise<Block[]> {
        const { reply, packet } = await this.sendRequest({ getBlocksByRange: { fromHeight, count } })
        if (reply.getBlocksByRangeReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getBlocksByRangeReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }
        const blocks: Block[] = []
        for (const block of reply.getBlocksByRangeReturn.blocks) {
            blocks.push(new Block(block))
        }
        return blocks
    }

    public async getHeadersByRange(fromHeight: number, count: number): Promise<AnyBlockHeader[]> {
        const { reply, packet } = await this.sendRequest({ getHeadersByRange: { fromHeight, count } })
        if (reply.getHeadersByRangeReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getHeadersByRangeReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }

        const headers: AnyBlockHeader[] = []
        for (const header of reply.getHeadersByRangeReturn.headers) {
            headers.push(new BlockHeader(header))
        }
        return headers
    }

    // this is called in BasePeer's onPacket
    protected async respond(id: number, request: proto.Network, packet: Buffer): Promise<void> {
        let response: proto.INetwork
        const reply = id !== 0
        const rebroadcast = () => {
            if (id === 0) {
                setTimeout(() => this.network.broadcast, packet, this)
            }
        }
        switch (request.request) {
            case "status":
                response = await this.respondStatus(reply, request[request.request])
                break
            case "ping":
                response = await this.respondPing(reply, request[request.request])
                break
            case "getPeers":
                response = await this.respondGetPeers(reply, request[request.request])
                break
            case "putTx":
                response = await this.respondPutTx(reply, request[request.request], rebroadcast)
                break
            case "getTxs":
                response = await this.respondGetTxs(reply, request[request.request])
                break
            case "putBlock":
                response = await this.respondPutBlock(reply, request[request.request], rebroadcast)
                break
            case "getBlocksByHash":
                response = await this.respondGetBlocksByHash(reply, request[request.request])
                break
            case "getHeadersByHash":
                response = await this.respondGetHeadersByHash(reply, request[request.request])
                break
            case "getBlockTxs":
                response = await this.respondGetBlockTxs(reply, request[request.request])
                break
            case "putBlockTxs":
                response = await this.respondPutBlockTxs(reply, request[request.request])
                break
            case "getBlocksByRange":
                response = await this.respondGetBlocksByRange(reply, request[request.request])
                break
            case "getHeadersByRange":
                response = await this.respondGetHeadersByRange(reply, request[request.request])
                break
            case "getTip":
                response = await this.respondGetTip(reply, request[request.request])
                break
            case "putHeaders":
                response = await this.respondPutHeaders(reply, request[request.request], rebroadcast)
                break
            case "getHash":
                response = await this.respondGetHash(reply, request[request.request])
                break
            default:
                logger.fatal(`Unknown network message ${request.request}`)
                this.protocolError(new Error(`Unknown network message '${request.request}': ${JSON.stringify(request)}`))
                break
        }
        if (id !== 0 && response !== undefined) {
            try {
                await this.send(id, response)
            } catch (e) {
                logger.debug(`Message response could not be delived: ${e}`)
            }
        }
    }

    private async respondStatus(reply: boolean, request: proto.IStatus): Promise<proto.INetwork> {
        const receviedStatus = new proto.Status(request)
        const message: proto.INetwork = {
            statusReturn: {
                status: {
                    guid: this.network.guid,
                    networkid: this.network.networkid,
                    port: this.network.port,
                    publicPort: this.network.publicPort,
                    version: this.network.version,
                },
                success: true,
            },
        }

        return message
    }

    private async respondPing(reply: boolean, request: proto.IPing): Promise<proto.INetwork> {
        return { pingReturn: { nonce: request.nonce } }
    }

    private async respondGetPeers(reply: boolean, request: proto.IGetPeers): Promise<proto.INetwork> {
        try {
            const num = request.count
            const peers = this.network.getIPeers(this)
            return { getPeersReturn: { success: true, peers } }
        } catch (e) {
            logger.error(`Could not get recent active Peers: ${e}`)
        }
    }

    private async respondPutTx(reply: boolean, request: proto.IPutTx, rebroadcast: () => void): Promise<proto.INetwork> {
        let success = false
        if (request.txs !== undefined) {
            try {
                const txs = request.txs.map((tx) => new SignedTx(tx))
                const newTxs = await this.txPool.putTxs(txs)
                success = (newTxs.length > 0 && newTxs.length === request.txs.length)
                if (newTxs.length > 0 && !success) {
                    this.network.broadcastTxs(newTxs)
                }
            } catch (e) {
                logger.error(`Failed to putTx: ${e}`)
            }
        }
        if (success) {
            rebroadcast()
        }

        return { putTxReturn: { success } }
    }

    private async respondGetTxs(reply: boolean, request: proto.IGetTxs): Promise<proto.INetwork> {
        return { getTxsReturn: { success: false, txs: [] } }
    }

    private async respondPutBlock(reply: boolean, request: proto.IPutBlock, rebroadcast: () => void): Promise<proto.INetwork> {
        const relay = true
        const headerStatusChanges: IStatusChange[] = []
        const blockStatusChanges: IStatusChange[] = []
        try {
            for (const iblock of request.blocks) {
                const block = new Block(iblock)
                const header = block.header
                try {
                    const result = await this.consensus.putHeader(header)
                    headerStatusChanges.push(result)
                } catch (e) {
                    logger.debug(e)
                }
            }
            if (headerStatusChanges.every((x) => ((x.oldStatus === BlockStatus.Nothing) && (x.status >= BlockStatus.Header)) && x.htip)) {
                rebroadcast()
            }
            for (const iblock of request.blocks) {
                const block = new Block(iblock)
                try {
                    const result = await this.consensus.putBlock(block)
                    blockStatusChanges.push(result)
                } catch (e) {
                    blockStatusChanges.push({ oldStatus: BlockStatus.Nothing, status: BlockStatus.Block, htip: false })
                }
            }
            if (!relay && this.sync === undefined) {
                this.forceSync().then(() => { this.sync = undefined }).catch(() => { this.sync = undefined })
            }
        } catch (e) {
            logger.debug(`Failed to put block: ${e}`)
        }
        if (relay && request.blocks && request.blocks.length > 0) {
            logger.debug(`PutBlock Relay=${relay}`)
        }
        return { putBlockReturn: { statusChanges: blockStatusChanges } }
    }

    private async respondGetBlocksByHash(reply: boolean, request: proto.IGetBlocksByHash): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            const blockPromise: Array<Promise<AnyBlock>> = []
            for (const iHash of request.hashes) {
                const hash = new Hash(iHash)
                blockPromise.push(this.consensus.getBlockByHash(hash))
            }
            const blocks = await Promise.all(blockPromise)
            message = { getBlocksByHashReturn: { success: true, blocks } }
        } catch (e) {
            logger.error(`Failed to getBlockByHash: ${e}`)
            message = { getBlocksByHashReturn: { success: false } }
        }
        return message
    }

    private async respondGetHeadersByHash(reply: boolean, request: proto.IGetHeadersByHash): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            const headerPromise: Array<Promise<AnyBlockHeader>> = []
            for (const iHash of request.hashes) {
                const hash = new Hash(iHash)
                headerPromise.push(this.consensus.getHeaderByHash(hash))
            }
            const headers = await Promise.all(headerPromise)
            message = { getHeadersByHashReturn: { success: true, headers } }
        } catch (e) {
            logger.error(`Failed to getHeaderByHash: ${e}`)
            message = { getBlocksByHashReturn: { success: false } }
        }
        return message
    }

    private async respondGetBlocksByRange(reply: boolean, request: proto.IGetBlocksByRange): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            const fromHeight = Number(request.fromHeight)
            const count = Number(request.count)
            const blocks = await this.consensus.getBlocksRange(fromHeight, count)
            message = { getBlocksByRangeReturn: { success: true, blocks } }
        } catch (e) {
            logger.error(`Failed to getBlocksByRange: ${e}`)
            message = { getBlocksByRangeReturn: { success: false } }
        }
        return message
    }

    private async respondGetHeadersByRange(reply: boolean, request: proto.IGetHeadersByRange): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            const fromHeight = Number(request.fromHeight)
            const count = Number(request.count)
            const headers = await this.consensus.getHeadersRange(fromHeight, count)
            message = { getHeadersByRangeReturn: { success: true, headers } }
        } catch (e) {
            logger.error(`Failed to getHeadersByRange: ${e}`)
            message = { getHeadersByRangeReturn: { success: false } }
        }
        return message
    }

    private async respondGetTip(reply: boolean, request: proto.IGetTip, header = false): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            let tip
            if (header) {
                tip = await this.consensus.getHeadersTip()
            } else {
                tip = await this.consensus.getBlocksTip()
            }
            message = { getTipReturn: { success: true, hash: tip.hash, height: tip.height, totalwork: tip.totalwork } }
        } catch (e) {
            logger.error(`Failed to getTip: ${e}`)
            message = { getTipReturn: { success: false } }
        }
        return message
    }

    private async respondPutHeaders(reply: boolean, request: proto.IPutHeaders, rebroadcast: () => void): Promise<proto.INetwork> {
        let relay = false
        const statusChanges: IStatusChange[] = []
        for (const iheader of request.headers) {
            try {
                const header = new BlockHeader(iheader)
                statusChanges.push(await this.consensus.putHeader(header))
            } catch (e) {
                statusChanges.push({ oldStatus: BlockStatus.Nothing, status: BlockStatus.Header })// TODO: Feedback
            }
        }
        relay = statusChanges.every((change) => (change.status !== undefined && change.status !== BlockStatus.Rejected && change.oldStatus !== change.status))
        logger.debug(`PutHeader`)
        if (relay) {
            rebroadcast()
        }
        return { putHeadersReturn: { statusChanges } }
    }

    private async respondGetHash(reply: boolean, request: proto.IGetHash): Promise<proto.INetwork> {
        let message: proto.INetwork
        const height = Number(request.height)
        try {
            const hash = await this.consensus.getHash(height)
            message = { getHashReturn: { success: hash !== undefined, hash } }
        } catch (e) {
            logger.error(`Failed to getHash: ${e}`)
            message = { getHashReturn: { success: false } }
        }
        return message
    }

    private async respondPutBlockTxs(reply: boolean, request: proto.IPutBlockTxs): Promise<proto.INetwork> {
        let message: proto.INetwork
        try {
            const txBlocks: Array<{ hash: Hash, txs: SignedTx[] }> = []
            for (const txBlock of request.txBlocks) {
                const hash = new Hash(txBlock.hash)
                const txs = []
                for (const itx of txBlock.txs) {
                    const tx = new SignedTx(itx)
                    txs.push(tx)
                }
                txBlocks.push({ hash, txs })
            }
            const statusChanges = await this.consensus.putTxBlocks(txBlocks)
            message = { putBlockTxsReturn: { statusChanges } }

        } catch (e) {
            logger.error(`Failed to receive block txs: ${e}`)
        }
        return message
    }

    private async respondGetBlockTxs(reply: boolean, request: proto.IGetBlockTxs): Promise<proto.INetwork> {
        let message: proto.INetwork
        const txBlocks: proto.IBlockTxs[] = []
        let packetSize = 0
        try {
            for (const ihash of request.hashes) {
                const hash = new Hash(ihash)
                const txBlock = await this.consensus.getBlockTxs(hash)
                txBlocks.push(txBlock)
                packetSize += HASH_SIZE + BYTES_OVERHEAD + REPEATED_OVERHEAD + txBlock.txs.length * MAX_TX_SIZE
                if (packetSize > MAX_PACKET_SIZE - MAX_TXS_PER_BLOCK * MAX_TX_SIZE) {
                    break
                }
            }

            message = { getBlockTxsReturn: { txBlocks } }
        } catch (e) {
            logger.error(`Failed to send block txs: ${e}`)
        }
        return message
    }

    private async forceSync() {
        this.sync = new Sync(this, this.consensus, this.network.version)
        return this.sync.sync()
    }
}
