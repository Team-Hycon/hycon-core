import { randomBytes } from "crypto"
import { setServers } from "dns"
import { } from "jasmine"
import * as Long from "long"
import * as $protobuf from "protobufjs"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import * as HeaderBlock from "../src/common/blockHeader"
import { setGenesisBlockHeader } from "../src/common/genesisHeader"
import { DBBlock } from "../src/consensus/database/dbblock"
import * as proto from "../src/serialization/proto"
import { BlockDB } from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

describe("DBBlock Test", () => {
    let dbBlock: DBBlock
    let iBlockHeader: proto.IBlockHeader
    let iDBBlock: proto.IBlockDB
    beforeEach(() => {
        const nonce = Long.fromNumber(83, true)
        iBlockHeader = {
            difficulty: 1,
            merkleRoot: randomBytes(32),
            nonce: 83,
            previousHash: [randomBytes(32)],
            stateRoot: randomBytes(32),
            timeStamp: Date.now(),
        }

        iDBBlock = {
            fileNumber: 0,
            header: new BlockHeader(iBlockHeader),
            height: 0,
            length: 0,
            nextDifficulty: 1,
            offset: 0,
            tEMA: 30,
            totalWork: 0,
        }
        dbBlock = new DBBlock(iDBBlock)
    })

    it("constructor : if there is DBBlock parameter, set property.", () => {
        const block = new DBBlock(iDBBlock)

        expect(block.height).toEqual(0)
        expect(block.fileNumber).toEqual(0)
        expect(block.offset).toEqual(0)
        expect(block.header).toBeDefined()
        expect(block.length).toEqual(0)
        expect(block.tEMA).toEqual(30)
        expect(block.totalWork).toEqual(0)
        expect(block.nextDifficulty).toEqual(1)
    })

    it("set(block) : if set method set property", () => {
        dbBlock.set(iDBBlock)

        expect(dbBlock.height).toBeDefined()
        expect(dbBlock.fileNumber).toBeDefined()
        expect(dbBlock.offset).toBeDefined()
        expect(dbBlock.header).toBeDefined()
        expect(dbBlock.length).toBeDefined()
    })

    it("set(block) : if set method set property, if header is not instance of BlockHeader", () => {
        const setSpy = jasmine.createSpy("setGenesisBlockHeader", setGenesisBlockHeader).and.returnValue({
            difficulty: iBlockHeader.difficulty,
            merkleRoot: new Hash(),
            timeStamp: iBlockHeader.timeStamp,
        })

        delete iBlockHeader.previousHash

        dbBlock.set({
            fileNumber: 6,
            header: iBlockHeader,
            height: 7,
            length: 9,
            nextDifficulty: 1,
            offset: 8,
            tEMA: 30,
            totalWork: 0,
        })

        expect(dbBlock.height).toEqual(7)
        expect(dbBlock.fileNumber).toEqual(6)
        expect(dbBlock.offset).toEqual(8)
        expect(dbBlock.length).toEqual(9)
        expect(dbBlock.tEMA).toEqual(30)
        expect(dbBlock.totalWork).toEqual(0xFF)
        expect(dbBlock.nextDifficulty).toEqual(0xEE)
        expect(setSpy).toHaveBeenCalled()
    })

    it("decode(data) : set data using set method.", () => {
        spyOn(proto.BlockDB, "decode").and.returnValue({ height: 0, fileNumber: 0, offset: 0, header: new BlockHeader(iBlockHeader), length: 10 })
        const setSpy = spyOn(DBBlock.prototype, "set")

        const result = DBBlock.decode(randomBytes(32))

        expect(proto.BlockDB.decode).toHaveBeenCalledBefore(setSpy)
    })

    it("decode(data) : set data using set method", () => {
        const header = new BlockHeader(iBlockHeader)
        dbBlock.set(({ height: 0, fileNumber: 0, offset: 0, header, length: 10 }))

        expect(dbBlock.height).toEqual(0)
        expect(dbBlock.fileNumber).toEqual(0)
        expect(dbBlock.offset).toEqual(0)
        expect(dbBlock.header).toEqual(header)
        expect(dbBlock.length).toEqual(10)
    })

    it("encode() : encode method must call proto.BlockDB.encode", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.BlockDB, "encode").and.returnValue(encoder)
        dbBlock.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})

describe("Test case, throw error", () => {
    let dbBlock: DBBlock
    beforeEach(() => {
        dbBlock = new DBBlock({})
    })
    it("When decode throw error, exception handling", () => {
        spyOn(proto.BlockDB, "decode").and.throwError("Error while decode data")
        function result() {
            DBBlock.decode(randomBytes(32))
        }
        expect(result).toThrowError("Error while decode data")
    })
    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({})
        }
        expect(result).toThrowError("DBBlock height is missing")
    })
    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({ height: 0 })
        }
        expect(result).toThrowError("DBBlock header is missing")
    })

})
