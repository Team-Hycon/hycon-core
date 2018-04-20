import { randomBytes } from "crypto"
import { } from "jasmine"
import Long = require("long")
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

describe("Block", () => {
    let iBlock: proto.IBlock
    let tx: jasmine.SpyObj<SignedTx>
    let tx2: jasmine.SpyObj<SignedTx>
    let header: proto.IBlockHeader
    let block: Block

    beforeEach(() => {
        const nonce = Long.fromNumber(1234, true)
        header = {
            difficulty: 5,
            merkleRoot: randomBytes(32),
            nonce: Long.fromNumber(1234, true),
            previousHash: [randomBytes(32)],
            stateRoot: randomBytes(32),
            timeStamp: Date.now(),
        }

        block = new Block({ header, txs: [], miner: new Address(randomBytes(20)) })
        tx = jasmine.createSpyObj("Tx", ["verify"])
        tx2 = jasmine.createSpyObj("Tx", ["verify"])
    })

    it("Generate method should generate Block instance like block(parameter)", () => {
        expect(header.difficulty).toEqual(block.header.difficulty)
        expect(header.nonce).toEqual(block.header.nonce)
        expect(header.timeStamp).toEqual(block.header.timeStamp)
        expect(block.header.previousHash).toBeDefined()
        expect(block.header.merkleRoot).toBeDefined()
        expect(block.txs).toBeDefined()
    })

    it("UpdateMerkleRoot() should call the calculateMerkleRoot method and update the merkleRoot", () => {
        const merkle = new Hash(randomBytes(32))
        const merkleSpy = spyOn(block, "calculateMerkleRoot").and.returnValue(merkle)
        block.updateMerkleRoot()
        expect(merkleSpy).toHaveBeenCalled()
        expect(block.header.merkleRoot).toEqual(merkle)
    })

    it("calculateMarkleRoot() should generate a merkle root based on transactions", () => {
        const merkle = block.header.merkleRoot
        const newMerkle = block.calculateMerkleRoot()
        expect(merkle === newMerkle).toBeFalsy()
    })

    it("calculateMerkleRoot() should return a different root with different transactions", () => {
        const stx = new SignedTx({
            amount: 10000, fee: 100,
            from: new Address(randomBytes(20)),
            nonce: 1234, recovery: 10, signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })
        const merkle1 = block.calculateMerkleRoot()
        block.txs.push(stx)
        const merkle2 = block.calculateMerkleRoot()
        expect(merkle1 === merkle2).toBeFalsy()
    })

    it("Set method should reuse BlockHeader if it is available ", () => {
        const headerSetSpy = spyOn(block.header, "set")
        iBlock = {
            header: {
                difficulty: 6,
                merkleRoot: randomBytes(32),
                nonce: 12345,
                previousHash: [randomBytes(32)],
                timeStamp: 1,
            },
            miner: new Address(randomBytes(20)),
            txs: [],
        }
        expect(block.header).toBeDefined()
        block.set(iBlock)
        expect(headerSetSpy).toHaveBeenCalled()
    })

    it("Set method should throw if Header is missing ", () => {
        function result() {
            return block.set({ txs: [] })
        }

        expect(result).toThrowError("Block Header is missing in Block")
    })

    it("Set method should throw if Txs are missing ", () => {
        function result() {
            return block.set({ header: {} })
        }

        expect(result).toThrowError("Block Txs are missing")
    })

    it("Set method should throw is Miner is missing", () => {
        function result() {
            return block.set({ header: {}, txs: [] })
        }
        expect(result).toThrowError("Miner is missing")
    })

    it("Set method should push Signed Txs to txs property", () => {
        const stx = {
            amount: 10000, fee: 100,
            from: new Address(randomBytes(20)),
            nonce: 1234, recovery: 10, signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        }
        block.set({ header, txs: [stx, stx], miner: new Address(randomBytes(20)) })

        expect(block.txs.length).toEqual(2)
    })

    it("decode should throw error if txs are missing", () => {
        const decodeSpy = spyOn(proto.Block, "decode").and.returnValue({ header: {} })
        const setSpy = spyOn(Block.prototype, "set").and.callThrough()

        function result() {
            return Block.decode(new Buffer(32))
        }

        expect(result).toThrowError("Block Txs are missing")
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy)
        expect(setSpy).toHaveBeenCalled()
    })

    it("decodeAny(data) should call the proto.Block.decode method", () => {
        const decodeSpy = spyOn(proto.Block, "decode").and.returnValue({
            header: {
                difficulty: 5,
                merkleRoot: randomBytes(32),
                nonce: Long.fromNumber(1234, true),
                previousHash: [randomBytes(32)],
                stateRoot: randomBytes(32),
                timeStamp: Date.now(),
            }, miner: new Address(randomBytes(20)), txs: [],
        })
        Block.decode(new Buffer(32))
        expect(decodeSpy).toHaveBeenCalled()
    })

    it("decode(data) should call the genesis block set method if prev hash is undefined", () => {
        const decodeSpy = spyOn(proto.Block, "decode").and.returnValue({
            header: {
                difficulty: 0,
                merkleRoot: randomBytes(32),
                nonce: Long.fromNumber(1234, true),
                stateRoot: randomBytes(32),
                timeStamp: Date.now(),
            }, miner: new Address(randomBytes(20)), txs: [],
        })
        const gSpy = spyOn(GenesisBlock.prototype, "set")
        Block.decode(new Buffer(32))
        expect(gSpy).toHaveBeenCalled()
    })

    it("encode method should return encoded block data using proto.Block.encode function", () => {
        const expected = new Buffer(32)
        const encoder = jasmine.createSpyObj<protobuf.Writer>("encoder", ["finish"])
        encoder.finish.and.returnValue(expected)
        const encode = spyOn(proto.Block, "encode").and.returnValue(encoder)

        const encoded = block.encode()

        expect(encoded).toBe(expected)
        expect(proto.Block.encode).toHaveBeenCalled()
        expect(encoder.finish).toHaveBeenCalled()
    })
})
