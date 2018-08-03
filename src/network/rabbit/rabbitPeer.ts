import { getLogger } from "log4js"
import * as Long from "long"
import { Socket } from "net"
import { AnyBlock, Block } from "../../common/block"
import { AnyBlockHeader, BlockHeader } from "../../common/blockHeader"
import { BaseBlockHeader } from "../../common/genesisHeader"
import { ITxPool } from "../../common/itxPool"
import { SignedTx } from "../../common/txSigned"
import { TIMESTAMP_TOLERANCE } from "../../consensus/consensus"
import { IConsensus, IStatusChange } from "../../consensus/iconsensus"
import { BlockStatus, ITip } from "../../consensus/sync"
import { globalOptions } from "../../main"
import { MinerServer } from "../../miner/minerServer"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { IPeer } from "../ipeer"
import { IPeerDatabase } from "../ipeerDatabase"
import { BasePeer } from "./basePeer"
import { BYTES_OVERHEAD, HASH_SIZE, MAX_BLOCKS_PER_PACKET, MAX_HEADERS_PER_PACKET, MAX_PACKET_SIZE, MAX_TX_SIZE, MAX_TXS_PER_BLOCK, REPEATED_OVERHEAD } from "./networkConstants"
import { RabbitNetwork } from "./rabbitNetwork"
const logger = getLogger("NetPeer")

const DIFFICULTY_TOLERANCE = 0.05
const BROADCAST_LIMIT = 10

export interface IBlockTxs { hash: Hash, txs: SignedTx[] }
export class RabbitPeer extends BasePeer implements IPeer {
    public static seenBlocksSet: Set<Hash> = new Set<Hash>()
    public static seenBlocks: Hash[] = []
    public listenPort: number
    public guid: string
    private consensus: IConsensus
    private txPool: ITxPool
    private network: RabbitNetwork
    private receivedBroadcasts: number
    private lastReceivedTime: number
    private version: number

    constructor(socket: Socket, network: RabbitNetwork, consensus: IConsensus, txPool: ITxPool, peerDB: IPeerDatabase) {
        super(socket)
        // tslint:disable-next-line:max-line-length
        logger.debug(`New Netpeer Local=${RabbitNetwork.ipNormalise(socket.localAddress)}:${socket.localPort} --> Remote=${RabbitNetwork.ipNormalise(socket.remoteAddress)}:${socket.remotePort}`)
        this.network = network
        this.consensus = consensus
        this.txPool = txPool
        this.receivedBroadcasts = 0
        this.lastReceivedTime = 0
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
            this.version = status.version
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

    public async getHTip() {
        return this.getTip(true)
    }

    public async getBTip() {
        return this.getTip(false)
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

    public getVersion(): number {
        return this.version
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

    public async headerSync(remoteTip: ITip) {
        const startHeight = Math.min(this.consensus.getHtip().height, remoteTip.height)
        const { height: commonHeight, hash: commonHash } = await this.commonSearch(startHeight, remoteTip.height - 1, BlockStatus.Header)
        logger.debug(`Found Start Header=${commonHeight}`)
        return this.getHeaders(commonHeight, commonHash, remoteTip.height)
    }
    public async blockSync(remoteBlockTip: ITip) {
        const startHeight = Math.min(this.consensus.getBtip().height, remoteBlockTip.height)
        const { height: commonHeight, hash: commonHash } = await this.commonSearch(startHeight, remoteBlockTip.height - 1, BlockStatus.Block)
        logger.debug(`Found Start Block=${commonHeight}`)
        return this.getBlocks(commonHeight, commonHash, remoteBlockTip.height)
    }

    public async txSync(remoteTip: ITip) {
        const blockHashes: Hash[] = []
        let header = this.consensus.getHtip().header
        let status: BlockStatus
        do {
            status = await this.consensus.getBlockStatus(new Hash(header))
            if (status >= BlockStatus.Block) { break }
            if (!(header instanceof BlockHeader)) { continue }
            if (!header.merkleRoot.equals(Hash.emptyHash)) {
                blockHashes.unshift(new Hash(header))
            }
            if (blockHashes.length > MAX_HEADERS_PER_PACKET) {
                blockHashes.pop()
            }
            header = await this.consensus.getHeaderByHash(header.previousHash[0])
        } while (status < BlockStatus.Block)

        if (blockHashes.length > 0) {
            logger.debug(`Receiving transactions from ${this.socketBuffer.getIp()}:${this.socketBuffer.getPort()}`)
            return this.getTxBlocks(blockHashes)
        }
    }

    // this is called in BasePeer's onPacket
    protected async respond(id: number, request: proto.Network, packet: Buffer): Promise<void> {
        let response: proto.INetwork
        const reply = id !== 0
        const rebroadcast = () => {
            if (id === 0) {
                setImmediate(() => this.network.broadcast(packet))
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
                response = await this.respondPutHeaders(reply, request[request.request])
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

    private async getTip(header = false): Promise<{ hash: Hash, height: number, totalwork: number }> {
        const { reply } = await this.sendRequest({ getTip: { header } })
        if (reply.getTipReturn === undefined) {
            this.protocolError(new Error(`Reply has no 'getTipReturn': ${JSON.stringify(reply)}`))
            throw new Error("Invalid response")
        }

        return { hash: new Hash(reply.getTipReturn.hash), height: Number(reply.getTipReturn.height), totalwork: reply.getTipReturn.totalwork }
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

    private async blockBroadcastCondition(block: Block) {
        const timeDelta = Math.abs(block.header.timeStamp - Date.now())
        if (timeDelta > TIMESTAMP_TOLERANCE) {
            return false
        }
        const merkleRoot = Block.calculateMerkleRoot(block.txs)
        if (!block.header.merkleRoot.equals(merkleRoot)) {
            return false
        }

        const blockHash = new Hash(block.header)
        const status = await this.consensus.getBlockStatus(blockHash)
        if (status < BlockStatus.Nothing || status >= BlockStatus.Block) {
            return false
        }

        if (RabbitPeer.seenBlocksSet.has(blockHash)) {
            return false
        }

        const proximalDifficulty = this.consensus.getHtip().header.difficulty * (1 + DIFFICULTY_TOLERANCE)
        const prehash = block.header.preHash()
        if (!MinerServer.checkNonce(prehash, block.header.nonce, proximalDifficulty)) {
            return false
        }

        RabbitPeer.seenBlocksSet.add(blockHash)
        if (RabbitPeer.seenBlocks.length > 1000) {
            const [old] = RabbitPeer.seenBlocks.splice(0, 1)
            RabbitPeer.seenBlocksSet.delete(old)
        }
        RabbitPeer.seenBlocks.push(blockHash)

        return true
    }

    private async respondPutBlock(reply: boolean, request: proto.IPutBlock, rebroadcast: () => void): Promise<proto.INetwork> {
        setImmediate(async () => {
            this.receivedBroadcasts += 1
            const decay = (Date.now() - this.lastReceivedTime) / 1000
            this.lastReceivedTime = Date.now()
            this.receivedBroadcasts = Math.max(0, this.receivedBroadcasts - decay)

            if (this.receivedBroadcasts > BROADCAST_LIMIT) {
                return
            }

            request.blocks = request.blocks.slice(0, 1)
            let block: Block
            try {
                block = new Block(request.blocks[0])

                if (this.blockBroadcastCondition(block)) {
                    rebroadcast()
                }
                await this.consensus.putBlock(block)
            } catch (e) {
                logger.debug(e)
            }
        })

        return { putBlockReturn: { statusChanges: [] } }
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

    private async respondPutHeaders(reply: boolean, request: proto.IPutHeaders): Promise<proto.INetwork> {
        return { putHeadersReturn: { statusChanges: [] } }
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
            logger.debug(`Failed to send block txs: ${e}`)
        }
        return message
    }

    private async commonSearch(startHeight: number, max: number, searchStatus: BlockStatus) {
        let min: number
        let i = 0
        await this.search(startHeight, (height, status) => {
            if (status === undefined || status === BlockStatus.Rejected) {
                this.disconnect()
                return undefined
            }

            if (height <= 0 || status >= searchStatus) {
                min = height
                return undefined
            } else {
                max = height
            }
            i++
            return Math.max(startHeight - Math.pow(2, i), 0)
        })
        logger.debug(`Found minimum height(${min})`)

        return this.search(Math.floor((min + max) / 2), (height, status) => {
            if (height === min) {
                return undefined
            }

            if (status === undefined || status === BlockStatus.Rejected) {
                logger.debug(`Peer supplied rejected information`)
                this.disconnect()
                return undefined
            }

            if (status >= searchStatus) {
                min = height
            } else {
                max = height
            }
            return Math.floor((min + max) / 2)
        })
    }

    private async search(height: number, update: (height: number, status?: BlockStatus) => number) {
        while (height !== undefined) {
            const hash = await this.getHash(height)
            const status = hash === undefined ? undefined : await this.consensus.getBlockStatus(hash)
            logger.debug(`Peer's block at height ${height} has status ${status}`)
            const newHeight = update(height, status)
            if (newHeight === undefined) {
                return { height, hash }
            }
            height = newHeight
        }
    }

    private async getHeaders(commonHeight: number, commonHash: Hash, maxHeight: number) {
        let headers: BaseBlockHeader[]
        let previousHash = commonHash
        logger.debug(`commonHeight: ${commonHeight}, previousHash: ${previousHash}`)
        let height = commonHeight + 1
        do {
            headers = await this.getHeadersByRange(height, MAX_HEADERS_PER_PACKET)
            for (const header of headers) {
                if (!(header instanceof BlockHeader)) {
                    throw new Error(`Received Genesis Block Header during sync`)
                }
                const result = await this.consensus.putHeader(header)
                this.validatePut(height, previousHash, result, header, BlockStatus.Header)
                height++
                previousHash = new Hash(header)
            }
        } while (height < maxHeight && headers.length > 0)
    }

    private async getBlocks(commonHeight: number, commonHash: Hash, maxHeight: number) {
        let blocks: AnyBlock[]
        let previousHash = commonHash
        let height = commonHeight + 1
        do {
            blocks = await this.getBlocksByRange(height, MAX_BLOCKS_PER_PACKET)
            for (const block of blocks) {
                if (!(block instanceof Block)) {
                    throw new Error(`Received Genesis Block during sync`)
                }
                const result = await this.consensus.putBlock(block)
                this.validatePut(height, previousHash, result, block.header, BlockStatus.Block)
                height++
                previousHash = new Hash(block.header)
            }

        } while (height < maxHeight && blocks.length > 0)
    }

    private validatePut(height: number, previousHash: Hash, result: IStatusChange, header: BlockHeader, expectedStatus: BlockStatus) {
        if (result.status === undefined || result.status < expectedStatus) {
            throw new Error(`Block rejected: ${JSON.stringify(result)}`)
        }
        if (result.height !== undefined && result.height !== height) {
            throw new Error(`Expected header at height(${height}) but got header at height(${result.height})`)
        }
        if (!previousHash.equals(header.previousHash[0])) {
            throw new Error(`Expected header's previousHash(${header.previousHash[0]}) to be ${previousHash}`)
        }
        if (result.oldStatus >= result.status) {
            logger.debug(`Received block has already been received`)
        }
    }

    private async getTxBlocks(blockHashes: Hash[]) {
        const requestSize = blockHashes.length * (HASH_SIZE + BYTES_OVERHEAD) + REPEATED_OVERHEAD
        const numRequests = Math.ceil(requestSize / MAX_PACKET_SIZE)
        const txBlocksPerRequest = Math.floor(blockHashes.length / numRequests)

        for (let i = 0; i < numRequests; i++) {
            const requestHashes = blockHashes.splice(0, txBlocksPerRequest)
            while (requestHashes.length > 0) {
                const receivedTxBlock = await this.getBlockTxs(requestHashes)
                requestHashes.splice(0, receivedTxBlock.length)
                const changes = await this.consensus.putTxBlocks(receivedTxBlock)
                if (!changes.every((change) => change.oldStatus < change.status)) {
                    logger.debug(`Received txBlock has already been received`)
                    return
                }
            }
        }
    }
}
