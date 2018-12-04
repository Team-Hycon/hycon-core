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
        tx = new SignedTx(protoTx)
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
        function undefFrom() { return new SignedTx({ amount: 4444, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefAmt() { return new SignedTx({ fee: 333, from: addr1, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefFee() { return new SignedTx({ amount: 4444, from: addr1, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function undefNonce() { return new SignedTx({ amount: 4444, fee: 333, from: addr1, recovery: 1, signature: sign1, to: addr2 }) }
        function undefSign() { return new SignedTx({ amount: 4444, fee: 333, from: addr1, nonce: 22, recovery: 1, to: addr2 }) }
        function undefRecover() { return new SignedTx({ amount: 4444, fee: 333, from: addr1, nonce: 22, signature: sign1, to: addr2 }) }
        expect(undefFrom).toThrowError()
        expect(undefAmt).toThrowError()
        expect(undefFee).toThrowError()
        expect(undefNonce).toThrowError()
        expect(undefSign).toThrowError()
        expect(undefRecover).toThrowError()

        // when amount or fee is negative
        function negAmt() { return new SignedTx({ amount: Long.fromNumber(-4444, false), from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function negFee() { return new SignedTx({ amount: 4444, from: addr1, fee: Long.fromNumber(-333, false), nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        expect(negAmt).toThrowError()
        expect(negFee).toThrowError()

        // when amount or fee is signed Long
        function unsignAmt() { return new SignedTx({ amount: Long.fromNumber(333, false), from: addr1, fee: 333, nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        function unsignFee() { return new SignedTx({ amount: 55555, from: addr1, fee: Long.fromNumber(22, false), nonce: 22, recovery: 1, signature: sign1, to: addr2 }) }
        expect(unsignAmt).toThrowError()
        expect(unsignFee).toThrowError()
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        tx = new SignedTx(protoTx)
        tx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
