import { randomBytes } from "crypto"
import * as fs from "fs-extra"
import { } from "jasmine"
import Long = require("long")
import { AsyncLock } from "../src/common/asyncLock"
import { Block } from "../src/common/block"
import { GenesisBlock } from "../src/common/blockGenesis"
import { BlockFile } from "../src/consensus/database/blockFile"
import { testAsync } from "./async"

describe("blockFile", () => {
    let blockFile: BlockFile
    let genesisBlock: GenesisBlock
    beforeEach(testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        genesisBlock = new GenesisBlock({
            header: {
                difficulty: 0x000000FF,
                merkleRoot: randomBytes(32),
                nonce: Long.fromNumber(1234, true),
                previousHash: [randomBytes(32)],
                stateRoot: randomBytes(32),
                timeStamp: Date.now(),
            },
            txs: [],
        })
        blockFile = new BlockFile("filePath")
        try { await blockFile.fileInit(0, 0) } catch (e) { }
    }))

    xit("get(number, offset, length) : should read data from file", (testAsync(async () => {
        const readSyncSpy = spyOn(fs, "read")
        try { await blockFile.get(0, 10, 10) } catch (e) { }
        expect(readSyncSpy).toHaveBeenCalled()
    })))

    xit("get(number, offset, length) : should read data from file", (testAsync(async () => {
        spyOn(fs, "close")
        spyOn(fs, "read")
        spyOn(Buffer, "alloc")
        const decodeSpy = spyOn(Block, "decode").and.returnValue(genesisBlock)
        try { await blockFile.get(1, 10, 10) } catch (e) { }
        expect(fs.read).toHaveBeenCalled()
        expect(fs.open).toHaveBeenCalled()
        expect(Buffer.alloc).toHaveBeenCalled()
        expect(fs.close).toHaveBeenCalled()
        expect(Block.decode).toHaveBeenCalled()
    })))

    xit("put(block) : should put data in file", (testAsync(async () => {
        spyOn(fs, "write").and.returnValue({ bytesWritten: 32 })
        const lockSpy = spyOn(AsyncLock.prototype, "critical").and.callThrough()
        const encodeSpy = spyOn(genesisBlock, "encode").and.returnValue(randomBytes(32))
        try { await blockFile.put(genesisBlock) } catch (e) { }
        expect(fs.write).toHaveBeenCalled()
        expect(lockSpy).toHaveBeenCalled()
        expect(encodeSpy).toHaveBeenCalled()
    })))

    xit("size() : should return file Size", (() => {
        const fileSize = blockFile.size()
        expect(fileSize).toEqual(0)
    }))
})
