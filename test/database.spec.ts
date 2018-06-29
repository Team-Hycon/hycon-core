import { ExpansionPanel } from "@material-ui/core"
import { randomBytes } from "crypto"
import { NotFoundError } from "level-errors"
import * as levelup from "levelup"
import Long = require("long")
import rocksdb = require("rocksdb")
import { AsyncLock } from "../src/common/asyncLock"
import { AnyBlock, Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { BlockFile } from "../src/consensus/database/blockFile"
import { Database } from "../src/consensus/database/database"
import { DBBlock } from "../src/consensus/database/dbblock"
import { BlockStatus } from "../src/consensus/sync"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"
import { testAsync } from "./async"
describe("Database init test", () => {
    let databse: Database
    beforeEach(() => {
        databse = new Database("garbage", "garbage")
    })

    it("init() : should get fileNumber, filePosition from db", testAsync(async () => {
        const openSpy = spyOn(levelup.prototype, "open")
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(0)
        const putSpy = spyOn(levelup.prototype, "put")
        const fileInitSpy = spyOn(BlockFile.prototype, "fileInit")
        try { await databse.init() } catch (e) { }
        expect(openSpy).toHaveBeenCalled()
        expect(getSpy).toHaveBeenCalledTimes(2)
        expect(putSpy).not.toHaveBeenCalled()
        expect(fileInitSpy).toHaveBeenCalledWith(0, 0)
    }))

    it("init() : should get fileNumber, filePosition from db", testAsync(async () => {
        const openSpy = spyOn(levelup.prototype, "open")
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(Promise.reject(new NotFoundError()))
        const putSpy = spyOn(levelup.prototype, "put")
        const fileInitSpy = spyOn(BlockFile.prototype, "fileInit")
        try { await databse.init() } catch (e) { }
        expect(openSpy).toHaveBeenCalled()
        expect(getSpy).toHaveBeenCalledTimes(2)
        expect(putSpy).toHaveBeenCalledTimes(2)
        expect(fileInitSpy).toHaveBeenCalledWith(0, 0)
    }))
})

describe("Database test", () => {
    let databse: Database
    let dbBlock: DBBlock
    let iBlockHeader: proto.IBlockHeader
    let iDBBlock: proto.IBlockDB
    let block: Block
    let iBlock: proto.IBlock
    beforeAll(testAsync(async () => {
        databse = new Database("garbage", "garbage")
    }))

    beforeEach(() => {
        iBlockHeader = {
            difficulty: 5,
            merkleRoot: randomBytes(32),
            miner: randomBytes(20),
            nonce: Long.fromNumber(1234, true),
            previousHash: [randomBytes(32)],
            stateRoot: randomBytes(32),
            timeStamp: Date.now(),
        }
        iDBBlock = {
            fileNumber: 0,
            header: iBlockHeader,
            height: 0,
            length: 150,
            nextDifficulty: 100,
            offset: 0,
            pEMA: 30,
            tEMA: 30,
            totalWork: 1000,
        }
        iBlock = {
            header: iBlockHeader,
            txs: [],
        }
        block = new Block(iBlock)
        dbBlock = new DBBlock(iDBBlock)
    })

    it("putDBBlock(hash, dbBlock): put dbBlock to database.", testAsync(async () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.BlockDB, "encode").and.returnValue(encoder)
        const putSpy = spyOn(levelup.prototype, "put")
        const hash = new Hash(randomBytes(32))
        try { await databse.putDBBlock(hash, dbBlock) } catch (e) { }
        expect(encodeSpy).toHaveBeenCalledBefore(putSpy)
    }))

    it("writeBlock(block) : write block to blockfile", testAsync(async () => {
        const fileputSpy = spyOn(BlockFile.prototype, "put").and.returnValue({ fileNumber: 0, filePosition: 150, offset: 0, length: 150 })
        const putSpy = spyOn(levelup.prototype, "put")
        let writeLocation: { fileNumber: number, filePosition: number, offset: number, length: number }
        try { writeLocation = await databse.writeBlock(block) } catch (e) { }
        expect(fileputSpy).toHaveBeenCalledBefore(putSpy)
        expect(putSpy).toHaveBeenCalledTimes(2)
        expect(writeLocation).not.toBeUndefined()
    }))

    it("setHashAtHeight(height, hash): set height with hash in db", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const putSpy = spyOn(levelup.prototype, "put")
        const toBufferSpy = spyOn(Hash.prototype, "toBuffer").and.returnValue(buf)
        try { await databse.setHashAtHeight(1, new Hash(randomBytes(32))) } catch (e) { }
        expect(putSpy).toHaveBeenCalledWith(1, buf)
    }))

    it("getHashAtHeight(height): query with height and return hash", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(buf)
        let result: Hash
        try { result = await databse.getHashAtHeight(1) } catch (e) { }
        expect(result.equals(buf)).toBeTruthy()
        expect(getSpy).toHaveBeenCalled()
    }))

    it("getBlockAtHeight(height): query with height and return block", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(buf)
        const getDBBlockSpy = spyOn(databse, "getDBBlock").and.returnValue(dbBlock)
        const dbBlockToBlockSpy = spyOn(databse, "dbBlockToBlock").and.returnValue(block)
        const hash = new Hash(block.header)
        let result: Block | GenesisBlock
        try { result = await databse.getBlockAtHeight(1) } catch (e) { }
        expect(getSpy).toHaveBeenCalledBefore(getDBBlockSpy)
        expect(getDBBlockSpy).toHaveBeenCalledBefore(dbBlockToBlockSpy)
        expect(hash.equals(new Hash(result.header))).toBeTruthy()
    }))

    it("setBlockStatus(height, status): set status with hash in db", testAsync(async () => {
        const hash = new Hash(new Buffer(32).fill(1))
        const putSpy = spyOn(levelup.prototype, "put")
        try { await databse.setBlockStatus(hash, BlockStatus.MainChain) } catch (e) { }
        expect(putSpy).toHaveBeenCalledWith("s" + hash, BlockStatus.MainChain)
    }))

    it("getBlockStatus(hash): return blockstatus", testAsync(async () => {
        const hash = new Hash(new Buffer(32).fill(1))
        const buf = new Buffer(32).fill(1)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(BlockStatus.MainChain)
        let result: BlockStatus
        try { result = await databse.getBlockStatus(hash) } catch (e) { }
        expect(result).toBe(BlockStatus.MainChain)
        expect(getSpy).toHaveBeenCalledWith("s" + hash)
    }))

    it("setBlockTip(hash) : should set blocktip information in db", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const hash = new Hash(buf)
        const toBufferSpy = spyOn(Hash.prototype, "toBuffer").and.returnValue(buf)
        const putSpy = spyOn(levelup.prototype, "put")
        try { await databse.setBlockTip(hash) } catch (e) { }
        expect(putSpy).toHaveBeenCalledWith("__blockTip", buf)
        expect(toBufferSpy).toHaveBeenCalledBefore(putSpy)
    }))

    it("getBlockTip(): return tip", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const hash = new Hash(buf)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(buf)
        const getDBBlockSpy = spyOn(databse, "getDBBlock").and.returnValue(dbBlock)
        let tip: DBBlock | undefined
        try { tip = await databse.getBlockTip() } catch (e) { }
        expect(getSpy).toHaveBeenCalledWith("__blockTip")
        expect(getDBBlockSpy).toHaveBeenCalledWith(hash)
    }))

    it("setHeaderTip(hash) : should set headertip information in db", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const hash = new Hash(buf)
        const toBufferSpy = spyOn(Hash.prototype, "toBuffer").and.returnValue(buf)
        const putSpy = spyOn(levelup.prototype, "put")
        try { await databse.setHeaderTip(hash) } catch (e) { }
        expect(putSpy).toHaveBeenCalledWith("__headerTip", buf)
        expect(toBufferSpy).toHaveBeenCalledBefore(putSpy)
    }))

    it("getHeaderTip(): return tip", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const hash = new Hash(buf)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(buf)
        const getDBBlockSpy = spyOn(databse, "getDBBlock").and.returnValue(dbBlock)
        let tip: DBBlock | undefined
        try { tip = await databse.getHeaderTip() } catch (e) { }
        expect(getSpy).toHaveBeenCalledWith("__headerTip")
        expect(getDBBlockSpy).toHaveBeenCalledWith(hash)
    }))

    it("getBlock(hash) : query with hash and return block", testAsync(async () => {
        const hash = new Hash(new Buffer(32).fill(1))
        const getDBBlockSpy = spyOn(databse, "getDBBlock").and.returnValue(dbBlock)
        const dbBlockToBlockSpy = spyOn(databse, "dbBlockToBlock").and.returnValue(block)
        let result: AnyBlock | undefined
        try { result = await databse.getBlock(hash) } catch (e) { }
        expect(getDBBlockSpy).toHaveBeenCalledWith(hash)
        expect(dbBlockToBlockSpy).toHaveBeenCalledWith(dbBlock)
    }))

    it("getDBBlocksRange(fromHeight, count) : return dbblock array", testAsync(async () => {
        const hash = new Hash(new Buffer(32).fill(1))
        const getHashAtHeightSpy = spyOn(databse, "getHashAtHeight").and.returnValue(hash)
        const getDBBlockSpy = spyOn(databse, "getDBBlock").and.returnValue(dbBlock)
        let dbblocks: DBBlock[] = []
        try { dbblocks = await databse.getDBBlocksRange(0, 10) } catch (e) { }
        expect(getHashAtHeightSpy).toHaveBeenCalledTimes(10)
        expect(getDBBlockSpy).toHaveBeenCalledTimes(10)
        expect(dbblocks.length).toBe(10)
    }))

    it("getDBBlock(hash) : get data by hash and return dbblock", testAsync(async () => {
        const buf = new Buffer(32).fill(1)
        const hash = new Hash(buf)
        const getSpy = spyOn(levelup.prototype, "get").and.returnValue(buf)
        const decodeSpy = spyOn(DBBlock, "decode").and.returnValue(dbBlock)
        try { await databse.getDBBlock(hash) } catch (e) { }
        expect(getSpy).toHaveBeenCalledWith("b" + hash)
        expect(decodeSpy).toHaveBeenCalledWith(buf)
    }))

    it("dbBlockToBlock(dbBlock) : return block or genesisblock using dbblock", testAsync(async () => {
        const fileGetSpy = spyOn(BlockFile.prototype, "get").and.returnValue(block)
        try { await databse.dbBlockToBlock(dbBlock) } catch (e) { }
        expect(fileGetSpy).toHaveBeenCalled()
    }))
})
