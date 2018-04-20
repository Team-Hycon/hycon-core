import { randomBytes } from "crypto"
import * as fs from "fs-extra"
import { } from "jasmine"
import { BlockFile } from "../src/consensus/database/blockFile"
import { DBBlock } from "../src/consensus/database/dbblock"
import * as proto from "../src/serialization/proto"
import { testAsync } from "./async"

describe("blockFile", () => {
    let blockFile: BlockFile
    beforeEach(testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        blockFile = new BlockFile()
        try { await blockFile.fileInit("", 0) } catch (e) { }
    }))

    it("get(offset, length) : should read data from file", (testAsync(async () => {
        const readSyncSpy = spyOn(fs, "read")
        try { await blockFile.get(0, 10) } catch (e) { }
        expect(readSyncSpy).toHaveBeenCalled()
    })))

    it("put(block) : should put data in file", (testAsync(async () => {
        const writeSpy = spyOn(fs, "write")
        try { await blockFile.put(randomBytes(32)) } catch (e) { }
        expect(writeSpy).toHaveBeenCalled()
    })))

    it("close() : should close file system", (testAsync(async () => {
        const closeSyncSpy = spyOn(fs, "close")
        try { await blockFile.close() } catch (e) { }
        expect(closeSyncSpy).toHaveBeenCalled()
    })))

    it("expandFile() : should expend file using appendFile if fileSize must be expended", (testAsync(async () => {
        const appendFileSyncSpy = spyOn(fs, "appendFile")
        const writeSyncSpy = spyOn(fs, "write")
        const tmp = randomBytes(16777217)
        try { await blockFile.put(tmp) } catch (e) { }
        expect(appendFileSyncSpy).toHaveBeenCalledBefore(writeSyncSpy)
    })))

    it("size() : should return file Size", (() => {
        const fileSize = blockFile.size()
        expect(fileSize).toEqual(0)
    }))
})

describe("blockFile constructor test(condition)", () => {
    let blockFile: BlockFile
    beforeEach(() => {
        spyOn(fs, "ensureFile").and.throwError("Error : ensureFile Error")
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))

    })

    it("constructor : not exists test", (testAsync(async () => {
        const existSyncSpy = spyOn(fs, "existsSync").and.returnValue(false)
        const mkdirSyncSpy = spyOn(fs, "mkdirSync")
        blockFile = new BlockFile()
        try { await blockFile.fileInit("", 0) } catch (e) { }
        expect(existSyncSpy).toHaveBeenCalled()
        expect(mkdirSyncSpy).toHaveBeenCalled()
        expect(fs.ensureFile).toThrowError("Error : ensureFile Error")
    })))
})

describe("blockFile error test ( catch )", () => {
    let blockFile: BlockFile
    beforeEach(() => {

    })

    it("constructor catch test", (testAsync(async () => {
        const ensureSpy = spyOn(fs, "ensureFile").and.throwError("Error : existsSync Error")
        blockFile = new BlockFile()
        expect(ensureSpy).toThrowError("Error : existsSync Error")
    })))

    it("get(offset, length) catch test", (testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        const readSpy = spyOn(fs, "read").and.throwError("Error : readSync Error")
        blockFile = new BlockFile()
        let isError = false
        try { await blockFile.get(0, 10) } catch (e) { isError = true }

        expect(readSpy).toThrowError("Error : readSync Error")
        expect(isError).toBe(true)
    })))

    it("put(data) catch test", (testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        spyOn(fs, "appendFile")
        const writeSpy = spyOn(fs, "write").and.throwError("Error : write Error")
        blockFile = new BlockFile()
        let isError = false
        try { await blockFile.put(randomBytes(32)) } catch (e) { isError = true }
        expect(writeSpy).toThrowError("Error : write Error")
        expect(isError).toBe(true)
    })))

    it("close() catch test", (testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        const closeSpy = spyOn(fs, "close").and.throwError("Error : close Error")
        blockFile = new BlockFile()
        let isError = false
        try { await blockFile.close() } catch (e) { isError = true }
        expect(closeSpy).toThrowError("Error : close Error")
        expect(isError).toBe(true)
    })))

    it("expandFile() catch test", (testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(true))
        spyOn(fs, "open").and.returnValue(Promise.resolve(10))
        spyOn(fs, "stat").and.returnValue(Promise.resolve({ size: 0 }))
        const appendFileSpy = spyOn(fs, "appendFile").and.throwError("Error : appendFile Error")
        const tmp = randomBytes(16777217)
        blockFile = new BlockFile()
        let isError = false
        try { await blockFile.put(tmp) } catch (e) { isError = true }
        expect(appendFileSpy).toThrowError("Error : appendFile Error")
        expect(isError).toBe(true)
    })))

    it("delBlock(offset, length) : should write specific block part in blockFile with 0", (testAsync(async () => {
        const fillSpy = spyOn(Buffer.prototype, "fill").and.returnValue([0, 0, 0, 0, 0, 0, 0, 0])
        const writeSpy = spyOn(fs, "write")
        blockFile = new BlockFile()
        try { await blockFile.delBlock(0, 10) } catch (e) { }
        expect(fillSpy).toHaveBeenCalledBefore(writeSpy)
    })))
})
