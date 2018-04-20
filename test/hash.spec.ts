import * as Base58 from "base-58"
import * as blake2b from "blake2b"
import { randomBytes } from "crypto"
import { } from "jasmine"
import Long = require("long")
import { Address } from "../src/common/address"
import { Tx } from "../src/common/tx"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

describe("Hash", () => {
    const addSpyObj: jasmine.SpyObj<Address> = jasmine.createSpyObj("address", ["encode"])
    beforeEach(() => {

    })

    it("new Hash: Should create two different hash for Strings", () => {
        const h1: Hash = new Hash("hello")
        const h2: Hash = new Hash("bye")

        const isEqual = h1.equals(h2)
        expect(isEqual).toBe(false)
    })

    // TODO: Block, HeaderBlock, string, Uint8Array, proto.IHash, SignedTx
    it("new Hash(): should call Hash.hash()", () => {
        const tx = new Tx({
            amount: 10000,
            fee: 100,
            from: new Address(randomBytes(20)),
            nonce: 1234,
            recovery: 10,
            signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })
        const encoding = randomBytes(128)
        const hashValue = new Uint8Array(randomBytes(32))
        const hashSpy = spyOn(Hash, "hash").and.returnValue(hashValue)
        const txSpy = spyOn(Tx.prototype, "encode").and.returnValue(encoding)
        const hash: Hash = new Hash(tx)

        expect(Hash.hash).toHaveBeenCalledWith(encoding)
        expect(hash).toEqual(new Hash(hashValue))
    })

    it("new Hash(): Should create two different hash for different txs", () => {
        const tx = new Tx({
            amount: 10000,
            fee: 100,
            from: new Address(randomBytes(20)),
            nonce: 1234,
            recovery: 10,
            signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })

        const h1: Hash = new Hash(tx)
        tx.amount = Long.fromNumber(47, true)
        const h2: Hash = new Hash(tx)

        const isEqual = h1.equals(h2)
        expect(isEqual).toBe(false)
    })
    it("new Hash(): Should set a hash from a uint8 array", () => {
        const arr = new Uint8Array(32)
        const hashSpy = spyOn(Hash, "hash").and.callThrough()
        const hash = new Hash(arr)
        expect(hashSpy).not.toHaveBeenCalled()
        expect(hash).toBeDefined()
        expect(hash.length).toBe(arr.length)
    })
    it("set(): Should set the hash to a given hash value", () => {
        const h1: Hash = new Hash("hello")
        const h2: Hash = new Hash(h1)

        expect(h1.equals(h2)).toBeTruthy()
    })

    it("set(): Should return throw if hash length is not 32", () => {

        function result() {
            const hash = new Hash(new Uint8Array([0]))
        }

        expect(result).toThrowError()
    })

    it("hashCryptonight(ob) : return Uint8Array that hashed using cryptoNight", () => {

    })

    it("decode(string) : decode string using Base58", () => {
        spyOn(Base58, "decode").and.returnValue(new Buffer(32))
        Hash.decode("hashString")
        expect(Base58.decode).toHaveBeenCalled()
    })

    it("equals(other) : return compare result", () => {
        const random = randomBytes(32)
        const hash1 = new Hash(random)
        random[0] += 1
        const hash2 = new Hash(random)
        const result1 = hash1.equals(hash2)
        const result2 = hash2.equals(new Hash(random))
        expect(result1).toBeFalsy()
        expect(result2).toBeTruthy()
    })
})
