import { randomBytes } from "crypto"
import * as fs from "fs"
import { } from "jasmine"
import Long = require("long")
import { GenesisBlock } from "../src/common/blockGenesis"
import { GenesisSignedTx } from "../src/common/txGenesisSigned"
import * as proto from "../src/serialization/proto"
describe("Genesis Block Tests", () => {
    let header: proto.IBlockHeader
    const gTx: jasmine.SpyObj<GenesisSignedTx> = jasmine.createSpyObj("GTX", ["verify"])
    beforeAll(() => {
        header = {
            difficulty: 5,
            merkleRoot: randomBytes(32),
            stateRoot: randomBytes(32),
            timeStamp: Date.now(),
        }
    })

    it("loadFromFile() should attempt to read the genesis block from the file system", () => {
        const fsSpy = spyOn(fs, "readFileSync").and.returnValue(new Buffer(32))
        const decSpy = spyOn(proto.GenesisBlock, "decode")
        const setSpy = spyOn(GenesisBlock.prototype, "set").and.callFake(() => { return })
        GenesisBlock.loadFromFile("fakepath")
        expect(fsSpy).toHaveBeenCalledWith("fakepath")
        expect(decSpy).toHaveBeenCalled()
        expect(setSpy).toHaveBeenCalled()
    })

    it("decode() should call proto.Block.decode()", () => {
        const decSpy = spyOn(proto.GenesisBlock, "decode")
        const setSpy = spyOn(GenesisBlock.prototype, "set").and.callFake(() => { return })
        GenesisBlock.decode(new Buffer(32))
        expect(decSpy).toHaveBeenCalledBefore(setSpy)
    })

    it("set() should throw and error if transactions are undefined", () => {
        function result() {
            const gBlock = new GenesisBlock({})
        }
        expect(result).toThrowError("Block Txs are missing")

    })

    it("set() should throw an error if header is missing", () => {
        function result() {
            const gBlock = new GenesisBlock({ txs: [] })
        }
        expect(result).toThrowError("Block Header is missing in GenesisBlock")
    })

    it("set() should assign transactions to block", () => {
        const txSpy = spyOn(GenesisSignedTx.prototype, "set").and.callFake(() => {
            return
        })
        const gBlock = new GenesisBlock({ header, txs: [gTx, gTx] })
        expect(gBlock.txs.length).toEqual(2)
    })

    it("set() should set a new header if required", () => {
        const txSpy = spyOn(GenesisSignedTx.prototype, "set").and.callFake(() => {
            return
        })
        const gBlock = new GenesisBlock({ header, txs: [gTx, gTx] })
        const setSpy = spyOn(gBlock.header, "set")
        gBlock.set({ header, txs: [gTx, gTx] })
        expect(setSpy).toHaveBeenCalled()
    })

    it("encode() should return encoded block data using proto.Block.encode function", () => {
        const expected = new Buffer(32)
        const encoder = jasmine.createSpyObj<protobuf.Writer>("encoder", ["finish"])
        encoder.finish.and.returnValue(expected)
        const encode = spyOn(proto.Block, "encode").and.returnValue(encoder)
        const gBlock = new GenesisBlock({ header, txs: [] })
        const encoded = gBlock.encode()

        expect(encoded).toBe(expected)
        expect(proto.Block.encode).toHaveBeenCalled()
        expect(encoder.finish).toHaveBeenCalled()
    })
})
