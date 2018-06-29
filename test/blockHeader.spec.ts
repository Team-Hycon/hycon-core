import { BlockHeader } from "../src/common/blockHeader"
import { SignedTx } from "../src/common/txSigned"
import { Hash } from "../src/util/hash"

import { randomBytes } from "crypto"
import { Tx } from "../src/common/tx"

import * as proto from "../src/serialization/proto"

import { } from "jasmine"
import * as Long from "long"
import { Address } from "../src/common/address"

describe("BlockHeader", () => {
    let iBlock: proto.BlockHeader
    let blockHeader: BlockHeader

    function equal(buf1: Uint8Array, buf2: Uint8Array): boolean {
        if (buf1.byteLength !== buf2.byteLength) { return false }
        const dv1 = new Int8Array(buf1)
        const dv2 = new Int8Array(buf2)
        for (let i = 0; i !== buf1.byteLength; i++) {
            if (dv1[i] !== dv2[i]) { return false }
        }
        return true
    }

    beforeEach(() => {
        iBlock = new proto.BlockHeader()
        iBlock.previousHash = [new Hash(randomBytes(32))]
        iBlock.merkleRoot = new Hash(randomBytes(32))
        iBlock.difficulty = 5
        iBlock.nonce = 0
        iBlock.timeStamp = Date.now()
        iBlock.stateRoot = new Hash(randomBytes(32))
        iBlock.miner = new Uint8Array(20)

        blockHeader = new BlockHeader(iBlock)
    })
    it("should call the set function on construction", () => {
        const setSpy = spyOn(BlockHeader.prototype, "set").and.callFake(() => { })
        const header = new BlockHeader({})
        expect(setSpy).toHaveBeenCalled()
    })

    it("Should throw an error if merkle root is undefined", () => {
        let str: string = ""
        try {
            const header = new BlockHeader({})
        } catch (e) {
            if (e) { str = e.message }
        }
        expect(str).toEqual("Header missing merkle root")
    })
    it("Should throw an error if the state root is not defined", () => {
        const blk: proto.BlockHeader = new proto.BlockHeader()
        blk.previousHash = [new Hash(randomBytes(32))]
        blk.merkleRoot = new Hash(randomBytes(32))
        let str: string = ""
        try {
            const header = new BlockHeader(blk)

        } catch (e) {
            if (e) { str = e.message }
        }
        expect(str).toEqual("Header missing state root")
    })

    it("Should throw an error if the timestamp is not defined", () => {
        const blk: proto.BlockHeader = new proto.BlockHeader()
        blk.merkleRoot = new Hash(randomBytes(32))
        blk.stateRoot = new Hash(randomBytes(32))
        let str: string = ""
        try {
            const header = new BlockHeader(blk)

        } catch (e) {
            if (e) { str = e.message }
        }
        expect(str).toEqual("Header missing timeStamp")
    })

    it("Should throw an error if the difficulty is not defined", () => {
        const blk: proto.BlockHeader = new proto.BlockHeader()
        blk.merkleRoot = new Hash(randomBytes(32))
        blk.stateRoot = new Hash(randomBytes(32))
        blk.timeStamp = iBlock.timeStamp
        blk.difficulty = undefined
        let str: string = ""
        try {
            const header = new BlockHeader(blk)
        } catch (e) {
            if (e) { str = e.message }
        }
        expect(str).toEqual("Header missing difficulty")
    })

    it("Generate method should generate Block instance like block(parameter)", () => {
        expect(blockHeader.previousHash).not.toBeUndefined()
        expect(blockHeader.difficulty).not.toBeUndefined()
        expect(blockHeader.nonce).not.toBeUndefined()
        expect(blockHeader.merkleRoot).not.toBeUndefined()
        expect(blockHeader.timeStamp).not.toBeUndefined()
    })

    it("blockHeader.nonce Nonce: Should get the nonce at 0", () => {
        expect(blockHeader.nonce).toEqual(Long.fromNumber(0, true))
    })

    it("blockHeader.setHeader Nonce: Should set header to the block", () => {
        const iBlockTest = new proto.BlockHeader()

        const rdByte1 = new Hash(randomBytes(32))
        const rdByte2 = new Hash(randomBytes(32))
        const rdByte3 = new Hash(randomBytes(32))

        iBlockTest.previousHash = [rdByte1]
        iBlockTest.merkleRoot = rdByte2
        iBlockTest.difficulty = 10
        iBlockTest.nonce = 0
        iBlockTest.timeStamp = Date.now()
        iBlockTest.stateRoot = rdByte3
        iBlockTest.miner = new Uint8Array(20).fill(3)

        blockHeader.set(iBlockTest)

        expect(blockHeader.previousHash).toBeDefined()
        expect(blockHeader.merkleRoot).toBeDefined()
        expect(blockHeader.previousHash.length).toBe(2)
        expect(blockHeader.merkleRoot).toEqual(rdByte2)
        expect(blockHeader.difficulty).toEqual(10)
        expect(blockHeader.nonce).toEqual(Long.fromNumber(0, true))
        expect(blockHeader.timeStamp).not.toBeUndefined()
        expect(blockHeader.miner.equals(new Address(iBlockTest.miner))).toBeTruthy()
    })

    xit("blockheader.prehash: Should return the prehash excluding the nonce", () => {
        // TODO: generate a prehash to check against and compare it here
        const prehash = blockHeader.preHash()
        expect(prehash).toBeDefined()
        expect(blockHeader.nonce).toBeDefined()
    })
})
