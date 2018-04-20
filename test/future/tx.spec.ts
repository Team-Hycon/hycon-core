import { randomBytes } from "crypto"
import * as fs from "fs"
import { } from "jasmine"
import { Address } from "../src/common/address"
import { PublicKey } from "../src/common/publicKey"
import { Tx } from "../src/common/tx"
import { GenesisTx } from "../src/common/txGenesis"
import { GenesisSignedTx } from "../src/common/txGenesisSigned"
import { SignedTx } from "../src/common/txSigned"
import * as proto from "../src/serialization/proto"
import { Hash } from "../src/util/hash"

const secp256k1 = require("secp256k1")

describe("Tx", () => {
    let tx: Tx
    let itx: proto.ITx
    beforeEach(() => {
        itx = new proto.Tx({
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
        })
    })
    it("constructor : If there is parameter, call set method", () => {
        const setSpy = spyOn(Tx.prototype, "set")
        tx = new Tx(itx)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set(tx) : should set Tx information using parameter", () => {
        tx.set(itx)
        expect(tx.fee).toEqual(200)
        expect(tx.amount).toEqual(20000)
        expect(tx.nonce).toEqual(1234)
    })

    it("set(tx) : if there are some undefined property, throw Error", () => {
        const stx1 = new Tx()
        let protoTx: proto.ITx
        protoTx = {
            to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
        }
        function result() {
            stx1.set(protoTx)
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            fee: 200, nonce: 1234,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, nonce: 1234,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200,
        }
        expect(result).toThrowError()
    })

    it("equals(tx) : should check all property in tx", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const result = tx.equals(tx)
        expect(result).toBeTruthy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal address", () => {
        spyOn(Address.prototype, "equals").and.returnValue(false)
        const result = tx.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal amount", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new Tx(tx)
        tx1.amount += 1000
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.amount > tx.amount).toBeTruthy()
    })

    it("equals(tx) : should return false if not equal fee", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new Tx(tx)
        tx1.fee += 10
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.fee > tx.fee).toBeTruthy()
    })

    it("equals(tx) : should return false if not equal nonce", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new Tx(tx)
        tx1.nonce += 10
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.nonce > tx.nonce).toBeTruthy()
    })

})

describe("SignedTx", () => {
    let tx: SignedTx
    let tx1: SignedTx
    let itx: proto.ITx
    let setTx: any
    beforeEach(() => {
        tx = new SignedTx({
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 10000, fee: 100, nonce: 1234,
            signature: randomBytes(32), recovery: 10,
        })
        itx = new proto.Tx({
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
            signature: randomBytes(32), recovery: 20,
        })
    })

    it("Test constructor (tx.tx is exist)", () => {
        const setSpy = spyOn(SignedTx.prototype, "set")
        tx1 = new SignedTx(tx)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set(tx) : should set signedTx information using parameter", () => {
        tx.set(itx)
        expect(tx.amount).toEqual(20000)
        expect(tx.recovery).toEqual(20)
    })

    it("set(tx) : if there are some undefined property, throw Error", () => {
        const stx1 = new SignedTx()
        let protoTx: proto.ITx
        protoTx = {
            to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
            signature: randomBytes(32), recovery: 20,
        }
        function result() {
            stx1.set(protoTx)
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
            signature: randomBytes(32), recovery: 20,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            fee: 200, nonce: 1234,
            signature: randomBytes(32), recovery: 20,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, nonce: 1234,
            signature: randomBytes(32), recovery: 20,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200,
            signature: randomBytes(32), recovery: 20,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
            recovery: 20,
        }
        expect(result).toThrowError()
        protoTx = {
            from: new Address(randomBytes(20)), to: new Address(randomBytes(20)),
            amount: 20000, fee: 200, nonce: 1234,
            signature: randomBytes(32),
        }
        expect(result).toThrowError()
    })

    it("equals(tx) : should check all property in tx", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const result = tx.equals(tx)
        expect(result).toBeTruthy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal address", () => {
        spyOn(Address.prototype, "equals").and.returnValue(false)
        const result = tx.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal amount", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new SignedTx(tx)
        tx1.amount += 1000
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.amount > tx.amount).toBeTruthy()
    })

    it("equals(tx) : should return false if not equal fee", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new SignedTx(tx)
        tx1.fee += 10
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.fee > tx.fee).toBeTruthy()
    })

    it("equals(tx) : should return false if not equal nonce", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const tx1 = new SignedTx(tx)
        tx1.nonce += 10
        const result = tx1.equals(tx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(tx1.nonce > tx.nonce).toBeTruthy()
    })

    it("Hash method must be return hashed tx", () => {
        tx.amount = 1
        tx1 = new SignedTx(tx)
        const hashedTx = new Hash(tx)
        tx.amount = 2
        const hashedTx2 = new Hash(tx)
        expect(hashedTx).not.toEqual(hashedTx2)
    })

    it("Verify method must be return boolean type", () => {
        spyOn(PublicKey.prototype, "verify")
        const secpSpy = spyOn(secp256k1, "recover").and.returnValue(Buffer)
        tx.verify()
        expect(secpSpy).toHaveBeenCalled()
        expect(PublicKey.prototype.verify).toHaveBeenCalled()
    })

    it("Test Equal method. have to return false (this.signature && this.signature.toString() != tx.signature.toString())", () => {
        tx.from = new Address(randomBytes(32))
        tx.to = new Address(randomBytes(32))
        tx1 = new SignedTx(tx)
        tx.signature = randomBytes(32)
        do {
            tx1.signature = randomBytes(32)
        } while (tx1.signature === tx.signature)
        expect(tx.equals(tx1)).toBeFalsy()
    })

    it("Test Equal method. have to return false(this.recovery!=tx.recovery)", () => {
        tx.from = new Address(randomBytes(32))
        tx.to = new Address(randomBytes(32))
        tx.signature = randomBytes(32)
        tx.recovery = 1
        tx1 = new SignedTx(tx)
        tx1.recovery = 2
        expect(tx.equals(tx1)).toBeFalsy()
    })

    it("decode(data) : return decoded signedTx data", () => {
        spyOn(proto.Tx, "decode").and.returnValue(itx)
        const setSpy = spyOn(SignedTx.prototype, "set")
        SignedTx.decode(new Uint8Array(32))
        expect(proto.Tx.decode).toHaveBeenCalled()
        expect(setSpy).toHaveBeenCalled()
    })
})

describe("GenesisTx", () => {
    let genesisTx: GenesisTx
    beforeEach(() => {
        genesisTx = new GenesisTx({
            to: new Address(randomBytes(20)), amount: 10000,
        })
    })

    it("constructor(tx) : should call set method if there is tx parameter", () => {
        spyOn(GenesisTx.prototype, "set")
        const genesisTx1 = new GenesisTx(genesisTx)
        expect(GenesisTx.prototype.set).toHaveBeenCalled()
    })

    it("set(tx) : should set tx information using parameter", () => {
        const genesisTx1 = new GenesisTx()
        genesisTx1.set(genesisTx)
        expect(genesisTx1.to).toEqual(genesisTx.to)
        expect(genesisTx1.amount).toEqual(genesisTx.amount)
    })

    it("set(tx) : if there are some undefined property, throw Error", () => {
        const genesisTx1 = new GenesisTx()
        let protoTx: proto.ITx
        protoTx = {
            amount: 10000,
        }
        function result() {
            genesisTx1.set(protoTx)
        }
        expect(result).toThrowError()
        protoTx = {
            to: new Address(randomBytes(20)),
        }
        expect(result).toThrowError()
    })

    it("equals(tx) : should check all property in tx", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const result = genesisTx.equals(genesisTx)
        expect(result).toBeTruthy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal address", () => {
        spyOn(Address.prototype, "equals").and.returnValue(false)
        const result = genesisTx.equals(genesisTx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
    })

    it("equals(tx) : should return false if not equal amount", () => {
        spyOn(Address.prototype, "equals").and.returnValue(true)
        const genesisTx1 = new GenesisTx({
            to: new Address(randomBytes(20)), amount: 20000,
        })
        const result = genesisTx1.equals(genesisTx)
        expect(result).toBeFalsy()
        expect(Address.prototype.equals).toHaveBeenCalled()
        expect(genesisTx1.amount > genesisTx.amount).toBeTruthy()
    })

    it("encode() : encode method must call proto.Tx.encode ", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        genesisTx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})

describe("GenesisSignedTx", () => {
    let genesisSTx: GenesisSignedTx
    beforeEach(() => {
        genesisSTx = new GenesisSignedTx({
            to: new Address(randomBytes(20)), amount: 10000,
            signature: randomBytes(32), recovery: 0,
        })
    })

    it("constructor(tx) : should call set method if there is tx parameter", () => {
        spyOn(GenesisSignedTx.prototype, "set")
        const genesisTx1 = new GenesisSignedTx(genesisSTx)
        expect(GenesisSignedTx.prototype.set).toHaveBeenCalled()
    })

    it("constructor(tx) : should call set method if there is tx parameter", () => {
        spyOn(GenesisSignedTx.prototype, "set")
        const genesisTx1 = new GenesisSignedTx({ to: new Address(randomBytes(20)), amount: 10000 }, randomBytes(32), 0)
        expect(GenesisSignedTx.prototype.set).toHaveBeenCalled()
    })

    it("constructor(tx) : should throw error if there are two signature informations", () => {
        spyOn(GenesisSignedTx.prototype, "set")
        let protoTx: proto.ITx
        protoTx = {
            to: new Address(randomBytes(20)), amount: 10000,
            signature: randomBytes(32),
        }
        function result() {
            const genesisTx1 = new GenesisSignedTx(protoTx, randomBytes(32), 0)
        }
        expect(result).toThrowError()
        protoTx = {
            to: new Address(randomBytes(20)), amount: 10000, recovery: 0,
        }
        expect(result).toThrowError()
    })

    it("set(tx) : should set tx information using parameter", () => {
        const genesisSTx1 = new GenesisSignedTx()
        genesisSTx1.set(genesisSTx)
        expect(genesisSTx1.to).toEqual(genesisSTx1.to)
        expect(genesisSTx1.amount).toEqual(genesisSTx1.amount)
        expect(genesisSTx1.signature).toEqual(genesisSTx1.signature)
        expect(genesisSTx1.recovery).toEqual(genesisSTx1.recovery)
    })

    it("set(tx) : if there are some undefined property, throw Error", () => {
        const genesisSTx1 = new GenesisSignedTx()
        let protoTx: proto.ITx
        protoTx = {
            amount: 10000, signature: randomBytes(32), recovery: 0,
        }
        function result() {
            genesisSTx1.set(protoTx)
        }
        expect(result).toThrowError()
        protoTx = {
            to: new Address(randomBytes(20)), signature: randomBytes(32), recovery: 0,
        }
        expect(result).toThrowError()
        protoTx = {
            to: new Address(randomBytes(20)), amount: 10000, recovery: 0,
        }
        expect(result).toThrowError()
        protoTx = {
            to: new Address(randomBytes(20)), amount: 10000, signature: randomBytes(32),
        }
        expect(result).toThrowError()
    })

    it("encode() : encode method must call proto.Tx.encode ", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Tx, "encode").and.returnValue(encoder)
        genesisSTx.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })

    it("decode() : decode method must call proto.Tx.decode ", () => {
        const decodeSpy = spyOn(proto.Tx, "decode").and.returnValue(genesisSTx)
        GenesisSignedTx.decode(randomBytes(32))
        expect(decodeSpy).toHaveBeenCalled()
    })

    it("verify() : should create public key using tx information. and call verify method", () => {
        const rSpy = spyOn(secp256k1, "recover").and.returnValue(Buffer)
        spyOn(genesisSTx, "unsignedHash").and.returnValue(new Hash(randomBytes(32)))
        spyOn(Hash.prototype, "toBuffer").and.returnValue(new Buffer(32))
        spyOn(PublicKey.prototype, "verify").and.returnValue(true)
        expect(genesisSTx.verify()).toBeTruthy()
        expect(rSpy).toHaveBeenCalled()
        expect(genesisSTx.unsignedHash).toHaveBeenCalled()
    })
})
