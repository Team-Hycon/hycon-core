import { randomBytes, randomFillSync } from "crypto"
import { setServers } from "dns"
import { } from "jasmine"
import * as Long from "long"
import * as $protobuf from "protobufjs"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import * as GenesisHeader from "../src/common/genesisHeader"
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
            miner: randomBytes(20),
            nonce,
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
            pEMA: 30,
            tEMA: 30,
            totalWork: 0,
        }
        dbBlock = new DBBlock(iDBBlock)
    })

    it("constructor : if there is DBBlock parameter, set property.", () => {
        const setSpy = spyOn(DBBlock.prototype, "set")
        const block = new DBBlock(iDBBlock)

        expect(setSpy).toHaveBeenCalled()
    })

    it("set(block) : if set method set property", () => {
        dbBlock.set({
            fileNumber: 1,
            header: new BlockHeader(iBlockHeader),
            height: 1,
            length: 1,
            nextDifficulty: 2,
            offset: 100,
            pEMA: 40,
            tEMA: 40,
            totalWork: 100,
        })

        expect(dbBlock.height).toEqual(1)
        expect(dbBlock.fileNumber).toEqual(1)
        expect(dbBlock.offset).toEqual(100)
        expect(dbBlock.header).toBeDefined()
        expect(dbBlock.length).toEqual(1)
        expect(dbBlock.tEMA).toEqual(40)
        expect(dbBlock.pEMA).toEqual(40)
        expect(dbBlock.totalWork).toEqual(100)
        expect(dbBlock.nextDifficulty).toEqual(2)
    })

    it("set(block) : if set method set property, if header is not instance of BlockHeader", () => {
        const setSpy = spyOn(GenesisHeader, "setGenesisBlockHeader").and.returnValue({
            difficulty: iBlockHeader.difficulty,
            merkleRoot: new Hash(),
            stateRoot: iBlockHeader.stateRoot,
            timeStamp: iBlockHeader.timeStamp,
        })

        delete iBlockHeader.previousHash
        delete dbBlock.header

        dbBlock.set({
            fileNumber: 6,
            header: iBlockHeader,
            height: 7,
            length: 9,
            nextDifficulty: 1,
            offset: 8,
            pEMA: 30,
            tEMA: 30,
            totalWork: 0,
        })

        expect(dbBlock.height).toEqual(7)
        expect(dbBlock.fileNumber).toEqual(6)
        expect(dbBlock.offset).toEqual(8)
        expect(dbBlock.length).toEqual(9)
        expect(dbBlock.tEMA).toEqual(30)
        expect(dbBlock.pEMA).toEqual(30)
        expect(dbBlock.totalWork).toEqual(0)
        expect(dbBlock.nextDifficulty).toEqual(1)
        expect(setSpy).toHaveBeenCalled()
    })

    it("decode(data) : set data using set method.", () => {
        spyOn(proto.BlockDB, "decode").and.returnValue({
            fileNumber: 0,
            header: new BlockHeader(iBlockHeader),
            height: 0,
            length: 10,
            nextDifficulty: 1,
            offset: 0,
            pEMA: 30,
            tEMA: 30,
            totalWork: 0,
        })
        const setSpy = spyOn(DBBlock.prototype, "set")

        const result = DBBlock.decode(randomBytes(32))

        expect(proto.BlockDB.decode).toHaveBeenCalledBefore(setSpy)
    })

    it("encode() : encode method must call proto.BlockDB.encode", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.BlockDB, "encode").and.returnValue(encoder)
        dbBlock.encode()
        expect(encodeSpy).toHaveBeenCalled()
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

    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({ height: 0, header: new BlockHeader(iBlockHeader) })
        }
        expect(result).toThrowError("DBBlock tEMA is missing")
    })

    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({ height: 0, header: new BlockHeader(iBlockHeader), tEMA: 30 })
        }
        expect(result).toThrowError("DBBlock pEMA is missing")
    })

    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({ height: 0, header: new BlockHeader(iBlockHeader), tEMA: 30, pEMA: 30 })
        }
        expect(result).toThrowError("DBBlock nextDifficulty is missing")
    })

    it("When set throw error, exception handling", () => {
        function result() {
            dbBlock.set({ height: 0, header: new BlockHeader(iBlockHeader), tEMA: 30, pEMA: 30, nextDifficulty: 1 })
        }
        expect(result).toThrowError("DBBlock totalWork is missing")
    })
})
