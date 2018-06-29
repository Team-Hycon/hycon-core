import { randomBytes } from "crypto"
import * as Long from "long"
import * as Secp from "secp256k1"
import { Address } from "../src/common/address"
import { PublicKey } from "../src/common/publicKey"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"

const secp256k1 = Secp

describe("SignedTx", () => {
    let addr1: Address
    let addr2: Address
    let sign1: Uint8Array
    let sign2: Uint8Array
    let tx: SignedTx
    let protoTx: proto.ITx

    beforeEach(() => {
        addr1 = new Address(randomBytes(20))
        addr2 = new Address(randomBytes(20))
        sign1 = randomBytes(32)
        sign2 = randomBytes(32)
        protoTx = {
            amount: 4444,
            fee: 333,
            from: addr1,
            nonce: 22,
            recovery: 1,
            signature: sign1,
            to: addr2,
        }
    })

    it("decode(data) : should decode Uint89Array data and return new SignedTx object", () => {
        const setSpy = spyOn(SignedTx.prototype, "set")
        const decodeSpy = spyOn(proto.Tx, "decode").and.returnValue(protoTx)
        SignedTx.decode(randomBytes(32))
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy)
    })

    it("constructor(tx, signature, recovery) : should set property using parameters", () => {
        const stx = new SignedTx({ amount: 4444, fee: 333, from: addr1, nonce: 22, to: addr2 }, sign1, 1)
        expect(stx.signature.toString()).toBe(sign1.toString())
        expect(stx.recovery).toBe(1)
    })

    it("constructor(tx, signature, recovery) : Exception - when two (signatures | recoverys) info exists", () => {
        function twoSigns() { protoTx.recovery = undefined; return new SignedTx(protoTx, sign1, 1) }
        function twoRecovers() { protoTx.signature = undefined; protoTx.recovery = 1; return new SignedTx(protoTx, sign1, 1) }
        expect(twoSigns).toThrowError()
        expect(twoRecovers).toThrowError()
    })

    it("set(tx) : method should set property using parameter", () => {
        tx = new SignedTx()
        tx.set(protoTx)
        expect(tx.from).not.toBeUndefined()
        expect(tx.amount).not.toBeUndefined()
        expect(tx.fee).not.toBeUndefined()
        expect(tx.nonce).not.toBeUndefined()
        expect(tx.signature).not.toBeUndefined()
        expect(tx.recovery).not.toBeUndefined()

        protoTx.amount = Long.fromNumber(4444, true)
        protoTx.fee = Long.fromNumber(333, true)
        tx.set(protoTx)
        expect(tx.amount).not.toBeUndefined()
        expect(tx.fee).not.toBeUndefined()
    })

    it("set(tx) Exception - when parameter is undefined / when (amount | fee) is (negative | signed Long)", () => {
        tx = new SignedTx()

        // When parameter is undefined
        function undefFrom() { return tx.set({ amount: 4444, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefAmt() { return tx.set({ fee: 333, from: addr1, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefFee() { return tx.set({ amount: 4444, from: addr1, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefNonce() { return tx.set({ amount: 4444, fee: 333, from: addr1, recovery: 1, signature: sign1, to: addr2 }) }
        function undefSign() { return tx.set({ amount: 4444, fee: 333, from: addr1, nonce: 22, recovery: 1, to: addr2 }) }
        function undefRecover() { return tx.set({ amount: 4444, fee: 333, from: addr1, nonce: 22, signature: sign1, to: addr2 }) }
        expect(undefFrom).toThrowError()
        expect(undefAmt).toThrowError()
        expect(undefFee).toThrowError()
        expect(undefNonce).toThrowError()
        expect(undefSign).toThrowError()
        expect(undefRecover).toThrowError()

        // when amount or fee is negative
        function negAmt() { return tx.set({ amount: Long.fromNumber(-4444, false), from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function negFee() { return tx.set({ amount: 4444, from: addr1, fee: Long.fromNumber(-333, false), nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        expect(negAmt).toThrowError()
        expect(negFee).toThrowError()

        // when amount or fee is signed Long
        function unsignAmt() { return tx.set({ amount: Long.fromNumber(333, false), from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function unsignFee() { return tx.set({ amount: 55555, from: addr1, fee: Long.fromNumber(22, false), nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        expect(unsignAmt).toThrowError()
        expect(unsignFee).toThrowError()
    })

    it("equals(tx) : Should return true or false if two SignedTxs are equal or not", () => {
        tx = new SignedTx(protoTx)
        expect(tx.equals(tx)).toBeTruthy()

        const tx1 = new SignedTx({ amount: 55555, from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 })
        const tx2 = new SignedTx({ amount: 4444, from: addr1, fee: 22, nonce: 22, recovery: 1, signature: sign1, to: addr2 })
        const tx3 = new SignedTx({ amount: 4444, from: addr1, fee: 333, nonce: 1, recovery: 1, signature: sign1, to: addr2 })
        const tx4 = new SignedTx({ amount: 4444, from: addr1, fee: 333, nonce: 22, recovery: 22, signature: sign1, to: addr2 })
        const tx5 = new SignedTx({ amount: 4444, from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr1 })
        const tx6 = new SignedTx({ amount: 4444, from: addr2, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 })
        const tx7 = new SignedTx({ amount: 4444, from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign2, to: addr2 })
        expect(tx.equals(tx1)).toBeFalsy()
        expect(tx.equals(tx2)).toBeFalsy()
        expect(tx.equals(tx3)).toBeFalsy()
        expect(tx.equals(tx4)).toBeFalsy()
        expect(tx.equals(tx5)).toBeFalsy()
        expect(tx.equals(tx6)).toBeFalsy()
        expect(tx.equals(tx7)).toBeFalsy()

        protoTx.to = undefined
        tx = new SignedTx(protoTx)
        const tx8 = new SignedTx({ amount: 4444, from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 })
        expect(tx.equals(tx8)).toBeFalsy()
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        tx = new SignedTx()
        tx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })

    it("verify(): should call secp256k1, verify method when tx is valid", () => {
        const secpSpy = spyOn(secp256k1, "recover").and.returnValue(Buffer)
        const verifySpy = spyOn(PublicKey.prototype, "verify")
        tx = new SignedTx(protoTx)
        tx.verify()
        expect(secpSpy).toHaveBeenCalledBefore(verifySpy)
        expect(verifySpy).toHaveBeenCalled()
    })

    it("verify(): Exception - when tx is invalid", () => {
        protoTx.signature = randomBytes(10)
        tx = new SignedTx(protoTx)
        const res = tx.verify()
        expect(res).toBeFalsy()
    })
})
