import * as Base58 from "base-58"
import { randomBytes } from "crypto"
import * as fs from "fs-extra"
import { } from "jasmine"
import { NotFoundError } from "level-errors"
import * as levelup from "levelup"
import * as Long from "long"
import { setTimeout } from "timers"
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { BlockHeader } from "../src/common/blockHeader"
import { GenesisBlockHeader, setGenesisBlockHeader } from "../src/common/genesisHeader"
import { Tx } from "../src/common/tx"
import { GenesisSignedTx } from "../src/common/txGenesisSigned"
import { SignedTx } from "../src/common/txSigned"
import { BlockFile } from "../src/consensus/database/blockFile"
import { Database } from "../src/consensus/database/database"
import { DBBlock } from "../src/consensus/database/dbblock"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"
import { testAsync } from "./async"

describe("Database", () => {
    let database: Database

    let block: Block
    let genesisBlock: GenesisBlock
    let blockFile: BlockFile
    let testStx: SignedTx
    const iBlock: proto.IBlock = {
        header: {
            difficulty: 33,
            merkleRoot: new Hash("Merkle root"),
            nonce: Long.fromNumber(1234, true),
            previousHash: [new Hash("Previous Block")],
            timeStamp: Date.now(),
            stateRoot: new Hash("State root"),
        },
        txs: [],
        miner: new Address(randomBytes(20)),
    }
    beforeEach(testAsync(async () => {
        spyOn(fs, "existsSync").and.returnValue(true)
        spyOn(fs, "openSync").and.returnValue(10)
        spyOn(fs, "statSync").and.returnValue({ size: 0 })
        database = new Database("dbpath", "filepath")
        blockFile = new BlockFile()

        testStx = new SignedTx()
        testStx.from = new Address(randomBytes(32))
        testStx.to = new Address(randomBytes(32))
        testStx.fee = 10
        testStx.amount = 10000
        testStx.recovery = 1234
        testStx.nonce = 0
        testStx.signature = randomBytes(32)

        block = new Block(iBlock)
        block.txs.push(testStx)
        genesisBlock = new GenesisBlock(iBlock)
        genesisBlock.txs.push(testStx)
    }))

    it("putBlock(block): should call putHeader and put in file ( size <= 134217728 )", testAsync(async () => {
        const encodeSpy = spyOn(Block.prototype, "encode").and.returnValue(randomBytes(32))
        const prevBlock = new DBBlock(iBlock)
        prevBlock.height = 0
        const toStringSpy = spyOn(Hash.prototype, "toString").and.returnValue("test")

        try { await database.putBlock(new Hash(block), block) } catch (e) { return Promise.reject(e) }
        expect(toStringSpy).toHaveBeenCalled()
    }))

    it("putBlock(block): should call putHeader and put in file ( size > 134217728 )", testAsync(async () => {
        const prevBlock = new DBBlock(iBlock)
        prevBlock.height = 0
        const encodeSpy = spyOn(Block.prototype, "encode").and.returnValue(randomBytes(32))

        try { await database.putBlock(new Hash(block), block) } catch (e) { return Promise.reject(e) }
    }))

    it("putBlock(block): when error occured while makeDBBlock, return reject", testAsync(async () => {
        const encodeSpy = spyOn(Block.prototype, "encode").and.returnValue(randomBytes(32))

        let isError = false
        try { await database.putBlock(new Hash(block), block) } catch (e) { isError = true }

        expect(isError).toBeTruthy()
    }))

    it("putBlock(block): If fail to write block into file, return reject", testAsync(async () => {
        const prevBlock = new DBBlock(iBlock)
        prevBlock.height = 0
        const encodeSpy = spyOn(Block.prototype, "encode").and.returnValue(randomBytes(32))

        let isError = false
        try { await database.putBlock(new Hash(block), block) } catch (e) { isError = true }

        expect(isError).toBeTruthy()
    }))

    it("putHeader(block): should put the encoded block header in database", testAsync(async () => {
        const blockHeader = GenesisBlockHeader()
        const encodeSpy = spyOn(DBBlock.prototype, "encode").and.returnValue(randomBytes(32))
        spyOn(Hash, "hash").and.returnValue(Hash.hash("TestHash"))
        expect(Hash.hash).toHaveBeenCalled()
        expect(encodeSpy).toHaveBeenCalled()
    }))

    it("getBlock(hash): should get block info from blockFile using metadata in database", testAsync(async () => {
        const dbBlock = new DBBlock(iBlock)
        dbBlock.height = 1
        dbBlock.fileNumber = 0
        dbBlock.offset = 0
        dbBlock.header = block.header
        dbBlock.length = 10
        const decodeSpy = spyOn(DBBlock, "decode").and.returnValue(dbBlock)

        try { await database.getBlock(new Hash()) } catch (e) { return Promise.reject(e) }
    }))

    it("getBlock(hash): If block info is corrupted, return reejct", testAsync(async () => {
        const blockHash = randomBytes(32)
        const decodeSpy = spyOn(DBBlock, "decode").and.returnValue(undefined)
        let isError = false
        try { await database.getBlock(new Hash()) } catch (e) { isError = true }

        expect(decodeSpy).toHaveBeenCalledWith(blockHash)
        expect(isError).toBeTruthy()
    }))

    it("getBlock(hash): If error occured, return reject", testAsync(async () => {
        const blockHash = randomBytes(32)
        let isError = false
        try { await database.getBlock(new Hash()) } catch (e) { isError = true }

        expect(isError).toBeTruthy()
    }))
})

describe("Database init test", () => {
    let database: Database
    let block: Block
    let blockFile: BlockFile
    let testStx: SignedTx
    beforeEach(() => {
        spyOn(fs, "existsSync").and.returnValue(true)
        spyOn(fs, "openSync").and.returnValue(10)
        spyOn(fs, "statSync").and.returnValue({ size: 0 })
        spyOn(fs, "readFileSync").and.returnValue(randomBytes(32))
        spyOn(proto.Block, "decode").and.returnValue(new GenesisBlock({
            header: {
                difficulty: 5,
                timeStamp: Date.now(),
                merkleRoot: new Hash("Merkle root"),
                stateRoot: new Hash("State root"),
            },
            txs: [],
        }))
    })

    it("init() : should set fileNumber, filePosition, blockFile (fileNumber defined)", testAsync(async () => {
        database = new Database("dbpath", "filepath")
        spyOn(database, "getBlock").and.returnValue(Promise.reject(new NotFoundError()))

        try { await database.init() } catch (e) { return Promise.reject(e) }
    }))

    it("init() : should reset fileNumber, filePosition, blockFile (fileNumber undefined)", testAsync(async () => {
        database = new Database("dbpath", "filepath")
        spyOn(database, "getBlock").and.returnValue(Promise.reject(new NotFoundError()))

        try { await database.init() } catch (e) { return Promise.reject(e) }
    }))

    it("init() : should compare genesis block hash", testAsync(async () => {
        database = new Database("dbpath", "filepath")
        const genesis = new DBBlock({})
        genesis.header = new BlockHeader({
            difficulty: 33,
            merkleRoot: new Hash("Merkle root"),
            nonce: 1234,
            previousHash: [new Hash("Previous Block")],
            timeStamp: Date.now(),
            stateRoot: new Hash("State Hash"),
        })
        spyOn(Hash.prototype, "equals").and.returnValue(true)
        spyOn(database, "getBlock").and.returnValue(Promise.resolve(genesis))

        try { await database.init() } catch (e) { return Promise.reject(e) }
    }))
})

describe("Database slowSearch tests", () => {
    let database: Database
    let dataFunction: Function
    let endFunction: Function
    const data = [
        { key: new Buffer("ba"), value: new DBBlock({}) },
        { key: new Buffer("bb"), value: new DBBlock({}) },
        { key: new Buffer("bc"), value: new DBBlock({}) },
    ]
    beforeEach(() => {
        let i = 1
        const onSpy = jasmine.createSpyObj<{ on: (event: string, f: Function) => any }>("ReadStream", ["on"])
        spyOn(DBBlock, "decode").and.callFake((block: DBBlock) => {
            block.height = i
            block.fileNumber = 0
            block.offset = 0
            const nonce = Long.fromNumber(0, true)
            block.header = new BlockHeader({
                difficulty: 1,
                timeStamp: Date.now() - 10000 + ((i % 2 === 0) ? i * i : -(i * i)),
                merkleRoot: new Hash("Merkle Hash"),
                previousHash: [new Hash("Previous Hash")],
                nonce,
                stateRoot: new Hash("State Hash"),
            })
            i++
            block.length = 10
            return block
        })
        onSpy.on.and.callFake((event: string, f: Function) => {
            switch (event) {
                case "data":
                    dataFunction = f
                    break
                case "end":
                    endFunction = f
                    break
            }
            return onSpy
        })
        database = new Database("dbpath", "filepath")
    })

    it("slowSearch(decode, from, to, add): should return from to data and operate add function", testAsync(async () => {
        const result = []
        const promise = database.slowSearch<DBBlock>(DBBlock.decode, "b", "c", (data: DBBlock, datas: DBBlock[]) => {
            datas.push(data)
        })

        for (const keyAndValue of data) {
            dataFunction(keyAndValue)
        }
        endFunction()
        let slowSearch
        try { slowSearch = await promise } catch (e) { return Promise.reject(e) }
        expect(slowSearch.length).toEqual(3)
        expect(DBBlock.decode).toHaveBeenCalledTimes(3)
    }))
})

describe("Database txSearch/blockSearch tests", () => {
    let database: Database
    beforeEach(() => {
        let i = 1
        const onSpy = jasmine.createSpyObj<{ on: (event: string, f: Function) => any }>("ReadStream", ["on"])
        spyOn(DBBlock, "decode").and.callFake((block: DBBlock) => {
            block.height = i
            block.fileNumber = 0
            block.offset = 0
            const nonce = Long.fromNumber(0, true)
            block.header = new BlockHeader({
                difficulty: 1,
                timeStamp: Date.now() - 10000 + ((i % 2 === 0) ? i * i : -(i * i)),
                merkleRoot: new Hash("Merkle Hash"),
                previousHash: [new Hash("Previous Hash")],
                nonce,
                stateRoot: new Hash("State Hash"),
            })
            i++
            block.length = 10
            return block
        })
        spyOn(DBTx, "decode").and.callFake((dbTx: DBTx) => {
            dbTx.blockHash = new Hash()
            dbTx.blockHeight = 0
            dbTx.hash = new Hash()
            dbTx.txNumber = 1
            return dbTx
        })
        database = new Database("dbpath", "filepath")
    })

    it("txSearch(address, add, errorHandler?) : should call slowSearch and return mapping", testAsync(async () => {
        const address = randomBytes(20)
        const encodeSpy = spyOn(Base58, "encode").and.returnValue("TestHashString")
        const slowSpy = spyOn(database, "slowSearch").and.returnValue([new DBTx({ hash: randomBytes(32), blockHash: randomBytes(32), txNumber: 0, blockHeight: 1 })])
        const reverseSpy = spyOn(Array.prototype, "reverse")
        const stx = new SignedTx()
        stx.to = address
        const getTxTimeSpy = spyOn(database, "getTxTime").and.returnValue({ tx: stx, timeStamp: 1 })
        let results: { dbTxs: DBTx[], map: Map<string, { tx: (SignedTx | GenesisSignedTx), timeStamp: number }> } = { dbTxs: [], map: new Map<string, { tx: (SignedTx | GenesisSignedTx), timeStamp: number }>() }
        try { results = await database.txSearch(address, (data: DBTx, datas: DBTx[]) => { }) } catch (e) { }
        expect(results.dbTxs.length).toBe(1)
        expect(slowSpy).toHaveBeenCalledBefore(encodeSpy)
        expect(reverseSpy).toHaveBeenCalledBefore(getTxTimeSpy)
    }))
})

describe("Database getAllHeaders tests", () => {
    let database: Database
    let dataFunction: Function
    let endFunction: Function
    const data = [{ key: new Buffer("babc"), value: new DBBlock({}) }, { key: new Buffer("bbcd"), value: new DBBlock({}) }, { key: new Buffer("bcde"), value: new DBBlock({}) }]
    beforeEach(() => {
        const onSpy = jasmine.createSpyObj<{ on: (event: string, f: Function) => any }>("ReadStream", ["on"])
        onSpy.on.and.callFake((event: string, f: Function) => {
            switch (event) {
                case "data":
                    dataFunction = f
                    break
                case "end":
                    endFunction = f
                    break
            }
            return onSpy
        })
        database = new Database("dbpath", "filepath")
    })
})

describe("Database getTxsOfAddress tests", () => {
    let database: Database
    let dataFunction: Function
    let endFunction: Function
    const data = [
        { key: new Buffer("tabc"), value: new DBBlock({}) },
        { key: new Buffer("tbcd"), value: new DBBlock({}) },
        { key: new Buffer("tcde"), value: new DBBlock({}) },
    ]
    beforeEach(() => {
        let i = 1
        const onSpy = jasmine.createSpyObj<{ on: (event: string, f: Function) => any }>("ReadStream", ["on"])
        spyOn(DBTx, "decode").and.callFake((dbTx: DBTx) => {
            dbTx.blockHash = new Hash()
            dbTx.blockHeight = i
            dbTx.hash = new Hash()
            dbTx.txNumber = i
            i++
            return dbTx
        })
        onSpy.on.and.callFake((event: string, f: Function) => {
            switch (event) {
                case "data":
                    dataFunction = f
                    break
                case "end":
                    endFunction = f
                    break
            }
            return onSpy
        })

        database = new Database("dbpath", "filepath")
    })

    it("getTxsOfAddress(address, n): should call txSearch", testAsync(async () => {
        const txSearchSpy = spyOn(database, "txSearch").and.callFake(() => {
            return { dbTxs: [new DBTx({ blockHash: new Hash(), blockHeight: 0, hash: new Hash(), txNumber: 0 })], map: new Map<string, { tx: (SignedTx | GenesisSignedTx), timeStamp: number }>() }
        })
        let results: { dbTxs: DBTx[], map: Map<string, { tx: (SignedTx | GenesisSignedTx), timeStamp: number }> } = { dbTxs: [], map: new Map<string, { tx: (SignedTx | GenesisSignedTx), timeStamp: number }>() }
        try { results = await database.getTxsOfAddress(new Uint8Array(0), 1) } catch (e) { }
        expect(results.dbTxs.length).toBe(1)
    }))
})
