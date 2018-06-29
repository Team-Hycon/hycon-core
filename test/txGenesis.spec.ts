import { randomBytes } from "crypto"
import { getLogger } from "log4js"
import * as Long from "long"
import { Address } from "../src/common/address"
import { GenesisTx } from "../src/common/txGenesis"
import * as proto from "../src/serialization/proto"

const logger = getLogger("GenesisTx")

describe("GenesisTx", () => {
    let addr1: Address
    let addr2: Address
    let tx: GenesisTx
    let protoGenTx: proto.ITx

    beforeEach(() => {
        addr1 = new Address(randomBytes(20))
        addr2 = new Address(randomBytes(20))
        protoGenTx = { amount: 4444, to: addr1 }
    })

    it("constructor() : call set method when tx parameter not undefined", () => {
        const setSpy = spyOn(GenesisTx.prototype, "set")
        tx = new GenesisTx(protoGenTx)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set() : method should set property using parameter.", () => {
        tx = new GenesisTx()
        tx.set(protoGenTx)
        expect(tx.amount).not.toBeUndefined()

        protoGenTx.amount = Long.fromNumber(4444, true)
        tx.set(protoGenTx)
        expect(tx.amount).not.toBeUndefined()
    })

    it("set() : Exception - when parameter is undefined / when amount is signed Long", () => {
        tx = new GenesisTx()

        // When parameter is undefined
        function undefTo() { return tx.set({ amount: 4444 }) }
        function undefAmt() { return tx.set({ to: addr1 }) }
        expect(undefTo).toThrowError()
        expect(undefAmt).toThrowError()

        // When amount is signed Long
        function unsignAmt() { return tx.set({ amount: Long.fromNumber(4444, false), to: addr2 }) }
        expect(unsignAmt).toThrowError()
    })

    it("equals() : Should return true or false if two GenesisTxs are equal or not", () => {
        tx = new GenesisTx(protoGenTx)
        expect(tx.equals(tx)).toBeTruthy()

        const tx1 = new GenesisTx({ amount: 4444, to: addr2 })
        const tx2 = new GenesisTx({ amount: 333, to: addr1 })
        expect(tx.equals(tx1)).toBeFalsy()
        expect(tx.equals(tx2)).toBeFalsy()
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        tx = new GenesisTx()
        tx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
