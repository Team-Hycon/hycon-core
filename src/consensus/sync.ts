import { getLogger } from "log4js"
import { AnyBlock, Block } from "../common/block"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { INetwork } from "../network/inetwork"
import { IPeer } from "../network/ipeer"
import { Server } from "../server"
import { Hash } from "../util/hash"
import { IConsensus } from "./iconsensus"
const logger = getLogger("Sync")

export enum BlockStatus {
    Rejected = -1,
    Nothing = 0,
    Header = 1,
    Block = 2,
    MainChain = 3,
}
const blockCount = 1
const headerCount = 100

interface ITip {
    hash: Hash,
    height: number
}

interface ISyncInfo {
    hash: Hash,
    height: number
    status: BlockStatus
}

export class Sync {
    public peer: IPeer
    private consensus: IConsensus
    private differentHeight: number
    private commonMainChain: ISyncInfo
    private commonBlock: ISyncInfo
    private commonHeader: ISyncInfo
    private network: INetwork

    constructor(server: Server) {
        this.network = server.network
        this.consensus = server.consensus
    }

    public async sync() {
        logger.info(`Start Syncing`)
        try {
            const localTip = this.consensus.getBlocksTip()

            this.peer = this.network.getRandomPeer()
            if (!this.peer) {
                logger.info(`No peer to sync with, Local=${localTip.height} `)
                
                return
            }

            logger.debug(`Get remote tip`)
            const remoteTip = await this.peer.getTip()

            logger.info(`Local=${localTip.height}  Remote=${remoteTip.height}`)

            logger.debug(`Finding Commons`)
            await this.findCommons(localTip, remoteTip)

            const startHeaderHeight = await this.findStartHeader()
            logger.info(`Find Start Header=${startHeaderHeight}`)
            if (remoteTip.height > localTip.height) {
                logger.info(`Getting Headers`)
                await this.getHeaders(startHeaderHeight)
            } else {
                logger.info(`Putting Headers`)
                await this.putHeaders(startHeaderHeight)
            }

            const startBlockHeight = await this.findStartBlock(startHeaderHeight)
            logger.info(`Find Start Block=${startBlockHeight}`)
            if (remoteTip.height === localTip.height) {
                logger.debug(`synchronized`)
            } else if (remoteTip.height > localTip.height) {
                logger.info(`Getting Blocks`)
                await this.getBlocks(startBlockHeight)
            } else {
                logger.info(`Putting Blocks`)
                await this.putBlocks(startBlockHeight)
            }
            this.peer = undefined
        } catch (e) {
            logger.error(`Syncing failed: ${e}`)
        }
        return
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
        return height
    }

    private async getHeaders(height: number) {
        let headers: AnyBlockHeader[]
        try {
            do {
                headers = await this.peer.getHeadersByRange(height, headerCount)
                for (const header of headers) {
                    if (header instanceof BlockHeader) {
                        const result = await this.consensus.putHeader(header)
                        if (result.status === undefined || result.status < BlockStatus.Header) {
                            throw new Error(`Header Rejected ${result.status}`)
                        }
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
