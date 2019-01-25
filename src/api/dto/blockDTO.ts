import { Block } from "../../common/block"
import { GenesisBlock } from "../../common/blockGenesis"
import { BlockHeader } from "../../common/blockHeader"
import { DBBlock } from "../../consensus/database/dbblock"
import { DBMined } from "../../consensus/database/dbMined"
import { Hash } from "../../util/hash"
import { TxDTO } from "./txDTO"

export class BlockDTO {
    public static blockToDTO(block: GenesisBlock | Block | DBBlock, height: number) {
        const blockDTO = new BlockDTO()
        blockDTO.height = height
        blockDTO.hash = new Hash(block.header).toString()
        blockDTO.difficulty = block.header.difficulty.toString()
        blockDTO.merkleRoot = block.header.merkleRoot.toString()
        blockDTO.stateRoot = block.header.stateRoot.toString()
        blockDTO.timestamp = block.header.timeStamp
        if (!(block instanceof DBBlock)) {
            blockDTO.setTxs(block)
        }

        if (block.header instanceof BlockHeader) {
            blockDTO.nonce = block.header.nonce.toString()
            blockDTO.miner = block.header.miner.toString()
            blockDTO.setPreviousHashes(block.header.previousHash)
        }

        return blockDTO
    }

    public static minedDBToDTO(block: DBMined) {
        const blockDTO = new BlockDTO()
        blockDTO.hash = block.blockhash
        blockDTO.reward = block.feeReward
        blockDTO.timestamp = block.blocktime
        blockDTO.miner = block.miner
        return blockDTO
    }

    public height: number
    public previousHash: string
    public uncleHash: string[]
    public hash: string
    public difficulty: string
    public merkleRoot: string
    public stateRoot: string
    public nonce: string
    public timestamp: number
    public miner: string
    public txs: TxDTO[]
    public reward: string

    public setPreviousHashes(previousHashes: Hash[]) {
        this.uncleHash = []
        const uncles = previousHashes.slice(1)
        this.previousHash = previousHashes[0].toString()
        for (const uncle of uncles) {
            this.uncleHash.push(uncle.toString())
        }
    }
    public setTxs(block: GenesisBlock | Block) {
        this.txs = []
        for (const tx of block.txs) {
            this.txs.push(TxDTO.txToDTO(tx))
        }
    }

}
