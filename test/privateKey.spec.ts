import { randomBytes } from "crypto"
import * as fs from "fs"
import { } from "jasmine"
import secp256k1 = require("secp256k1")
import { hyconfromString } from "../src/api/client/stringUtil"
import { Address } from "../src/common/address"
import { PrivateKey } from "../src/common/privateKey"
import { Tx } from "../src/common/tx"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"
import { Wallet } from "../src/wallet/wallet"

describe("PrivateKey", () => {
    let privKey: PrivateKey
    let tx: Tx
    beforeEach(() => {
        tx = new Tx({
            amount: hyconfromString("10000"), fee: hyconfromString("100"),
            from: new Address(randomBytes(20)), nonce: 1234,
            recovery: 10,
            signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })
        privKey = new PrivateKey(randomBytes(32))
    })

    it("privateKey.sign: Should return the transaction", () => {
        // TODO: Fix
        const sigSpy = spyOn(secp256k1, "sign").and.returnValue(new Uint8Array(32))
        spyOn(SignedTx.prototype, "set")
        privKey.sign(tx)
        expect(sigSpy).toHaveBeenCalled()
    })

    it("privateKey.toHexString: Should return a string representation of the private key", () => {
        // TODO: Generate a keystring to check against and compare it here
        const keyString = privKey.toHexString()
        expect(keyString).toBeDefined()
        expect(false).toBe(true) // Remove once the check is implemented
    })

    it("privateKey.publicKey: Should return a public key that represents the private key", () => {
        // TODO: Generate a public key to check against and compare it here
        const pubKey = privKey.publicKey()
        expect(pubKey).toBeDefined()
        expect(false).toBe(true) // Remove once the check is implemented
    })
})
