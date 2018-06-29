
import { O_CREAT, O_RDONLY, O_RDWR } from "constants"
import * as fs from "fs-extra"
import { getLogger } from "log4js"
import { zeroPad } from "../../api/client/stringUtil"
import { AsyncLock } from "../../common/asyncLock"
import { AnyBlock, Block } from "../../common/block"

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
        this.writeFileLock = new AsyncLock(1)
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
            const data: Buffer = Buffer.alloc(length)
            const { bytesRead, buffer } = await fs.read(this.fd, data, 0, length, offset)
            if (bytesRead !== length) {
                throw new Error("Failed to read entire block from file")
            }
            return Block.decode(data)

        } else {
            const fd = await this.open(n, false)
            const data: Buffer = Buffer.alloc(length)
            await fs.read(fd, data, 0, length, offset)
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
            // tslint:disable-next-line:no-bitwise
            this.fd = await fs.open(fileName, O_RDWR | O_CREAT)
            this.n = n
            this.filePosition = 0
            this.fileSize = (await fs.stat(fileName)).size
        } else {
            // Read do not truncate
            return fs.open(fileName, O_RDONLY)
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

            // path is ignored if file descriptor is supplied: https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
            const stream = fs.createWriteStream("", { flags: "r+", fd: this.fd, autoClose: true, start: this.filePosition })
            await stream.write(zeroArray)

            this.fileSize += zeroArray.length
        }
    }
}
