import { getLogger } from "log4js"
import { Block } from "../common/block"
import { BlockHeader } from "../common/blockHeader"
import { Hash } from "../util/hash"
import { Consensus, IPutResult } from "./consensus"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"

const logger = getLogger("Nakamoto Consensus")

const emaAlpha = 0.003
function EMA(x: number, previousEMA: number) {
    return emaAlpha * x + (1 - emaAlpha) * previousEMA
}

export class NakamotoConsensus {
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
        const target = Buffer.alloc(length)
        let carry = 0
        for (let i = length - 1; i >= 0; i--) {
            carry = (0x100 * carry) + (p * 0xFF)
            target[i] = Math.floor(carry)
            carry -= target[i]
        }
        return target
    }

    private consensus: Consensus
    private db: Database
    private readonly targetTime = 30000 / Math.LN2

    constructor(consensus: Consensus, db: Database) {
        this.consensus = consensus
        this.db = db
    }

    public getTargetTime(): number {
        return this.targetTime
    }

    public async process(result: IPutResult, previousDBBlock: DBBlock, previousBlockStatus: BlockStatus, hash: Hash, header: BlockHeader, block?: Block): Promise<IPutResult> {
        // Consensus Critical
        if (result.oldStatus === BlockStatus.Nothing) {
            await this.processHeader(previousDBBlock, header, hash, result)
            if (result.status === BlockStatus.Rejected) {
                return result
            }
        }

        if (block === undefined || previousBlockStatus < BlockStatus.Block) {
            return result
        }

        if (result.oldStatus >= BlockStatus.Nothing && result.oldStatus <= BlockStatus.Header) {
            if (result.dbBlock === undefined) { result.dbBlock = await this.db.getDBBlock(hash) }
            await this.consensus.processBlock(block, hash, header, previousDBBlock, result, 240e9)
            if (result.status === BlockStatus.Rejected) {
                return result
            }
        }
        return result
    }

    private async processHeader(previousDBBlock: DBBlock, header: BlockHeader, hash: Hash, result: IPutResult): Promise<void> {
        // Consensus Critical
        if (header.timeStamp < previousDBBlock.header.timeStamp + 50) {
            result.status = BlockStatus.Rejected
            return
        }

        const timeDelta = previousDBBlock.height > 0 ? header.timeStamp - previousDBBlock.header.timeStamp : this.targetTime
        const tEMA = EMA(timeDelta, previousDBBlock.tEMA)
        const pEMA = EMA(previousDBBlock.nextDifficulty, previousDBBlock.pEMA)
        const nextDifficulty = (tEMA * pEMA) / this.targetTime

        if (previousDBBlock.nextDifficulty !== header.difficulty) {
            logger.warn(`Rejecting block(${hash.toString()}): Difficulty(${header.difficulty}) does not match calculated value(${previousDBBlock.nextDifficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const preHash = header.preHash()
        const nonceCheck = await NakamotoConsensus.checkNonce(preHash, header.nonce, previousDBBlock.nextDifficulty)
        if (!nonceCheck) {
            logger.warn(`Rejecting block(${hash.toString()}): Hash does not meet difficulty(${header.difficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const height = previousDBBlock.height + 1
        const totalWork = previousDBBlock.totalWork + (1 / previousDBBlock.nextDifficulty)
        result.dbBlock = new DBBlock({ header, height, tEMA, pEMA, nextDifficulty, totalWork })
        result.status = BlockStatus.Header
        return
    }
}
