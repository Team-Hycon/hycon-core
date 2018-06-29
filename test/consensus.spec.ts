import { randomBytes } from "crypto"
import Long = require("long")
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { DelayQueue } from "../src/common/delayQueue"
import { ITxPool } from "../src/common/itxPool"
import { Consensus } from "../src/consensus/consensus"
import { Database } from "../src/consensus/database/database"
import { ITxDatabase } from "../src/consensus/database/itxDatabase"
import { MinedDatabase } from "../src/consensus/database/minedDatabase"
import { WorldState } from "../src/consensus/database/worldState"
import { MinerServer } from "../src/miner/minerServer"
import { Server } from "../src/server"
import { testAsync } from "./async"

xdescribe("Consensus", () => {
    let txPool: jasmine.SpyObj<ITxPool> = jasmine.createSpyObj("TxPoolSpy", ["putTxs", "removeTxs"])
    let txdb: jasmine.SpyObj<ITxDatabase> = jasmine.createSpyObj("TxDBSpy", ["init", "putTxs"])
    let minedDatabase: jasmine.SpyObj<MinedDatabase> = jasmine.createSpyObj("MinedDBSpy", ["init", "getMinedBlocks", "putMinedBlock"])
    let futureBlockQueue: jasmine.SpyObj<DelayQueue> = jasmine.createSpyObj("DelayQueue", ["waitUntil"])
    let worldState: jasmine.SpyObj<WorldState> = jasmine.createSpyObj("WorldStateSpy", ["first", "next", "getAccount", "validateTx", "putPending"])
    // let consensus: Consensus
    let dbSpy: jasmine.SpyObj<Database> = jasmine.createSpyObj("Database", ["init"])
    const header = {}
    let genesisBlock
    beforeEach(testAsync(async () => {
        // header = {
        //     difficulty: 0x000000FF,
        //     merkleRoot: randomBytes(32),
        //     nonce: Long.fromNumber(1234, true),
        //     previousHash: [randomBytes(32)],
        //     stateRoot: randomBytes(32),
        //     timeStamp: Date.now(),
        // }
        genesisBlock = new GenesisBlock(new GenesisBlock({
            header: {
                difficulty: 0x000000FF,
                merkleRoot: randomBytes(32),
                nonce: Long.fromNumber(1234, true),
                previousHash: [randomBytes(32)],
                stateRoot: randomBytes(32),
                timeStamp: Date.now(),
            },
            txs: [],
        }))
        dbSpy = jasmine.createSpyObj("Database", ["init", "getBlockTip", "getHeaderTip"])
        worldState = jasmine.createSpyObj("WorldStateSpy", ["first", "next", "getAccount", "validateTx", "putPending"])
        txPool = jasmine.createSpyObj("TxPoolSpy", ["putTxs", "removeTxs"])
        txdb = jasmine.createSpyObj("TxDBSpy", ["init", "putTxs"])
        minedDatabase = jasmine.createSpyObj("MinedDBSpy", ["init", "getMinedBlocks", "putMinedBlock"])
        futureBlockQueue = jasmine.createSpyObj("DelayQueue", ["waitUntil"])

        dbSpy.getBlockTip.and.returnValue(genesisBlock)
        dbSpy.getHeaderTip.and.returnValue(genesisBlock)

        // consensus = new Consensus(txPool, worldState, "garbage", "garbage")
        // // Dirty trick to prevent an actual DB from forming
        // // tslint:disable:no-string-literal
        // consensus["db"] = dbSpy
        // consensus["txdb"] = txdb
        // consensus["minedDatabase"] = minedDatabase
        // // await consensus.init()
    }))
})
