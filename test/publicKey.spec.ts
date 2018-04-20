import * as fs from "fs"
import * as proto from "../src/serialization/proto"

import { randomBytes } from "crypto"
import { Address } from "../src/common/address"
import { PrivateKey } from "../src/common/privateKey"
import { PublicKey } from "../src/common/publicKey"
import { SignedTx } from "../src/common/txSigned"
import { Hash } from "../src/util/hash"
import { Wallet } from "../src/wallet/wallet"

import * as blake2b from "blake2b"
import secp256k1 = require("secp256k1")

describe("PublicKey", () => {
    let pubKey: PublicKey
    let pubKey2: PublicKey
    let privKey: PrivateKey
    let tx: SignedTx
    let wallet: Wallet
    let txCreate: any
    let wFunc: any

    beforeEach(() => {
        const x = new Address(randomBytes(32))
        tx = new SignedTx({
            from: x, to: x,
            amount: 10000, fee: 100, nonce: 1234,
            signature: randomBytes(32), recovery: 10,
        })
        pubKey = new PublicKey(randomBytes(32))
        spyOn(tx, "unsignedHash").and.returnValue(new Hash(randomBytes(32)))
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
