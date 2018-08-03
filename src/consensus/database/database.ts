import levelup = require("levelup")
import { getLogger } from "log4js"
import rocksdb = require("rocksdb")
import { AnyBlock, Block } from "../../common/block"
import { GenesisBlock } from "../../common/blockGenesis"
import { Hash } from "../../util/hash"
import { BlockStatus } from "../sync"
import { BlockFile } from "./blockFile"
import { DBBlock } from "./dbblock"

const logger = getLogger("Database")

export class DecodeError extends Error {
    public hash: Hash
}

// tslint:disable:max-line-length
// tslint:disable-next-line:max-classes-per-file
export class Database {
    private database: levelup.LevelUp
    private blockFile: BlockFile
    private fileNumber: number

    constructor(dbPath: string, filePath: string) {

        const rocks: any = rocksdb(dbPath)
        this.database = levelup(rocks)
        this.blockFile = new BlockFile(filePath)
    }

    public async init(): Promise<void> {
        await this.database.open()
        const fileNumber = await this.getOrInitKey("fileNumber")
        const filePosition = await this.getOrInitKey("filePosition")
        this.fileNumber = +fileNumber
        await this.blockFile.fileInit(this.fileNumber, +filePosition)
    }
    public putDBBlock(hash: Hash, dbBlock: DBBlock) {
        return this.database.put("b" + hash, dbBlock.encode())
    }

    public async writeBlock(block: AnyBlock) {
        const writeLocation = await this.blockFile.put(block)
        if (this.fileNumber !== writeLocation.fileNumber) {
            this.fileNumber = writeLocation.fileNumber
            await this.database.put("fileNumber", this.fileNumber)
        }
        await this.database.put("filePosition", writeLocation.filePosition)
        return writeLocation
    }

    public async setHashAtHeight(height: number, hash: Hash): Promise<void> {
        await this.database.put(height, hash.toBuffer())
    }

    public async getHashAtHeight(height: number): Promise<Hash> {
        try {
            const hashData = await this.database.get(height)
            const hash = new Hash(hashData)
            return hash
        } catch (e) {
            if (e.notFound) { return undefined }
            logger.error(`Fail to getHashAtHeight : ${e}`)
            throw e
        }
    }

    public async getBlockAtHeight(height: number): Promise<Block | GenesisBlock> {
        const hashData = await this.database.get(height)
        const hash = new Hash(hashData)
        const block = await this.getDBBlock(hash)
        return this.dbBlockToBlock(block)
    }

    public async setBlockStatus(hash: Hash, status: BlockStatus): Promise<void> {
        await this.database.put("s" + hash, status)
    }

    public async getBlockStatus(hash: Hash): Promise<BlockStatus> {
        try {
            const key = "s" + hash
            const status = await this.database.get(key)
            return Number(status)
        } catch (e) {
            if (e.notFound) { return BlockStatus.Nothing }
            logger.error(`Fail to getBlockStatus : ${e}`)
            throw e
        }
    }

    public async setBlockTip(hash: Hash) {
        await this.database.put("__blockTip", hash.toBuffer())
    }

    public async getBlockTip(): Promise<DBBlock | undefined> {
        return this.getTip("__blockTip")
    }

    public async setHeaderTip(hash: Hash) {
        await this.database.put("__headerTip", hash.toBuffer())
    }

    public async getHeaderTip(): Promise<DBBlock | undefined> {
        return this.getTip("__headerTip")
    }

    public async getBlock(hash: Hash): Promise<AnyBlock | undefined> {
        try {
            const dbBlock = await this.getDBBlock(hash)
            logger.debug(`DBBlock Key=${"b" + hash} Data=${dbBlock.offset}/${dbBlock.length}`)
            return this.dbBlockToBlock(dbBlock)
        } catch (e) {
            if (e.notFound) {
                e.error(`Block not found : ${e}`)
                return undefined
            }
            if (e instanceof DecodeError) {

                logger.error(`Could not decode block ${hash}`)
            }
            throw e
        }
    }

    public async getDBBlocksRange(fromHeight: number, count?: number): Promise<DBBlock[]> {
        const heights: number[] = []
        const dbBlocks: DBBlock[] = []
        for (let height = fromHeight; height < fromHeight + count; height++) {
            const hash = await this.getHashAtHeight(height)
            if (hash !== undefined) {
                const dbBlock = await this.getDBBlock(hash)
                if (dbBlock !== undefined) {
                    dbBlocks.push(dbBlock)
                }
            }
        }
        return dbBlocks
    }

    public async getDBBlock(hash: Hash): Promise<DBBlock | undefined> {
        let decodingDBEntry = false
        try {
            const key = "b" + hash
            const encodedBlock = await this.database.get(key)
            decodingDBEntry = true
            const block = DBBlock.decode(encodedBlock)
            if (block) {
                return block
            } else {

                logger.debug(`Could not decode block ${hash}`)
                const decodeError = new DecodeError()
                decodeError.hash = hash
                throw decodeError
            }
        } catch (e) {
            if (e.notFound) { return undefined }
            if (decodingDBEntry) {

                logger.error(`Could not decode block ${hash}`)
                const decodeError = new DecodeError()
                decodeError.hash = hash
                throw decodeError
            }
            throw e
        }
    }

    public async dbBlockToBlock(dbBlock: DBBlock): Promise<AnyBlock> {
        if (dbBlock.offset !== undefined && dbBlock.length !== undefined && dbBlock.fileNumber !== undefined) {
            return this.blockFile.get(dbBlock.fileNumber, dbBlock.offset, dbBlock.length)
        } else {
            logger.error(`Fail to dbBlock to block : Block file information is not found`)
            throw new Error("Block could not be found")
        }
    }

    private async getOrInitKey(key: string, value: any = 0): Promise<any> {
        try {
            const p = this.database.get(key)
            const v = await p
            return v
        } catch (e) {
            if (e.notFound) {
                await this.database.put(key, value)
                return value
            }
            throw e
        }
    }

    private async getTip(key: string): Promise<DBBlock | undefined> {
        try {
            const hashData = new Uint8Array(await this.database.get(key))
            const hash = new Hash(hashData)
            const block = await this.getDBBlock(hash)
            return block
        } catch (e) {
            if (e.notFound) { return undefined }
            logger.error(`Fail to getTip : ${e}`)
            throw e
        }
    }
}
