import { randomBytes } from "crypto"
import { } from "jasmine"
import Long = require("long")
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { BlockHeader } from "../src/common/blockHeader"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

describe("Block", () => {
    const addr1 = "H3zNqBpmhGREvYQsk4VDmYuoFLP6XHnsc"
    const addr2 = "H4TSHquAPibvNk77YFXRs6V7rwSxJD6th"
    const rb1 = randomBytes(32)
    const rb2 = randomBytes(32)
    const rb3 = randomBytes(32)
    const rb4 = randomBytes(32)

    let protoTx: proto.ITx
    let tx: SignedTx

    let blk: Block
    let protoBlkHdr: proto.IBlockHeader
    let protoBlk: proto.IBlock

    beforeEach(() => {
        protoTx = {
            amount: 4444,
            fee: 333,
            from: new Address(addr1),
            nonce: 22,
            recovery: 1,
            signature: rb1,
            to: new Address(addr2),
        }
        tx = new SignedTx(protoTx)

        protoBlkHdr = {
            difficulty: 1,
            merkleRoot: rb1,
            miner: new Address(addr1),
            nonce: Long.fromNumber(22, true),
            previousHash: [rb3],
            stateRoot: rb4,
            timeStamp: Date.now(),
        }
        protoBlk = { header: new BlockHeader(protoBlkHdr), txs: [tx] }
    })

    it("decode(data) : should decode Uint8Array data and return new (Block | GenesisBlock) object", () => {
        const setSpy1 = spyOn(Block.prototype, "set")
        const setSpy2 = spyOn(GenesisBlock.prototype, "set")

        // Return new Block
        const decodeSpy = spyOn(proto.Block, "decode").and.returnValue(protoBlk)
        Block.decode(rb1)
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy1)

        // Return new GenesisBlock
        protoBlk.header.previousHash = undefined
        Block.decode(rb2)
        expect(setSpy2).toHaveBeenCalled()
    })

    it("calculateMarkleRoot() : should generate a merkle root based on transactions", () => {
        blk = new Block(protoBlk)
        const merkle = blk.header.merkleRoot
        const newMerkle = Block.calculateMerkleRoot(blk.txs)
        expect(merkle === newMerkle).toBeFalsy()
    })

    it("calculateMerkleRoot() : should return a different root with different transactions", () => {
        blk = new Block(protoBlk)
        const merkle1 = Block.calculateMerkleRoot(blk.txs)
        blk.txs.push(tx)
        const merkle2 = Block.calculateMerkleRoot(blk.txs)
        expect(merkle1 === merkle2).toBeFalsy()
    })

    it("constructor(block) : ", () => {
        const setSpy = spyOn(Block.prototype, "set")
        blk = new Block(protoBlk)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set(block) : method should set property using parameter", () => {
        const setSpy = spyOn(BlockHeader.prototype, "set")
        blk = new Block(protoBlk)
        blk.set(protoBlk)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set(block) : Exception - when parameter is undefined", () => {
        blk = new Block(protoBlk)
        function undefHdr() { return blk.set(new Block({ header: protoBlkHdr })) }
        function undefTxs() { return blk.set(new Block({ txs: [] })) }
        expect(undefHdr).toThrowError()
        expect(undefTxs).toThrowError()
    })

    it("recalculateMerkleRoot(): should call calculateMerkleRoot method", () => {
        blk = new Block(protoBlk)
        const merkle = new Hash(rb1)
        const merkleSpy = spyOn(Block, "calculateMerkleRoot").and.returnValue(merkle)
        blk.recalculateMerkleRoot()
        expect(merkleSpy).toHaveBeenCalled()
        expect(blk.header.merkleRoot).toEqual(merkle)
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Block, "encode").and.returnValue(encoder)
        blk = new Block(protoBlk)
        blk.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
