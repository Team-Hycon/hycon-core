import { getLogger } from "log4js"
import { Hash } from "../util/hash"
import { DBBlock } from "./database/dbblock"

const logger = getLogger("Difficulty")

export class DifficultyAdjuster {
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

}
