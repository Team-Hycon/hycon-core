import { getLogger } from "log4js"
import { Block } from "../common/block"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { PublicKey } from "../common/publicKey"
import { GenesisSignedTx } from "../common/txGenesisSigned"
import { SignedTx } from "../common/txSigned"
import { globalOptions } from "../main"
import { MinerServer } from "../miner/minerServer"
import { Hash } from "../util/hash"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { IStateTransition, WorldState } from "./database/worldState"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"

const logger = getLogger("Verify")
export class Verify {
    public static async processHeader(previousDBBlock: DBBlock, header: BlockHeader, hash: Hash)
        : Promise<{
            newStatus: BlockStatus;
            dbBlock?: DBBlock;
        }> {
        // Consensus Critical

        if (header.timeStamp < previousDBBlock.header.timeStamp + 50) {
            return { newStatus: BlockStatus.Rejected }
        }
        const { nextDifficulty, tEMA, pEMA } = DifficultyAdjuster.adjustDifficulty(previousDBBlock, header.timeStamp)

        if (previousDBBlock.nextDifficulty !== header.difficulty) {
            logger.warn(`Rejecting block(${hash.toString()}): Difficulty(${header.difficulty}) does not match calculated value(${previousDBBlock.nextDifficulty})`)
            return { newStatus: BlockStatus.Rejected }
        }

        const preHash = header.preHash()
        const nonceCheck = await MinerServer.checkNonce(preHash, header.nonce, previousDBBlock.nextDifficulty)
        if (!nonceCheck) {
            logger.warn(`Rejecting block(${hash.toString()}): Hash does not meet difficulty(${header.difficulty})`)
            return { newStatus: BlockStatus.Rejected }
        }

        const height = previousDBBlock.height + 1
        const totalWork = previousDBBlock.totalWork + previousDBBlock.nextDifficulty
        const dbBlock = new DBBlock({ header, height, tEMA, pEMA, nextDifficulty, totalWork })

        return { newStatus: BlockStatus.Header, dbBlock }
    }

    public static async processBlock(block: Block, dbBlock: DBBlock, hash: Hash, header: BlockHeader, previousDBBlock: DBBlock, database: Database, worldState: WorldState)
        : Promise<{
            newStatus: BlockStatus;
            dbBlock?: DBBlock;
            dbBlockHasChanged?: boolean;
        }> {
        // Consensus Critical
        const merkleRoot = Block.calculateMerkleRoot(block.txs)
        if (!merkleRoot.equals(header.merkleRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): Merkle root(${header.merkleRoot.toString()}) does not match calculated value(${merkleRoot.toString()})`)

            return { newStatus: BlockStatus.Rejected }
        }

        for (const tx of block.txs) {
            if (!tx.verify()) {
                const txHash = new Hash(tx)
                logger.warn(`Rejecting block(${hash.toString()}): TX(${txHash.toString()}) signature is incorrect`)
                return { newStatus: BlockStatus.Rejected }
            }
        }

        const { stateTransition, validTxs, invalidTxs } = await worldState.next(previousDBBlock.header.stateRoot, block.header.miner, block.txs)
        if (!stateTransition.currentStateRoot.equals(block.header.stateRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): stateRoot(${header.stateRoot}) does not match calculated value(${stateTransition.currentStateRoot})`)
            return { newStatus: BlockStatus.Rejected }
        }

        if (invalidTxs.length > 0 || validTxs.length !== block.txs.length) {
            logger.warn(`Rejecting block(${hash.toString()}): expected ${block.txs.length} transactions to be processed, but ${validTxs.length} were processed and ${invalidTxs.length} were rejected`)
            return { newStatus: BlockStatus.Rejected }
        }

        const { offset, fileNumber, length } = await database.writeBlock(block)
        await worldState.putPending(stateTransition.batch, stateTransition.mapAccount)

        dbBlock.offset = offset
        dbBlock.fileNumber = fileNumber
        dbBlock.length = length

        return { newStatus: BlockStatus.Block, dbBlock, dbBlockHasChanged: true }
    }
}
