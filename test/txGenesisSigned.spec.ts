import { randomBytes } from "crypto"
import * as Long from "long"
import * as Secp from "secp256k1"
import { Address } from "../src/common/address"
import { PublicKey } from "../src/common/publicKey"
import { GenesisSignedTx } from "../src/common/txGenesisSigned"
import * as proto from "../src/serialization/proto"

const secp256k1 = Secp

describe("GenesisSignedTx", () => {
    let addr: Address
    let sign: Uint8Array
    let tx: GenesisSignedTx
    let protoTx: proto.ITx

    beforeEach(() => {
        addr = new Address(randomBytes(20))
        sign = randomBytes(32)
        protoTx = { amount: 22, recovery: 1, signature: sign, to: addr }
    })

    it("decode(data) : should decode Uint89Array data and return new GenesisSignedTx object", () => {
        const setSpy = spyOn(GenesisSignedTx.prototype, "set")
        const decodeSpy = spyOn(proto.Tx, "decode").and.returnValue(protoTx)
        GenesisSignedTx.decode(randomBytes(32))
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy)
    })

    it("constructor(tx, signature, recovery) : should set property using parameters", () => {
        const stx = new GenesisSignedTx({ amount: 22, to: addr }, sign, 1)
        expect(stx.signature.toString()).toBe(sign.toString())
        expect(stx.recovery).toBe(1)
    })

    it("constructor(tx, signature, recovery) : Exception - when two (signatures | recoverys) info exists", () => {
        function twoSigns() { protoTx.recovery = undefined; return new GenesisSignedTx(protoTx, sign, 1) }
        function twoRecovers() { protoTx.signature = undefined; protoTx.recovery = 1; return new GenesisSignedTx(protoTx, sign, 1) }
        expect(twoSigns).toThrowError()
        expect(twoRecovers).toThrowError()
    })

    it("set(tx) : method should set property using parameter", () => {
        tx = new GenesisSignedTx()
        tx.set(protoTx)
        expect(tx.to).not.toBeUndefined()
        expect(tx.amount).not.toBeUndefined()
        expect(tx.signature).not.toBeUndefined()
        expect(tx.recovery).not.toBeUndefined()

        protoTx.amount = Long.fromNumber(22, true)
        tx.set(protoTx)
        expect(tx.amount).not.toBeUndefined()
    })

    it("set(tx) Exception - when parameter is undefined / when amount is (negative | signed Long)", () => {
        tx = new GenesisSignedTx()

        // When parameter is undefined
        function undefTo() { return tx.set({ amount: 22, recovery: 1, signature: sign }) }
        function undefAmt() { return tx.set({ recovery: 1, signature: sign, to: addr }) }
        function undefSign() { return tx.set({ amount: 22, recovery: 1, to: addr }) }
        function undefRecover() { return tx.set({ amount: 22, signature: sign, to: addr }) }
        expect(undefTo).toThrowError()
        expect(undefAmt).toThrowError()
        expect(undefSign).toThrowError()
        expect(undefRecover).toThrowError()

        // when amount is negative
        function negAmt() { return tx.set({ amount: Long.fromNumber(-22, false), recovery: 1, signature: sign, to: addr }) }
        expect(negAmt).toThrowError()

        // when amount is signed Long
        function unsignAmt() { return tx.set({ amount: Long.fromNumber(22, false), recovery: 1, signature: sign, to: addr }) }
        expect(unsignAmt).toThrowError()
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        tx = new GenesisSignedTx()
        tx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })

    it("verify(): should call secp256k1, verify method when tx is valid", () => {
        const secpSpy = spyOn(secp256k1, "recover").and.returnValue(Buffer)
        const verifySpy = spyOn(PublicKey.prototype, "verify")
        tx = new GenesisSignedTx(protoTx)
        tx.verify()
        expect(secpSpy).toHaveBeenCalledBefore(verifySpy)
        expect(verifySpy).toHaveBeenCalled()
    })

    it("verify(): Exception - when tx is invalid", () => {
        protoTx.signature = randomBytes(10)
        tx = new GenesisSignedTx(protoTx)
        const res = tx.verify()
        expect(res).toBeFalsy()
    })
})
