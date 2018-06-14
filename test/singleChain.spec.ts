import { randomBytes } from "crypto"
import Long = require("long")
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { ITxPool } from "../src/common/itxPool"
import { Consensus } from "../src/consensus/consensus"
import { Database } from "../src/consensus/database/database"
import { WorldState } from "../src/consensus/database/worldState"
import { IConsensus } from "../src/consensus/iconsensus"
import { MinerServer } from "../src/miner/minerServer"
import { Server } from "../src/server"

xdescribe("SingleChain", () => {
/*    let serverSpy: jasmine.SpyObj<Server> = jasmine.createSpyObj("Server", ["run"])
    const txPool: jasmine.SpyObj<ITxPool> = jasmine.createSpyObj("TxPoolSpy", [])
    const worldState: jasmine.SpyObj<WorldState> = jasmine.createSpyObj("WorldStateSpy", [])
    let consensus: Consensus
    let dbSpy: jasmine.SpyObj<Database> = jasmine.createSpyObj("Database", ["init"])
    let header = {}

    beforeEach((() => {
        header = {
            difficulty: 0x000000FF,
            merkleRoot: randomBytes(32),
            nonce: Long.fromNumber(1234, true),
            previousHash: [randomBytes(32)],
            stateRoot: randomBytes(32),
            timeStamp: Date.now(),
        }
        serverSpy = jasmine.createSpyObj("Server", ["run"])
        dbSpy = jasmine.createSpyObj("Database", ["init", "getBlockTip", "getHeaderTip"])

        dbSpy.getBlockTip.and.callFake(() => {
            const genesisBlock = new GenesisBlock(header)
            return genesisBlock
        })
        dbSpy.getHeaderTip.and.callFake(() => {

        })
        consensus = new Consensus(txPool, worldState, "./garbage", "./garbage")
        // Dirty trick to prevent an actual DB from forming
        // tslint:disable-next-line:no-string-literal
        consensus["db"] = dbSpy
        consensus.init()

    }))
    */
    xit("getNonce: should get the nonce", () => {

    })

    it("init: should initialize", () => {
    //   expect(dbSpy.init).toHaveBeenCalled()
    })

    xit("putBlock: should put a block into the database", () => {

    })

    xit("putHeader: should put a header into the database", () => {

    })

    xit("addCallbackNewBlock: should add a callback for a new block", () => {

    })

    xit("removeCallbackNewBlock: should remove a callback for a new block", () => {

    })

    xit("getBlockByHash: should get a block by its given hash", () => {

    })

    xit("getHeaderByHash: should get a block header by a given block hash", () => {

    })

    xit("getBlocksRange: should get blocks in the specified range", () => {

    })

    xit("getAccount: should get the specified account", () => {

    })

    xit("getLastTxs: should get the last transactions", () => {

    })

    xit("getBlockStatus: should get the status of the given block", () => {

    })

    xit("getHeaderTip: should get the header tip", () => {

    })

    xit("getBlocksTip: should get the blocks tip", () => {

    })

    xit("isTxValid: should verify the transaction", () => {

    })

    xit("getTx: should get the transaction", () => {

    })

    xit("getHash: should get the hash", () => {

    })

    xit("getBlockHeight: should get the block height", () => {

    })

    xit("testMakeBlock: should create a new candidate block", () => {

    })

})
