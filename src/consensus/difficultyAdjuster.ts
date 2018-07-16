import { getLogger } from "log4js"
import { Hash } from "../util/hash"
import { DBBlock } from "./database/dbblock"

const logger = getLogger("Difficulty")

export class DifficultyAdjuster {
    public static adjustDifficulty(previousDBBlock: DBBlock, timeStamp: number) {
        // Consensus Critical
        const timeDelta = previousDBBlock.height > 0 ? timeStamp - previousDBBlock.header.timeStamp : DifficultyAdjuster.targetTime

        const tEMA = DifficultyAdjuster.calcEMA(timeDelta, previousDBBlock.tEMA)
        const pEMA = DifficultyAdjuster.calcEMA(previousDBBlock.nextDifficulty, previousDBBlock.pEMA)
        const nextDifficulty = (tEMA * pEMA) / DifficultyAdjuster.targetTime

        return { nextDifficulty, tEMA, pEMA }
    }

    public static calcEMA(newValue: number, previousEMA: number, alpha: number = DifficultyAdjuster.alpha) {
        // Consensus Critical
        const newEMA = alpha * newValue + (1 - alpha) * previousEMA
        return newEMA
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

    public static acceptable(hash: Uint8Array | Hash, target: Uint8Array): boolean {
        // Consensus Critical
        if (!(hash instanceof Hash) && hash.length !== 32) {
            throw new Error(`Expected 32 byte hash, got ${hash.length} bytes`)
        }

        for (let i = 31; i >= 0; i--) {
            if (hash[i] < target[i]) {
                return true
            }
            if (hash[i] > target[i]) {
                return false
            }
        }
        return true
    }

    public static getTargetTime(): number {
        // Consensus Critical
        return this.targetTime
    }
    private static alpha: number = 0.003
    private static targetTime: number = 30000 / Math.LN2

}
