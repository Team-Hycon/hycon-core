import { getLogger } from "log4js"
import { Block } from "../common/block"
import { BlockHeader } from "../common/blockHeader"
import { MinerServer } from "../miner/minerServer"
import { Hash } from "../util/hash"
import { IPutResult } from "./consensus"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { WorldState } from "./database/worldState"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"

const logger = getLogger("Verify")
export class Verify {
    public static async processHeader(previousDBBlock: DBBlock, header: BlockHeader, hash: Hash, result: IPutResult)
        : Promise<void> {
        // Consensus Critical

        if (header.timeStamp < previousDBBlock.header.timeStamp + 50) {
            result.status = BlockStatus.Rejected
            return
        }
        const { nextDifficulty, tEMA, pEMA } = DifficultyAdjuster.adjustDifficulty(previousDBBlock, header.timeStamp)

        if (previousDBBlock.nextDifficulty !== header.difficulty) {
            logger.warn(`Rejecting block(${hash.toString()}): Difficulty(${header.difficulty}) does not match calculated value(${previousDBBlock.nextDifficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const preHash = header.preHash()
        const nonceCheck = await MinerServer.checkNonce(preHash, header.nonce, previousDBBlock.nextDifficulty)
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

    public static async processBlock(block: Block, dbBlock: DBBlock, hash: Hash, header: BlockHeader, previousDBBlock: DBBlock, database: Database, worldState: WorldState, result: IPutResult): Promise<void> {
        // Consensus Critical
        const merkleRoot = Block.calculateMerkleRoot(block.txs)
        if (!merkleRoot.equals(header.merkleRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): Merkle root(${header.merkleRoot.toString()}) does not match calculated value(${merkleRoot.toString()})`)
            return
        }

        for (const tx of block.txs) {
            if (!tx.verify()) {
                logger.warn(`Rejecting block(${hash.toString()}): TX(${new Hash(tx).toString()}) signature is incorrect`)
                result.status = BlockStatus.Rejected
                return
            }
        }

        const { stateTransition, validTxs, invalidTxs } = await worldState.next(previousDBBlock.header.stateRoot, block.header.miner, block.txs)
        if (!stateTransition.currentStateRoot.equals(block.header.stateRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): stateRoot(${header.stateRoot}) does not match calculated value(${stateTransition.currentStateRoot})`)
            result.status = BlockStatus.Rejected
            return
        }

        if (invalidTxs.length > 0 || validTxs.length !== block.txs.length) {
            logger.warn(`Rejecting block(${hash.toString()}): expected ${block.txs.length} transactions to be processed, but ${validTxs.length} were processed and ${invalidTxs.length} were rejected`)
            result.status = BlockStatus.Rejected
            return
        }

        const { offset, fileNumber, length } = await database.writeBlock(block)
        await worldState.putPending(stateTransition.batch, stateTransition.mapAccount)
        dbBlock.offset = offset
        dbBlock.fileNumber = fileNumber
        dbBlock.length = length

        result.dbBlock = dbBlock
        result.status = BlockStatus.Block
        return
    }
}
