import { getLogger } from "log4js"
import merkle = require("merkle-lib")
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { GenesisBlock } from "./blockGenesis"
import { BlockHeader } from "./blockHeader"
import { SignedTx } from "./txSigned"

const logger = getLogger("Block")

export type AnyBlock = (Block | GenesisBlock)

export class Block implements proto.IBlock {
    public static decode(data: Uint8Array): AnyBlock {
        const block = proto.Block.decode(data)
        if (block.header) {
            if (block.header.previousHash === undefined || block.header.previousHash.length === 0) {
                return new GenesisBlock(block)
            }
        }
        return new Block(block)
    }
    public static calculateMerkleRoot(txs: SignedTx[]): Hash {
        // Consensus Critical
        const values: Uint8Array[] = txs.map((tx) => new Hash(tx))
        const tree = merkle(values, Hash.hash)
        return new Hash(tree[tree.length - 1])
    }

    public header: BlockHeader
    public txs: SignedTx[]

    constructor(block: proto.IBlock) {
        this.set(block)
    }

    public set(block: proto.IBlock): void {
        if (block.txs === undefined) { throw (new Error("Block Txs are missing")) }
        if (block.header === undefined) { throw (new Error("Block Header is missing in Block")) }

        this.txs = []
        for (const tx of block.txs) {
            this.txs.push(new SignedTx(tx))
        }

        if (this.header === undefined) {
            this.header = new BlockHeader(block.header)
        } else {
            this.header.set(block.header)
        }
    }

    public recalculateMerkleRoot(): void {
        this.header.merkleRoot = Block.calculateMerkleRoot(this.txs)
    }

    public encode(): Uint8Array {
        return proto.Block.encode(this).finish()
    }
}
