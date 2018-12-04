
import { getLogger } from "log4js"
import Long = require("long")
import { Block } from "../common/block"
import { BlockHeader } from "../common/blockHeader"
import { Hash } from "../util/hash"
import { Consensus, IPutResult } from "./consensus"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"
import { EMA, EMA_Adjust, IUncleCandidate, maxNumberOfUncles, maxUncleHeightDelta, recentHeaderTrackingRange, UncleManager } from "./uncleManager"

const logger = getLogger("Jabiru Consensus")

export class JabiruConsensus {
    public static readonly BLOCK_REWARD = 12e9
    public static readonly TARGET_MEDIAN_TIME = 15000
    public static readonly TARGET_MEAN_TIME = JabiruConsensus.TARGET_MEDIAN_TIME / Math.LN2

    public static async checkNonce(preHash: Uint8Array, nonce: Long, difficulty: number): Promise<boolean> {
        // Consensus Critical
        const hash = await Consensus.cryptonightHashNonce(preHash, nonce)
        const target = this.getTarget(difficulty)
        return DifficultyAdjuster.acceptable(hash, target)
    }

    public static getTarget(p: number, length: number = 32) {
        // Consensus Critical
        if (p > 1) {
            logger.warn(`Difficulty(${p.toExponential()}) is too low, anything is possible. (　＾∇＾)`)
            p = 1
        }
        if (p < Math.pow(0x100, -length)) {
            logger.warn(`Difficulty(${p.toExponential()}) is too high, give up now. (╯°□°）╯︵ ┻━┻`)
            p = Math.pow(0x100, -length)
        }
        const target = Buffer.allocUnsafe(length)
        let carry = p
        for (let i = target.length - 1; i >= 0; i--) {
            carry *= 0x100
            target[i] = Math.floor(carry)
            carry -= target[i]
        }
        for (let i = 0; i < target.length; i++) {
            target[i]--
            if (target[i] !== 0xFF) {
                break
            }
        }
        return target
    }
    private consensus: Consensus
    private db: Database
    private uncleManager: UncleManager

    constructor(consensus: Consensus, db: Database, uncleManager: UncleManager) {
        this.consensus = consensus
        this.db = db
        this.uncleManager = uncleManager
    }

    public async process(result: IPutResult, previousDBBlock: DBBlock, previousBlockStatus: BlockStatus, hash: Hash, header: BlockHeader, block?: Block): Promise<IPutResult> {
        // Consensus Critical
        if (result.oldStatus === BlockStatus.Nothing) {
            await this.processHeader(previousDBBlock, previousBlockStatus, header, hash, result)
            if (result.status === BlockStatus.Rejected) {
                return result
            }
        }

        if (block === undefined || previousBlockStatus < BlockStatus.Block) {
            return result
        }

        if (result.oldStatus >= BlockStatus.Nothing && result.oldStatus <= BlockStatus.Header) {
            if (result.dbBlock === undefined) { result.dbBlock = await this.db.getDBBlock(hash) }
            await this.processBlock(block, hash, header, previousDBBlock, result)
            if (result.status !== BlockStatus.Block) {
                return result
            }
        }
        return result
    }

    private async processHeader(previousDBBlock: DBBlock, previousBlockStatus: BlockStatus, header: BlockHeader, hash: Hash, result: IPutResult): Promise<void> {
        // Consensus Critical
        if (header.timeStamp < previousDBBlock.header.timeStamp + 50) {
            result.status = BlockStatus.Rejected
            return
        }

        if (header.previousHash.length > maxNumberOfUncles + 1) {
            logger.warn(`Rejecting header(${hash.toString()}): Header has too many uncles(${header.previousHash.length - 1}) the maximum is ${maxNumberOfUncles}`)
            result.status = BlockStatus.Rejected
            return
        }

        if (header.difficulty > previousDBBlock.nextDifficulty) {
            logger.warn(`Rejecting header(${hash.toString()}): Difficulty(${header.difficulty}) is too low compared to calculated value(${previousDBBlock.nextDifficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const preHash = header.preHash()
        const nonceCheck = await JabiruConsensus.checkNonce(preHash, header.nonce, header.difficulty)
        if (!nonceCheck) {
            logger.warn(`Rejecting header(${hash.toString()}): Hash does not meet difficulty(${header.difficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const height = previousDBBlock.height + 1

        await this.uncleManager.setUncleHeader(height, hash, header.miner)

        const work = 1 / previousDBBlock.nextDifficulty
        const headerWorkEMA = EMA(work, previousDBBlock.pEMA)
        const totalWork = previousDBBlock.totalWork + work

        const timeDelta = previousDBBlock.height > 0 ? header.timeStamp - previousDBBlock.header.timeStamp : JabiruConsensus.TARGET_MEDIAN_TIME
        const tEMA = EMA(timeDelta, previousDBBlock.tEMA)

        const headerHashesPerSecond = headerWorkEMA / tEMA

        const nextHeaderDifficulty = 1 - Math.pow(0.5, 1 / (JabiruConsensus.TARGET_MEDIAN_TIME * headerHashesPerSecond))

        result.dbBlock = new DBBlock({ header, height, tEMA, pEMA: headerWorkEMA, nextDifficulty: nextHeaderDifficulty, totalWork })
        result.status = BlockStatus.Header
        return
    }

    private async processUncles(header: BlockHeader, previousDBBlock: DBBlock, result: IPutResult) {
        const blockHash = new Hash(header)
        const uncleHashes = header.previousHash.slice(1)
        const uncleHashStrings = new Set<string>()
        const uncleStatusPromises = [] as Array<Promise<{ status: BlockStatus, hash: Hash }>>
        for (const uncleHash of uncleHashes) {
            const uncleHashString = uncleHash.toString()
            if (uncleHashStrings.has(uncleHashString)) {
                continue
            }
            uncleHashStrings.add(uncleHashString)
            const unclePromise = this.db.getBlockStatus(uncleHash).then((status) => ({ status, hash: uncleHash }))
            uncleStatusPromises.push(unclePromise)
        }
        const uncleStatuses = await Promise.all(uncleStatusPromises)
        const missingHashes = [] as Hash[]
        let invalidUncle = false
        for (const uncle of uncleStatuses) {
            switch (uncle.status) {
                case BlockStatus.InvalidBlock: // Header Ok, only block/uncles failed validation
                case BlockStatus.Header: // Ok
                case BlockStatus.Block: // Ok
                case BlockStatus.MainChain: // Not Ok, but may change during reorganization
                    continue
                case BlockStatus.Nothing: // Not Ok, Can not calculate the totalWork
                    missingHashes.push(uncle.hash)
                    invalidUncle = true
                    logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) status is missing`)
                    break
                case BlockStatus.Rejected: // Not Ok
                    logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) status is rejected`)
                    invalidUncle = true
                    result.status = BlockStatus.InvalidBlock
                    break
            }
        }

        if (missingHashes.length > 0) {
            this.consensus.emit("missingUncles", previousDBBlock.height + 1, missingHashes)
            return
        }
        if (invalidUncle) {
            return
        }
        const unclePromises = uncleStatuses.map((uncle) =>
            this.db.getDBBlock(uncle.hash).then((uncleDBBlock) => ({
                dbblock: uncleDBBlock,
                hash: uncle.hash,
                status: uncle.status,
            })),
        )
        const uncles = await Promise.all(unclePromises)

        let totalWorkAdjustment = 0

        const blockWork = 1 / previousDBBlock.nextBlockDifficulty
        let blockWorkEMA = EMA(blockWork, previousDBBlock.blockWorkEMA)
        const candidates = [] as IUncleCandidate[]
        for (const uncle of uncles) {
            const heightDelta = result.dbBlock.height - uncle.dbblock.height
            if (heightDelta > maxUncleHeightDelta || !(uncle.dbblock.header instanceof BlockHeader)) {
                logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) heightDelta is too large ${heightDelta}`)
                result.status = BlockStatus.InvalidBlock
                return
            }
            const uncleWork = 1 / uncle.dbblock.header.difficulty
            totalWorkAdjustment += uncleWork
            blockWorkEMA = EMA_Adjust(uncleWork, heightDelta, blockWorkEMA)
            candidates.push({ hash: uncle.hash, height: uncle.dbblock.height, miner: uncle.dbblock.header.miner })
        }
        return { totalWorkAdjustment, blockWorkEMA, candidates }
    }

    private async processBlock(block: Block, hash: Hash, header: BlockHeader, previousDBBlock: DBBlock, result: IPutResult): Promise<void> {
        // Consensus Critical
        const height = previousDBBlock.height + 1
        const uncles = await this.processUncles(header, previousDBBlock, result)
        if (!uncles) {
            return
        }

        result.dbBlock.blockWorkEMA = uncles.blockWorkEMA
        const hashesPerSecond = uncles.blockWorkEMA / result.dbBlock.tEMA
        result.dbBlock.nextBlockDifficulty = 1 - Math.pow(0.5, 1 / (JabiruConsensus.TARGET_MEDIAN_TIME * hashesPerSecond))
        logger.debug(`Block ${result.dbBlock.height}: ${result.dbBlock.blockWorkEMA.toFixed(1)} H / ${(result.dbBlock.tEMA / 1000).toFixed(1)}s = ${(result.dbBlock.blockWorkEMA * 1000 / result.dbBlock.tEMA).toFixed(1)}H/s`)

        if (header.difficulty !== previousDBBlock.nextBlockDifficulty) {
            logger.warn(`Rejecting block(${hash.toString()}): Block Difficulty(${header.difficulty}) did not meet the uncle adjusted difficulty(${previousDBBlock.nextBlockDifficulty})`)
            result.status = BlockStatus.InvalidBlock
            return
        }

        await this.consensus.processBlock(block, hash, header, previousDBBlock, result, JabiruConsensus.BLOCK_REWARD, false, uncles.candidates)
        if (result.status !== BlockStatus.Block) {
            return
        }
        result.dbBlock.totalWork += uncles.totalWorkAdjustment
        return
    }
}
