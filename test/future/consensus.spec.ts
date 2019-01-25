import { randomBytes } from "crypto"
import Long = require("long")
import { GenesisBlock } from "../src/common/blockGenesis"
import { DelayQueue } from "../src/common/delayQueue"
import { TxPool } from "../src/common/txPool"
import { Database } from "../src/consensus/database/database"
import { MinedDatabase } from "../src/consensus/database/minedDatabase"
import { TxDatabase } from "../src/consensus/database/txDatabase"
import { WorldState } from "../src/consensus/database/worldState"
import { testAsync } from "./async"

xdescribe("Consensus", () => {
    let txPool: jasmine.SpyObj<TxPool> = jasmine.createSpyObj("TxPoolSpy", ["putTxs", "removeTxs"])
    let txdb: jasmine.SpyObj<TxDatabase> = jasmine.createSpyObj("TxDBSpy", ["init", "putTxs"])
    let minedDatabase: jasmine.SpyObj<MinedDatabase> = jasmine.createSpyObj("MinedDBSpy", ["init", "getMinedBlocks", "putMinedBlock"])
    let futureBlockQueue: jasmine.SpyObj<DelayQueue> = jasmine.createSpyObj("DelayQueue", ["waitUntil"])
    let worldState: jasmine.SpyObj<WorldState> = jasmine.createSpyObj("WorldStateSpy", ["first", "next", "getAccount", "validateTx", "putPending"])
    // let consensus: Consensus
    let dbSpy: jasmine.SpyObj<Database> = jasmine.createSpyObj("Database", ["init"])

    let genesisBlock
    beforeEach(testAsync(async () => {
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
    }))
})
