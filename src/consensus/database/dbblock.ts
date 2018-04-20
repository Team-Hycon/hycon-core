import { AnyBlockHeader, BlockHeader } from "../../common/blockHeader"
import { setGenesisBlockHeader } from "../../common/genesisHeader"
import * as proto from "../../serialization/proto"

export class DBBlock implements proto.IBlockDB {
    public static decode(data: Uint8Array): DBBlock {
        const blockDB = proto.BlockDB.decode(data)
        return new DBBlock(blockDB)
    }
    public height: number
    public header: AnyBlockHeader
    public fileNumber?: number
    public offset?: number
    public length?: number
    public tEMA: number
    public pEMA: number
    public nextDifficulty: number
    public totalWork: number

    constructor(dbBlock: proto.IBlockDB) {
        // Consensus Critical
        this.set(dbBlock)
    }

    public set(block: proto.IBlockDB): void {
        // Consensus Critical
        if (block.height === undefined) {
            throw new Error("DBBlock height is missing")
        }
        if (block.header === undefined) {
            throw new Error("DBBlock header is missing")
        }
        if (block.tEMA === undefined) {
            throw new Error("DBBlock tEMA is missing")
        }
        if (block.pEMA === undefined) {
            throw new Error("DBBlock pEMA is missing")
        }
        if (block.nextDifficulty === undefined) {
            throw new Error("DBBlock nextDifficulty is missing")
        }
        if (block.totalWork === undefined) {
            throw new Error("DBBlock totalWork is missing")
        }

        if (block.fileNumber !== undefined) {
            this.fileNumber = block.fileNumber
        }
        if (block.offset !== undefined) {
            this.offset = block.offset
        }
        if (block.length !== undefined) {
            this.length = block.length
        }
        if (block.tEMA !== undefined) {
            this.tEMA = block.tEMA
        }
        if (block.pEMA !== undefined) {
            this.pEMA = block.pEMA
        }
        if (block.nextDifficulty !== undefined) {
            this.nextDifficulty = block.nextDifficulty
        }
        if (block.totalWork !== undefined) {
            this.totalWork = block.totalWork
        }

        this.height = block.height
        if (this.header === undefined) {
            if (block.header.previousHash !== undefined && block.header.previousHash.length > 0) {
                this.header = new BlockHeader(block.header)
            } else {
                this.header = setGenesisBlockHeader(block.header)
            }
        } else {
            this.header.set(block.header)
        }
    }

    public encode(): Uint8Array {
        return proto.BlockDB.encode(this).finish()
    }
}
