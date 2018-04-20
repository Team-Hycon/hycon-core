import * as bigInt from "big-integer"
import * as Long from "long"
import * as net from "net"
import * as $protobuf from "protobufjs"
import * as proto from "../src/serialization/proto"

import { randomBytes } from "crypto"
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import { Database } from "../src/consensus/database/database"
import { CpuMiner } from "../src/miner/cpuMiner"
import { MinerServer } from "../src/miner/minerServer"
import { StratumServer } from "../src/miner/StratumServer"
import { Hash } from "../src/util/hash"
import { testAsync } from "./async"

import { } from "jasmine"

describe("cpuMiner constructor test", () => {
    it("constructor : should set init property and call mine method", testAsync(async () => {
        const mineSpy = spyOn(CpuMiner.prototype, "mine")
        expect(mineSpy).toHaveBeenCalled()
    }))
})

describe("cpuMiner test", () => {
    let miner: CpuMiner
    const serverSpy: jasmine.SpyObj<MinerServer> = jasmine.createSpyObj("MinerServer", ["newCandidateBlock", "submitNonce", "start", "stop", "addCallbackNewBlock", "removeCallbackNewBlock"])
    beforeEach(() => {
        miner = new CpuMiner(serverSpy)
    })

    it("mine() : If the property of the miner is undefined, mining is not performed.", testAsync(async () => {
        spyOn(Long, "fromNumber").and.callThrough()
        spyOn(Long.prototype, "comp").and.callThrough()
        spyOn(CpuMiner, "hash").and.returnValue(Promise.resolve(new Uint8Array(32)))
        spyOn(Long.prototype, "add").and.callThrough()

        expect(Long.fromNumber).not.toHaveBeenCalled()
        expect(Long.prototype.comp).not.toHaveBeenCalled()
        expect(CpuMiner.hash).not.toHaveBeenCalled()
        expect(serverSpy.submitNonce).not.toHaveBeenCalled()
        expect(Long.prototype.add).not.toHaveBeenCalled()
    }))

    it("hash(prehash, nonce) : CryptoNight hash with preHash and nonce.", testAsync(async () => {
        spyOn(Uint8Array.prototype, "set").and.callThrough()
        spyOn(Buffer, "from").and.callThrough()
        spyOn(Uint8Array.prototype, "reverse").and.callThrough()
        spyOn(Hash, "hashCryptonight").and.returnValue(Promise.resolve(new Uint8Array(32)))

        try { await CpuMiner.hash(new Uint8Array(32), "D") } catch (e) { }

        expect(Uint8Array.prototype.set).toHaveBeenCalledTimes(2)
        expect(Buffer.from).toHaveBeenCalled()
        expect(Uint8Array.prototype.reverse).toHaveBeenCalled()
        expect(Hash.hashCryptonight).toHaveBeenCalled()
    }))

    it("hash(prehash, nonce) : If there is an error in the cryptoNight hash, it should be rejected.", testAsync(async () => {
        spyOn(Uint8Array.prototype, "set").and.callThrough()
        spyOn(Buffer, "from").and.callThrough()
        spyOn(Uint8Array.prototype, "reverse").and.callThrough()
        spyOn(Hash, "hashCryptonight").and.returnValue(Promise.reject(`Fail to hash`))

        let isError = false
        try { await CpuMiner.hash(new Uint8Array(32), "D") } catch (e) { isError = true }

        expect(Uint8Array.prototype.set).toHaveBeenCalledTimes(2)
        expect(Buffer.from).toHaveBeenCalled()
        expect(Uint8Array.prototype.reverse).toHaveBeenCalled()
        expect(Hash.hashCryptonight).toHaveBeenCalled()
        expect(isError).toBeTruthy()
    }))
    // TODO : test mining logic in mine
})
