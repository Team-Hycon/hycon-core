import * as fs from "fs"
import * as proto from "../src/serialization/proto"

import { randomBytes } from "crypto"
import { Address } from "../src/common/address"
import { PrivateKey } from "../src/common/privateKey"
import { PublicKey } from "../src/common/publicKey"
import { SignedTx } from "../src/common/txSigned"
import { Hash } from "../src/util/hash"

import * as blake2b from "blake2b"
import secp256k1 = require("secp256k1")

describe("PublicKey", () => {
    let pubKey: PublicKey
    let pubKey2: PublicKey
    let tx: SignedTx

    beforeEach(() => {
        const x = new Address(randomBytes(20))
        tx = new SignedTx({
            amount: 10000,
            fee: 100,
            from: x,
            nonce: 1234,
            recovery: 10,
            signature: randomBytes(32),
            to: x,
        })
        pubKey = new PublicKey(randomBytes(32))
        spyOn(Hash.prototype, "toBuffer").and.returnValue(new Buffer(32))
        spyOn(secp256k1, "verify").and.returnValue(true)
    })

    it("If call constructor with tx parameters, should call recover function", () => {
        const rSpy = spyOn(secp256k1, "recover").and.returnValue(Buffer)
        pubKey2 = new PublicKey(tx)
        expect(rSpy).toHaveBeenCalled()
    })

    it("Verify method with incorrect tx parameter(from == address)", () => {
        const equalSpy = spyOn(Address.prototype, "equals").and.returnValue(true)
        const result = pubKey.verify(tx)
        expect(secp256k1.verify).toHaveBeenCalled()
        expect(equalSpy).toHaveBeenCalled()
        expect(result).toBeTruthy()
    })

    it("Verify method with incorrect tx parameter(from != address)", () => {
        const equalSpy = spyOn(Address.prototype, "equals").and.returnValue(false)
        const result = pubKey.verify(tx)
        expect(equalSpy).toHaveBeenCalled()
        expect(result).toBeFalsy()
    })

    it("Should return hashed address", () => {
        const hashSpy = spyOn(Hash, "hash").and.returnValue(randomBytes(32))
        pubKey.address()
        expect(hashSpy).toHaveBeenCalled()
    })
})
