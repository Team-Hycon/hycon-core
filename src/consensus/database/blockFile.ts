
import * as fs from "fs-extra"
import { getLogger } from "log4js"
import { zeroPad } from "../../api/client/stringUtil"
import { AsyncLock } from "../../common/asyncLock"
import { AnyBlock, Block } from "../../common/block"
import * as proto from "../../serialization/proto"
import { FileUtil } from "../../util/fileUtil"

const logger = getLogger("BlockFile")

export class BlockFile {
    private n: number
    private fd: number
    private filePosition: number
    private fileSize: number
    private path: string
    private writeFileLock: AsyncLock

    constructor(path: string) {
        this.path = path
        this.writeFileLock = new AsyncLock(true)
    }

    public async fileInit(n: number, filePosition: number): Promise<void> {
        if (!(await fs.pathExists(this.path))) { await fs.mkdir(this.path) }
        this.n = n
        await this.open(n, true)
        this.filePosition = filePosition
        this.writeFileLock.releaseLock()
    }

    public async get(n: number, offset: number, length: number): Promise<AnyBlock> {
        if (this.n === n) {
            return this.writeFileLock.critical(async () => {
                const data: Buffer = Buffer.alloc(length)
                await fs.read(this.fd, data, 0, length, offset)
                return Block.decode(data)
            })
        } else {
            const fd = await this.open(n, false)
            const data: Buffer = Buffer.alloc(length)
            await fs.read(this.fd, data, 0, length, offset)
            await fs.close(fd)
            return Block.decode(data)
        }
    }

    public async put(block: AnyBlock) {
        return this.writeFileLock.critical(async () => {
            const data = block.encode()
            if (this.fileSize < this.filePosition + data.length) {
                await this.expandFile()
            }
            const offset = this.filePosition
            this.filePosition += data.length
            const uint8array: any = data // Typescript's type definition is wrong
            const { bytesWritten } = await fs.write(this.fd, uint8array, 0, data.length, offset)
            if (bytesWritten !== data.length) {
                throw new Error("Only part of the block was written to disk")
            }

            return { fileNumber: this.n, filePosition: this.filePosition, offset, length: data.length }
        })
    }

    public size(): number {
        return this.fileSize
    }

    private async nextFile() {
        await this.close()
        this.n++
        await this.open(this.n, true)
    }

    private async open(n: number, write: boolean) {
        const fileName = this.path + "/blk" + zeroPad(n.toString(), 5) + ".dat"
        if (write) {
            if (!(await fs.pathExists(fileName))) {
                // Read/Write do not truncate, throws exception the file does not exist
                this.fd = await fs.open(fileName, "w+")
            } else {
                // Read/Write and create/truncate
                this.fd = await fs.open(fileName, "r+")
            }
            this.n = n
            this.filePosition = 0
            this.fileSize = (await fs.stat(fileName)).size
        } else {
            // Read do not truncate
            return fs.open(fileName, "r")
        }
    }

    private async close(): Promise<void> {
        try {
            return await fs.close(this.fd)
        } catch (e) {
            logger.error(`Failed to close file: ${e}`)
            throw e
        }
    }

    private async expandFile(): Promise<void> {
        if (this.fileSize > 134217728) { // 128MB
            await this.nextFile()
        } else {
            const zeroArray = new Uint8Array(16777216) // 16MB
            await fs.appendFile(this.fd, zeroArray, { encoding: "buffer" })
            this.fileSize += zeroArray.length
        }
    }
}
