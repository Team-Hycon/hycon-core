import { hyconfromString } from "@glosfer/hyconjs-util"
import { randomBytes } from "crypto"
import { } from "jasmine"
import secp256k1 = require("secp256k1")
import { Address } from "../src/common/address"
import { PrivateKey } from "../src/common/privateKey"
import { PublicKey } from "../src/common/publicKey"
import { Tx } from "../src/common/tx"
import { SignedTx } from "../src/common/txSigned"
process.env.NODE_ENV = "test"
describe("PrivateKey", () => {
    const buffer = randomBytes(32)
    const privKey1 = new PrivateKey()
    const privKey2 = new PrivateKey(buffer)
    let tx: Tx
    beforeEach(() => {
        tx = new Tx({
            amount: hyconfromString("10000"), fee: hyconfromString("100"),
            from: new Address(randomBytes(20)), nonce: 1234,
            recovery: 10,
            signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })
    })

    it("privateKey: Should throw an exception", () => {
        expect(() => { const err = new PrivateKey(randomBytes(20)) }).toThrowError()
    })

    it("privateKey.toHexString: Should return a string representation of the private key", () => {
        const keyString = privKey2.toHexString()
        const hexString = buffer.toString("hex")
        expect(keyString.length).toEqual(64)
        expect(keyString).toEqual(hexString)
    })

    it("privateKey.sign: Should return the transaction", () => {
        const sigSpy = spyOn(secp256k1, "sign").and.returnValue(new Uint8Array(32))
        spyOn(SignedTx.prototype, "set")
        const signedTx = privKey1.sign(tx)
        expect(sigSpy).toHaveBeenCalled()
        expect(signedTx instanceof SignedTx).toBe(true)
    })

    it("privateKey.publicKey: Should return a public key that represents the private key", () => {
        const pubKey1 = privKey2.publicKey()
        const pubKey2 = new PublicKey(secp256k1.publicKeyCreate(buffer))
        expect(pubKey1).toEqual(pubKey2)
    })
})
