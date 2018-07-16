import { getLogger } from "log4js"
import { AnyBlock, Block } from "../common/block"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { BaseBlockHeader } from "../common/genesisHeader"
import { IPeer } from "../network/ipeer"
import { IBlockTxs } from "../network/rabbit/rabbitPeer"
import { MAX_PACKET_SIZE } from "../network/rabbit/socketParser"
import { IPutBlockTxsReturn } from "../serialization/proto"
import { Hash } from "../util/hash"
import { IConsensus } from "./iconsensus"
const logger = getLogger("Sync")

export const REPEATED_OVERHEAD = 6
export const BYTES_OVERHEAD = 6

export const HASH_SIZE = 32

// Header sizes
export const DIFFICULTY_SIZE = 4
export const TIMESTAMP_SIZE = 8
export const NONCE_SIZE = 8
export const MINER_SIZE = 20

// Tx sizes
export const AMOUNT_SIZE = 8
export const FEE_SIZE = 8
export const TX_NONCE_SIZE = 4
export const SIGNATURE_SIZE = 64
export const RECOVERY_SIZE = 4

export const MAX_HEADER_SIZE = 3 * (HASH_SIZE + BYTES_OVERHEAD) + REPEATED_OVERHEAD + DIFFICULTY_SIZE + TIMESTAMP_SIZE + NONCE_SIZE + MINER_SIZE + BYTES_OVERHEAD
export const MAX_TX_SIZE = 2 * (HASH_SIZE + BYTES_OVERHEAD) + AMOUNT_SIZE + FEE_SIZE + TX_NONCE_SIZE + SIGNATURE_SIZE + BYTES_OVERHEAD + RECOVERY_SIZE
export const MAX_TXS_PER_BLOCK = 4096
export const MAX_BLOCK_SIZE = MAX_HEADER_SIZE + MAX_TXS_PER_BLOCK * MAX_TX_SIZE

export enum BlockStatus {
    Rejected = -1,
    Nothing = 0,
    Header = 1,
    Block = 2,
    MainChain = 3,
}

const headerCount = Math.floor(MAX_PACKET_SIZE / MAX_HEADER_SIZE)
const blockCount = Math.floor(MAX_PACKET_SIZE / MAX_BLOCK_SIZE)

interface ITip {
    hash: Hash,
    height: number,
    totalwork: number
}

interface ISyncInfo {
    hash: Hash,
    height: number
    status: BlockStatus
}

export class Sync {
    public peer: IPeer
    private version: number
    private consensus: IConsensus
    private differentHeight: number
    private commonMainChain: ISyncInfo
    private commonBlock: ISyncInfo
    private commonHeader: ISyncInfo

    constructor(peer: IPeer, consensus: IConsensus, version: number) {
        this.peer = peer
        this.consensus = consensus
        this.version = version
    }

    public async sync() {
        logger.debug(`Start Syncing`)
        try {
            const localBlockTip = this.consensus.getBlocksTip()
            const localHeaderTip = this.consensus.getHeadersTip()

            if (!this.peer) {
                logger.info(`No peer to sync with, Local=${localHeaderTip.height} `)
                return
            }

            logger.debug(`Get remote tip`)

            const remoteBlockTip = await this.peer.getTip()
            const remoteHeaderTip = await this.peer.getTip(true)
            const remoteVersion = (await this.peer.status()).version

            if (remoteVersion < 4) {
                logger.debug("Peer is an old version, using fallback sync")
                remoteBlockTip.totalwork = 0
                remoteHeaderTip.totalwork = 0
            }

            if (!localHeaderTip.hash.equals(remoteHeaderTip.hash)) {
                logger.info(`Local=${localHeaderTip.height}:${localHeaderTip.hash}  Remote=${remoteHeaderTip.height}:${remoteHeaderTip.hash}`)
            }

            await this.findCommons(localBlockTip, remoteBlockTip)

            const startHeaderHeight = await this.syncHeaders(remoteHeaderTip, localHeaderTip, remoteVersion)
            if (remoteVersion > 5 && this.version > 5) {
                await this.syncTxs(startHeaderHeight, remoteBlockTip, localBlockTip, localHeaderTip, remoteVersion)
            } else {
                await this.syncBlocks(startHeaderHeight, remoteBlockTip, localBlockTip, remoteVersion)
            }

            this.peer = undefined
        } catch (e) {
            logger.warn(`Syncing ${this.peer.getInfo()} failed: ${e}`)
        }
        return
    }

    private async syncHeaders(remoteHeaderTip: ITip, localHeaderTip: ITip, remoteVersion: number) {
        let remoteHeaderWork: number
        let localHeaderWork: number
        if (remoteVersion > 7) {
            remoteHeaderWork = remoteHeaderTip.totalwork
            localHeaderWork = localHeaderTip.totalwork
        } else {
            remoteHeaderWork = remoteHeaderTip.height - remoteHeaderTip.totalwork
            localHeaderWork = localHeaderTip.height - (1 / localHeaderTip.totalwork)
        }
        const startHeaderHeight = await this.findStartHeader()
        logger.debug(`Find Start Header=${startHeaderHeight}`)
        if (remoteHeaderWork > localHeaderWork) {
            logger.info(`Receiving Headers from ${this.peer.getInfo()}`)
            await this.getHeaders(startHeaderHeight)
        } else if (remoteHeaderWork < localHeaderWork) {
            logger.info(`Sending Headers to ${this.peer.getInfo()}`)
            await this.putHeaders(startHeaderHeight)
        }
        return startHeaderHeight
    }

    private async syncBlocks(startHeaderHeight: number, remoteBlockTip: ITip, localBlockTip: ITip, remoteVersion: number) {
        let remoteBlockWork: number
        let localBlockWork: number
        if (remoteVersion > 7) {
            remoteBlockWork = remoteBlockTip.totalwork
            localBlockWork = localBlockTip.totalwork
        } else {
            remoteBlockWork = remoteBlockTip.height - remoteBlockTip.totalwork
            localBlockWork = localBlockTip.height - (1 / localBlockTip.totalwork)
        }
        const startBlockHeight = await this.findStartBlock(startHeaderHeight)
        logger.debug(`Find Start Block=${startBlockHeight}`)
        if (remoteBlockWork > localBlockWork) {
            logger.info(`Receiving Blocks from ${this.peer.getInfo()}`)
            await this.getBlocks(startBlockHeight)
        } else if (remoteBlockWork < localBlockWork) {
            logger.info(`Sending Blocks to ${this.peer.getInfo()}`)
            await this.putBlocks(startBlockHeight)
        }
        return startBlockHeight
    }

    private async syncTxs(startHeaderHeight: number, remoteBlockTip: ITip, localBlockTip: ITip, localHeaderTip: ITip, remoteVersion: number) {
        let remoteBlockWork: number
        let localBlockWork: number
        if (remoteVersion > 7) {
            remoteBlockWork = remoteBlockTip.totalwork
            localBlockWork = localBlockTip.totalwork
        } else {
            remoteBlockWork = remoteBlockTip.height - remoteBlockTip.totalwork
            localBlockWork = localBlockTip.height - (1 / localBlockTip.totalwork)
        }
        if (remoteBlockWork > localBlockWork) {
            const blockHashes = await this.scanHeaders(localHeaderTip)
            if (blockHashes.length > 0) {
                logger.info(`Receiving transactions from ${this.peer.getInfo()}`)
                return await this.getTxBlocks(blockHashes)
            }
        } else if (remoteBlockWork < localBlockWork) {
            logger.info(`Sending transactions to ${this.peer.getInfo()}`)
            return await this.putTxBlocks(startHeaderHeight)
        }
    }

    private async scanHeaders(headerTip: ITip) {
        const blockHashes: Hash[] = []
        let header = await this.consensus.getHeaderByHash(headerTip.hash)
        let status: BlockStatus
        do {
            status = await this.consensus.getBlockStatus(new Hash(header))
            if (status >= BlockStatus.Block) { break }
            if (!(header instanceof BlockHeader)) { continue }
            if (!header.merkleRoot.equals(Hash.emptyHash)) {
                blockHashes.push(new Hash(header))
            }
            if (blockHashes.length > headerCount) {
                blockHashes.shift()
            }
            header = await this.consensus.getHeaderByHash(header.previousHash[0])
        } while (status < BlockStatus.Block)
        blockHashes.reverse()
        return blockHashes
    }

    private async findCommons(localTip: ITip, remoteTip: ITip) {
        let startHeight: number
        if (remoteTip.height <= localTip.height) {
            this.differentHeight = remoteTip.height
            if (await this.updateCommons(remoteTip.height, remoteTip.hash)) {
                return
            }
            startHeight = remoteTip.height - 1
        } else if (remoteTip.height > localTip.height) {
            this.differentHeight = remoteTip.height
            startHeight = localTip.height
        }

        let i = 1
        let height = startHeight
        while (height > 0) {
            if (await this.updateCommons(height)) {
                return
            }
            height = startHeight - i
            i *= 2
        }

        if (!(await this.updateCommons(0))) {
            logger.fatal("Peer is different genesis block")
            throw new Error("Peer using different genesis block tried to sync")
        }
    }

    // hash: peer hash of this height
    private async updateCommons(height: number, hash?: Hash) {
        if (hash === undefined) {
            hash = await this.peer.getHash(height)
        }
        const status = await this.consensus.getBlockStatus(hash)
        const syncInfo = { status, height, hash }
        switch (status) {
            case BlockStatus.MainChain:
                if (this.commonMainChain === undefined) {
                    this.commonMainChain = syncInfo
                }
            // MainChain implies Block
            case BlockStatus.Block:
                if (this.commonBlock === undefined) {
                    this.commonBlock = syncInfo
                }
            // Block implies Header
            case BlockStatus.Header:
                if (this.commonHeader === undefined) {
                    this.commonHeader = syncInfo
                }
                return (this.commonMainChain !== undefined) && (this.commonBlock !== undefined)
            case BlockStatus.Nothing:
                this.differentHeight = syncInfo.height
                return (this.commonMainChain !== undefined) && (this.commonBlock !== undefined) && (this.commonHeader !== undefined)
            case BlockStatus.Rejected:
                logger.fatal("Peer is using rejected block")
                throw new Error("Rejected block found during sync")
        }
    }

    private async findStartHeader(): Promise<number> {
        let height = this.differentHeight
        let min = this.commonHeader.height
        while (min + 1 < height) {
            // tslint:disable-next-line:no-bitwise
            const mid = (min + height) >> 1
            const hash = await this.peer.getHash(mid)
            switch (await this.consensus.getBlockStatus(hash)) {
                case BlockStatus.MainChain:
                case BlockStatus.Block:
                case BlockStatus.Header:
                    min = mid
                    break
                case BlockStatus.Nothing:
                    height = mid
                    break
                case BlockStatus.Rejected:
                    logger.fatal("Peer is using rejected block")
                    throw new Error("Rejected block found during sync")
            }
        }
        if (height < 1) {
            height = 1
        }
        return height
    }

    private async getHeaders(height: number) {
        let headers: BaseBlockHeader[]
        try {
            do {
                headers = await this.peer.getHeadersByRange(height, headerCount)
                for (const header of headers) {
                    if (!(header instanceof BlockHeader)) {
                        continue
                    }
                    const result = await this.consensus.putHeader(header)

                    if (result.status === undefined || result.status < BlockStatus.Header) {
                        throw new Error(`Header Rejected ${result.status}`)
                    }
                }
                height += headers.length
            } while (headers.length > 0)
        } catch (e) {
            throw new Error(`Could not completely sync headers: ${e}`)
        }
    }

    private async putHeaders(height: number) {
        let headers: AnyBlockHeader[]
        if (height < 1) {
            height = 1
        }
        try {
            do {
                headers = await this.consensus.getHeadersRange(height, headerCount)
                const results = await this.peer.putHeaders(headers)
                if (results.some((result) => result.status === undefined || result.status < BlockStatus.Header)) {
                    throw new Error("Header Rejected")
                }
                height += headers.length
            } while (headers.length > 0)
        } catch (e) {
            throw new Error(`Could not completely sync headers: ${e}`)
        }
    }

    private async getTxBlocks(blockHashes: Hash[]) {
        const requestSize = blockHashes.length * (HASH_SIZE + BYTES_OVERHEAD) + REPEATED_OVERHEAD
        const numRequests = Math.ceil(requestSize / MAX_PACKET_SIZE)
        let txBlocks: IBlockTxs[] = []
        try {
            const txBlocksPerRequest = Math.floor(blockHashes.length / numRequests)
            for (let i = 0; i < numRequests; i++) {
                const requestHashes = blockHashes.slice(i * txBlocksPerRequest, (i + 1) * txBlocksPerRequest)
                while (requestHashes.length > 0) {
                    const receivedTxBlocks = await this.peer.getBlockTxs(requestHashes)
                    txBlocks = txBlocks.concat(receivedTxBlocks)
                    requestHashes.splice(0, receivedTxBlocks.length)
                }
            }
            return await this.consensus.putTxBlocks(txBlocks)
        } catch (e) {
            throw new Error(`Could not completely sync txs: ${e}`)
        }
    }

    private async putTxBlocks(height: number) {
        let packetSize = 0
        let fullPacket = false
        const txBlocks: IBlockTxs[] = []
        const results: IPutBlockTxsReturn = { statusChanges: [] }
        try {

            let block = await this.consensus.getBlockAtHeight(height)
            while (block) {
                try {
                    block = await this.consensus.getBlockAtHeight(height)
                } catch (e) {
                    break
                }
                height++
                if (block.txs.length === 0) {
                    continue
                } else if (!(block instanceof Block)) {
                    break
                }
                txBlocks.push({ hash: new Hash(block.header), txs: block.txs })
                // Estimate of the size of the hash and accompanying transactions
                packetSize += HASH_SIZE + BYTES_OVERHEAD + block.txs.length * MAX_TX_SIZE + REPEATED_OVERHEAD
                if (packetSize > MAX_PACKET_SIZE - MAX_BLOCK_SIZE) {
                    fullPacket = true
                    results.statusChanges = results.statusChanges.concat((await this.peer.putBlockTxs(txBlocks)).statusChanges)
                    break
                }
            }
            if (!fullPacket && txBlocks.length > 0) {
                results.statusChanges = results.statusChanges.concat((await this.peer.putBlockTxs(txBlocks)).statusChanges)
            }
            return results
        } catch (e) {
            throw new Error(`Could not send block txs: ${e}`)
        }
    }

    private async findStartBlock(height: number): Promise<number> {
        let min = this.commonBlock.height
        while (min + 1 < height) {
            // tslint:disable-next-line:no-bitwise
            const mid = (min + height) >> 1
            const hash = await this.peer.getHash(mid)
            switch (await this.consensus.getBlockStatus(hash)) {
                case BlockStatus.MainChain:
                case BlockStatus.Block:
                    min = mid
                    break
                case BlockStatus.Header:
                case BlockStatus.Nothing:
                    height = mid
                    break
                case BlockStatus.Rejected:
                    logger.fatal("Peer is using rejected block")
                    throw new Error("Rejected block found during sync")
            }
        }
        if (height < 1) {
            height = 1
        }
        return height
    }

    private async getBlocks(height: number) {
        let blocks: AnyBlock[]

        try {
            do {
                blocks = await this.peer.getBlocksByRange(height, blockCount)
                for (const block of blocks) {
                    if (block instanceof Block) {
                        const { status } = await this.consensus.putBlock(block)
                        if (status < BlockStatus.Block) {
                            throw new Error(`Block rejected ${status}`)
                        }
                    }
                }
                height += blocks.length
            } while (blocks.length > 0)
        } catch (e) {
            throw new Error(`Could not completely sync blocks: ${e}`)
        }
    }

    private async putBlocks(height: number) {
        let blocks: AnyBlock[]
        try {
            do {
                blocks = await this.consensus.getBlocksRange(height, blockCount)
                const results = await this.peer.putBlocks(blocks)
                if (results.some((result) => result.status === undefined || result.status < BlockStatus.Block)) {
                    throw new Error(`Block rejected`)
                }
                height += blocks.length
            } while (blocks.length > 0)
        } catch (e) {
            throw new Error(`Could not completely sync blocks: ${e} -- ${this.peer.getInfo()}`)
        }
    }
}
