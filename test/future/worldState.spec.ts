import * as Base58 from "base-58"
import { randomBytes } from "crypto"
import { } from "jasmine"
import * as levelup from "levelup"
import * as Long from "long"
import rocksdb = require("rocksdb")
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { BlockHeader } from "../src/common/blockHeader"
import { GenesisBlockHeader } from "../src/common/genesisHeader"
import { GenesisSignedTx } from "../src/common/txGenesisSigned"
import { SignedTx } from "../src/common/txSigned"
import { Account } from "../src/consensus/database/account"
import { BlockFile } from "../src/consensus/database/blockFile"
import { Database } from "../src/consensus/database/database"
import { DBBlock } from "../src/consensus/database/dbblock"
import { DBState } from "../src/consensus/database/dbState"
import { NodeRef } from "../src/consensus/database/nodeRef"
import { StateNode } from "../src/consensus/database/stateNode"
import { WorldState } from "../src/consensus/database/worldState"
import * as proto from "../src/serialization/proto"
import { FileUtil } from "../src/util/fileUtil"
import { Hash } from "../src/util/hash"
import { testAsync } from "./async"

describe("worldState", () => {
    let account: Account
    let stateNode: StateNode
    let genesis: GenesisBlock
    let address: Address
    let dummy: string
    let levelUpSpy: jasmine.SpyObj<levelup.LevelUpBase<levelup.Batch>>
    beforeEach(() => {
        levelUpSpy = jasmine.createSpyObj<levelup.LevelUp>("levelUp", ["del", "put", "get", "batch", "createReadStream"])
        stateNode = new StateNode({
            nodeRefs: [],
        })
        genesis = new GenesisBlock({
            header: GenesisBlockHeader(),
            txs: [
                { to: randomBytes(20), amount: 100, signature: randomBytes(32), recovery: 1 },
                { to: randomBytes(20), amount: 1000, signature: randomBytes(32), recovery: 1 },
            ],
        })
        account = new Account({ balance: 999, nonce: 111 })
        address = new Address(new Uint8Array([1, 2, 3]))
        dummy = "dummy_str_1234567890!@#$%^&*()"
    })

    it("putPending(pending, mapAccount) : should increase refCount of child of pendingList", testAsync(async () => {
        levelUpSpy.get.and.returnValue(Promise.resolve(randomBytes(32)))
        levelUpSpy.batch.and.returnValue(Promise.resolve(undefined))
        stateNode.nodeRefs.push(new NodeRef({ address: randomBytes(5), child: new Hash("childHash") }))
        const dbState = new DBState({ node: stateNode, refCount: 1 })
        const childState = new DBState({ account, refCount: 1 })
        const decodeSpy = spyOn(DBState, "decode").and.returnValue(childState)
        const stateHashSpy = spyOn(DBState.prototype, "hash").and.returnValue(new Hash())
        const toBufferSpy = spyOn(Hash.prototype, "toBuffer").and.returnValue(new Buffer(1))
        const pending: DBState[] = []
        pending.push(dbState)
        const map: Map<string, DBState> = new Map<string, DBState>()
        map.set((new Hash(stateNode)).toString(), dbState)
        const ws = new WorldState("path")

        try { await ws.putPending(pending, map) } catch (e) { Promise.reject(e) }

        expect(pending.length).toBe(2)
        expect(levelUpSpy.get).toHaveBeenCalledTimes(1)
        expect(levelUpSpy.batch).toHaveBeenCalledTimes(1)
        expect(decodeSpy).toHaveBeenCalledBefore(levelUpSpy.batch)
    }))

    it("first(genesis) : should firstly open a new worldState.", testAsync(async () => {
        const ws = new WorldState("path")
        const verifySpy = spyOn(GenesisSignedTx.prototype, "verify").and.returnValue(true)
        try { await ws.first(genesis) } catch (e) { Promise.reject(e) }
        expect(verifySpy).toHaveBeenCalledTimes(2)
    }))

    it("first(genesis) : when tx is not verified, just keep going.", testAsync(async () => {
        const ws = new WorldState("path")
        const verifySpy = spyOn(GenesisSignedTx.prototype, "verify").and.returnValue(false)
        try { await ws.first(genesis) } catch (e) { Promise.reject(e) }
        expect(verifySpy).toHaveBeenCalledTimes(2)
    }))

    it("getAccount(stateRootHash, address) : should return account", testAsync(async () => {
        const ws = new WorldState("path")
        stateNode.nodeRefs.push(new NodeRef({ address: randomBytes(20), child: new Hash() }))
        let result: (Account | undefined)
        try { result = await ws.getAccount(new Hash(dummy), new Address(stateNode.nodeRefs[0].address)) } catch (e) { Promise.reject(e) }
        expect(result).not.toBeUndefined()
    }))

    it("getAccount(stateRootHash, address) : When there are not any matched return undefined.", testAsync(async () => {
        const ws = new WorldState("path")
        stateNode.nodeRefs.push(new NodeRef({ address: randomBytes(20), child: new Hash() }))
        let result: (Account | undefined)
        const targetAddress = new Address(stateNode.nodeRefs[0].address)
        targetAddress[0] += 1
        try { result = await ws.getAccount(new Hash(dummy), targetAddress) } catch (e) { Promise.reject(e) }
        expect(result).toBeUndefined()
    }))

    it("next(block, previousState) : should calculates the state after the block has been processed(account exited in levelDB)", testAsync(async () => {
        const fromAccount = new Account({ balance: 100000, nonce: 1 })
        const toAccount = new Account({ balance: 0, nonce: 0 })
        const minerAccount = new Account({ balance: 0, nonce: 0 })
        const blockHeader = new BlockHeader({ merkleRoot: new Hash(), timeStamp: Date.now(), difficulty: 1234, stateRoot: new Hash(), previousHash: [new Hash("previousHash")], nonce: 2 })
        const txs = [
            new SignedTx({ from: (new Uint8Array(20)).fill(1), to: (new Uint8Array(20)).fill(2), amount: 100, fee: 10, nonce: 2, signature: randomBytes(32), recovery: 0 }),
        ]
        const block = new Block({ header: blockHeader, txs, miner: new Address((new Uint8Array(20)).fill(3)) })

        const ws = new WorldState("path")
        let i = 0
        const getAccountSpy = spyOn(ws, "getAccount").and.callFake(() => {
            if (i === 0) {
                i++
                return fromAccount
            } else if (i === 1) {
                i++
                return toAccount
            } else {
                return minerAccount
            }
        })
        const mapGetSpy = spyOn(Map.prototype, "get").and.callThrough()
        let result: { currentStateRoot: Hash, batch: DBState[], mapAccount: Map<string, DBState> }
        try { result = await ws.next(block, new Hash("previousState")) } catch (e) { Promise.reject(e) }
        expect(getAccountSpy).toHaveBeenCalledTimes(3)
        expect(mapGetSpy).toHaveBeenCalledTimes(3)
    }))

    it("next(block, previousState) : should calculates the state after the block has been processed(account not exited in levelDB)", testAsync(async () => {
        const blockHeader = new BlockHeader({ merkleRoot: new Hash(), timeStamp: Date.now(), difficulty: 1234, stateRoot: new Hash(), previousHash: [new Hash("previousHash")], nonce: 2 })
        const txs = [
            new SignedTx({ from: (new Uint8Array(20)).fill(1), to: (new Uint8Array(20)).fill(2), amount: 100, fee: 10, nonce: 1, signature: randomBytes(32), recovery: 0 }),
        ]
        const block = new Block({ header: blockHeader, txs, miner: new Address((new Uint8Array(20)).fill(3)) })
        const ws = new WorldState("path")
        const getAccountSpy = spyOn(ws, "getAccount").and.returnValue(undefined)
        const index = 0
        let result: { currentStateRoot: Hash, batch: DBState[], mapAccount: Map<string, DBState> }
        try { result = await ws.next(block, new Hash("previousState")) } catch (e) { Promise.reject(e) }
        expect(getAccountSpy).toHaveBeenCalledTimes(3)
    }))

    it("next(block, previousState) : should calculates the state after the block has been processed(account already exsited in map)", testAsync(async () => {
        const fromAccount = new Account({ balance: 100000, nonce: 1 })
        const toAccount = new Account({ balance: 0, nonce: 0 })
        const minerAccount = new Account({ balance: 0, nonce: 0 })
        const blockHeader = new BlockHeader({ merkleRoot: new Hash(), timeStamp: Date.now(), difficulty: 1234, stateRoot: new Hash(), previousHash: [new Hash("previousHash")], nonce: 2 })
        const txs = [
            new SignedTx({ from: (new Uint8Array(20)).fill(1), to: (new Uint8Array(20)).fill(2), amount: 100, fee: 10, nonce: 2, signature: randomBytes(32), recovery: 0 }),
            new SignedTx({ from: (new Uint8Array(20)).fill(1), to: (new Uint8Array(20)).fill(2), amount: 10, fee: 10, nonce: 3, signature: randomBytes(32), recovery: 0 }),
        ]
        const block = new Block({ header: blockHeader, txs, miner: new Address((new Uint8Array(20)).fill(3)) })
        const ws = new WorldState("path")
        const getAccountSpy = spyOn(ws, "getAccount").and.callFake(() => {
            if (i === 0) {
                i++
                return fromAccount
            } else if (i === 1) {
                i++
                return toAccount
            } else {
                return minerAccount
            }
        })
        let i = 0
        let result: { currentStateRoot: Hash, batch: DBState[], mapAccount: Map<string, DBState> }
        try { result = await ws.next(block, new Hash("previousState")) } catch (e) { Promise.reject(e) }
        expect(getAccountSpy).toHaveBeenCalledTimes(3)
    }))
})
