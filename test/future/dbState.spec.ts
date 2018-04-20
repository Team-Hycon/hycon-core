import { randomBytes } from "crypto"
import { } from "jasmine"
import * as Long from "long"
import { Account } from "../src/consensus/database/account"
import { DBState } from "../src/consensus/database/dbState"
import { StateNode } from "../src/consensus/database/stateNode"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

describe("DBState test", () => {
    let dbState: DBState
    let protoAccount: proto.IAccount
    let protoStateNode: proto.IStateNode

    beforeEach(() => {
        protoAccount = {
            balance: 1000, nonce: 0,
        }
        protoStateNode = {
            nodeRefs: [{ address: randomBytes(32), child: randomBytes(32) }],
        }
    })

    it("constructor() : set property when constructor parameter is Account or StateNode", () => {
        dbState = new DBState(new Account(protoAccount))
        const snDBState = new DBState(new StateNode(protoStateNode))
        expect(dbState.account).not.toBeUndefined()
        expect(dbState.node).toBeUndefined()
        expect(dbState.refCount).not.toBeUndefined()
        expect(snDBState.account).toBeUndefined()
        expect(snDBState.node).not.toBeUndefined()
        expect(snDBState.refCount).not.toBeUndefined()
    })

    it("constructor() : call set method when account parameter not undefine", () => {
        const setSpy = spyOn(DBState.prototype, "set")
        dbState = new DBState({})
        expect(setSpy).toHaveBeenCalled()
    })

    it("set() : method should set property using parameter.", () => {
        dbState = new DBState({})
        dbState.set({ account: protoAccount, refCount: 1 })
        expect(dbState.account).not.toBeUndefined()
        expect(dbState.node).toBeUndefined()
        expect(dbState.refCount).toBe(1)
    })

    it("set() : method should throw error when refCount is undefined", () => {
        dbState = new DBState({})
        function result() {
            return dbState.set({})
        }
        expect(result).toThrowError("refCount is missing in dbState")
    })

    it("hash() : return hash of account or stateNode", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Account, "encode").and.returnValue(encoder)
        const hashSpy = spyOn(Hash, "hash")
        dbState = new DBState({})
        dbState.account = new Account(protoAccount)
        dbState.hash()
        expect(hashSpy).toHaveBeenCalled()
        expect(encodeSpy).toHaveBeenCalled()
    })

    it("decode(data) : should decode Uint8Array data and return new StateNode object", () => {
        const setSpy = spyOn(DBState.prototype, "set")
        const decodeSpy = spyOn(proto.DBState, "decode").and.returnValue({ account: protoAccount, refCount: 1 })
        const state = DBState.decode(randomBytes(32))
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy)
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.DBState, "encode").and.returnValue(encoder)
        dbState = new DBState({})
        dbState.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
