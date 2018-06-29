import { EventEmitter } from "events"
import fs = require("fs")
import { getLogger } from "log4js"
import { Address } from "../common/address"
import { AsyncLock } from "../common/asyncLock"
import { AnyBlock, Block } from "../common/block"
import { GenesisBlock } from "../common/blockGenesis"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { DelayQueue } from "../common/delayQueue"
import { ITxPool } from "../common/itxPool"
import { SignedTx } from "../common/txSigned"
import { globalOptions } from "../main"
import { Hash } from "../util/hash"
import { Account } from "./database/account"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { DBMined } from "./database/dbMined"
import { DBTx } from "./database/dbtx"
import { ITxDatabase } from "./database/itxDatabase"
import { MinedDatabase } from "./database/minedDatabase"
import { TxDatabase } from "./database/txDatabase"
import { TxValidity, WorldState } from "./database/worldState"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { IConsensus, IStatusChange } from "./iconsensus"
import { BlockStatus } from "./sync"
import { Verify } from "./verify"
const logger = getLogger("Consensus")

export interface IPutResult {
    oldStatus: BlockStatus,
    status?: BlockStatus,
    dbBlock?: DBBlock,
}

export class Consensus extends EventEmitter implements IConsensus {
    private txdb?: ITxDatabase
    private minedDatabase: MinedDatabase
    private txPool: ITxPool
    private worldState: WorldState
    private db: Database
    private blockTip: DBBlock
    private headerTip: DBBlock
    private lock: AsyncLock

    private futureBlockQueue: DelayQueue

    constructor(txPool: ITxPool, worldState: WorldState, dbPath: string, filePath: string, txPath?: string, minedDBPath?: string) {
        super()
        this.worldState = worldState
        this.txPool = txPool
        this.db = new Database(dbPath, filePath)
        if (txPath) { this.txdb = new TxDatabase(txPath) }
        if (minedDBPath) { this.minedDatabase = new MinedDatabase(minedDBPath) }
        this.futureBlockQueue = new DelayQueue(10)
    }
    public async init(): Promise<void> {
        if (this.lock !== undefined) {
            throw new Error("Multiple calls to init")
        }
        this.lock = new AsyncLock(1)
        try {
            await this.db.init()
            this.blockTip = await this.db.getBlockTip()
            this.headerTip = await this.db.getHeaderTip()

            if (this.txdb !== undefined) {
                await this.txdb.init(this, this.blockTip === undefined ? undefined : this.blockTip.height)
            }
            if (this.minedDatabase !== undefined) {
                await this.minedDatabase.init(this, this.blockTip === undefined ? undefined : this.blockTip.height)
            }

            if (this.blockTip === undefined) {
                const genesis = await this.initGenesisBlock()
            }

            if (globalOptions.bootstrap !== undefined) {
                this.emit("candidate", this.blockTip, new Hash(this.blockTip.header))
            }

            logger.info(`Initialization of consensus is over.`)
        } catch (e) {
            logger.error(`Initialization failure in consensus: ${e}`)
            process.exit(1)
        } finally {
            this.lock.releaseLock()
        }
    }

    public putBlock(block: Block): Promise<IStatusChange> {
        return this.put(block.header, block)
    }

    public putHeader(header: BlockHeader): Promise<IStatusChange> {
        return this.put(header)
    }

    public getBlockByHash(hash: Hash): Promise<AnyBlock> {
        return this.db.getBlock(hash)
    }
    public async getHeaderByHash(hash: Hash): Promise<AnyBlockHeader | undefined> {
        const dbBlock = await this.db.getDBBlock(hash)
        if (dbBlock === undefined) { return undefined }
        return dbBlock.header
    }
    public async getBlocksRange(fromHeight: number, count?: number): Promise<AnyBlock[]> {
        try {
            if (count === undefined) {
                this.blockTip.height >= fromHeight ? count = this.blockTip.height - fromHeight + 1 : count = 0
            }
            const blocks: Block[] = []
            const dbblocks = await this.db.getDBBlocksRange(fromHeight, count)
            for (const dbblock of dbblocks) {
                const block = await this.db.dbBlockToBlock(dbblock)
                if (block instanceof Block) {
                    blocks.push(block)
                }
            }
            return blocks
        } catch (e) {
            logger.error(`getBlocksRange failed\n${e}`)
            throw e
        }

    }
    public async getHeadersRange(fromHeight: number, count?: number): Promise<AnyBlockHeader[]> {
        try {
            if (count === undefined) {
                this.headerTip.height >= fromHeight ? count = this.headerTip.height - fromHeight + 1 : count = 0
            }
            const dbblocks = await this.db.getDBBlocksRange(fromHeight, count)
            return dbblocks.map((dbblock) => dbblock.header)
        } catch (e) {
            logger.error(`getHeadersRange failed\n${e}`)
            throw e
        }
    }
    public getAccount(address: Address): Promise<Account> {
        if (this.blockTip === undefined) {
            throw new Error(`There is not any tips`)
        }
        return this.worldState.getAccount(this.blockTip.header.stateRoot, address)
    }
    public getLastTxs(address: Address, count?: number): Promise<DBTx[]> {
        if (this.txdb === undefined) {
            throw new Error(`The database to get txs does not exist.`)
        }
        const result: DBTx[] = []
        const idx: number = 0
        return this.txdb.getLastTxs(address, result, idx, count)
    }

    public async getNextTxs(address: Address, txHash: Hash, index: number, count?: number): Promise<DBTx[]> {
        try {
            if (this.txdb) {
                const result: DBTx[] = []
                return await this.txdb.getNextTxs(address, txHash, result, index, count)
            } else {
                return Promise.reject(`The database to get txs does not exist.`)
            }
        } catch (e) {
            logger.error(`Fail to getNextTxs : ${e}`)
            return e
        }
    }

    public async getMinedBlocks(address: Address, count?: number, index?: number, blockHash?: Hash): Promise<DBMined[]> {
        try {
            if (index === undefined) { index = 0 }
            if (count === undefined) { count = 10 }
            if (this.minedDatabase) {
                return this.minedDatabase.getMinedBlocks(address, count, index, blockHash)
            } else {
                return Promise.reject(`There is  no minedDatabase`)
            }
        } catch (e) {
            logger.error(`Fail to getMinedBlocks in consensus: ${e}`)
            return e
        }

    }
    public getBlockStatus(hash?: Hash): Promise<BlockStatus> {
        if (hash === undefined) {
            return Promise.resolve(BlockStatus.Nothing)
        }
        return this.db.getBlockStatus(hash)
    }

    public getBlocksTip(): { hash: Hash; height: number, totalwork: number } {
        return { hash: new Hash(this.blockTip.header), height: this.blockTip.height, totalwork: this.blockTip.totalWork }
    }

    public getCurrentDiff(): number {
        return this.blockTip.header.difficulty
    }
    public getHeadersTip(): { hash: Hash; height: number, totalwork: number } {
        return { hash: new Hash(this.headerTip.header), height: this.headerTip.height, totalwork: this.headerTip.totalWork }
    }
    public async txValidity(tx: SignedTx): Promise<TxValidity> {
        return this.lock.critical(async () => {
            let validity = await this.worldState.validateTx(this.blockTip.header.stateRoot, tx)
            if (!tx.verify()) { validity = TxValidity.Invalid }
            return validity
        })
    }
    public async getTx(hash: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined> {
        if (this.txdb === undefined) {
            throw new Error(`The database to get txs does not exist.`)
        }
        return this.txdb.getTx(hash)
    }
    public getHash(height: number): Promise<Hash | undefined> {
        return this.db.getHashAtHeight(height)
    }
    public async getBlockHeight(hash: Hash): Promise<number> {
        const block = await this.db.getDBBlock(hash)
        return (block !== undefined) ? block.height : undefined
    }

    public async getBlockAtHeight(height: number): Promise<Block | GenesisBlock | undefined> {
        return this.db.getBlockAtHeight(height)
    }
    private async put(header: BlockHeader, block?: Block): Promise<IStatusChange> {
        if (header.timeStamp > Date.now()) {
            await this.futureBlockQueue.waitUntil(header.timeStamp)
        }

        if (header.merkleRoot.equals(Hash.emptyHash)) {
            // Block contains no transactions, create a new empty block
            block = new Block({ header, txs: [] })
        }

        return this.lock.critical(async () => {
            const startHtip = this.headerTip.height
            const hash = new Hash(header)
            const { oldStatus, status, dbBlock } = await this.process(hash, header, block)
            if (status !== undefined && oldStatus !== status) {
                await this.db.setBlockStatus(hash, status)
            }

            if (dbBlock === undefined || status < BlockStatus.Header) {
                return { oldStatus, status, htip: this.headerTip.height > startHtip }
            }

            await this.db.putDBBlock(hash, dbBlock)

            if (this.headerTip === undefined || (dbBlock.height - dbBlock.totalWork) > (this.headerTip.height - this.headerTip.totalWork)) {
                this.headerTip = dbBlock
                await this.db.setHeaderTip(hash)
            }

            if (status < BlockStatus.Block) {
                logger.info(`Received Header`
                    + ` ${hash}(${dbBlock.height}, ${dbBlock.totalWork.toExponential()}),`
                    + ` BTip(${this.blockTip.height}, ${this.blockTip.totalWork.toExponential()}),`
                    + ` HTip(${this.headerTip.height}, ${this.headerTip.totalWork.toExponential()})`)
                return { oldStatus, status, htip: this.headerTip.height > startHtip }
            }

            if (block !== undefined && (this.blockTip === undefined || (dbBlock.height - dbBlock.totalWork) > (this.blockTip.height - this.blockTip.totalWork))) {
                await this.reorganize(hash, block, dbBlock)
                await this.db.setBlockTip(hash)
                this.emit("candidate", this.blockTip, hash)
            }

            logger.info(`Received Block`
                + ` ${hash}(${dbBlock.height}, ${dbBlock.totalWork.toExponential()}),`
                + ` BTip(${this.blockTip.height}, ${this.blockTip.totalWork.toExponential()}),`
                + ` HTip(${this.headerTip.height}, ${this.headerTip.totalWork.toExponential()})`)

            return { oldStatus, status, htip: this.headerTip.height > startHtip }
        })

    }
    private async process(hash: Hash, header: BlockHeader, block?: Block): Promise<IPutResult> {
        // Consensus Critical
        const result: IPutResult = { oldStatus: await this.db.getBlockStatus(hash) }
        result.status = result.oldStatus

        if (result.oldStatus === BlockStatus.Rejected) {
            return result
        }

        if (header.previousHash.length <= 0) {
            logger.warn(`Rejecting block(${hash.toString()}): No previousHash`)
            result.status = BlockStatus.Rejected
            return result
        }

        const previousHash = header.previousHash[0]
        const previousStatus = await this.db.getBlockStatus(previousHash)

        if (previousStatus <= BlockStatus.Nothing) {
            return result
        }

        const previousDBBlock = await this.db.getDBBlock(previousHash)
        if (previousDBBlock === undefined) {
            return result
        }

        if (result.oldStatus === BlockStatus.Nothing) {
            await Verify.processHeader(previousDBBlock, header, hash, result)

            if (result.status === BlockStatus.Rejected) {
                return result
            }
        }

        if (block === undefined) {
            return result
        }

        if (previousStatus < BlockStatus.Block) {
            return result
        }

        if (result.oldStatus >= BlockStatus.Nothing && result.oldStatus <= BlockStatus.Header) {
            const dbBlock = (result.dbBlock !== undefined) ? result.dbBlock : await this.db.getDBBlock(hash)
            await Verify.processBlock(block, dbBlock, hash, header, previousDBBlock, this.db, this.worldState, result)
            if (result.status === BlockStatus.Rejected) {
                return result
            }

            if (this.minedDatabase !== undefined) {
                await this.minedDatabase.putMinedBlock(hash, block.header.timeStamp, block.txs, block.header.miner)
            }
        }

        return result

    }

    private async reorganize(newBlockHash: Hash, newBlock: Block, newDBBlock: DBBlock) {
        // Consensus Critical
        const newBlockHashes: Hash[] = []
        const newBlocks: Block[] = []
        let popStopHeight = newDBBlock.height
        let hash = newBlockHash
        let block: Block = newBlock
        while (popStopHeight > 0) {
            newBlockHashes.push(hash)
            newBlocks.push(block)

            hash = block.header.previousHash[0]
            if (await this.db.getBlockStatus(hash) === BlockStatus.MainChain) {
                break
            }
            const tmpBlock = await this.db.getBlock(hash)
            if (!(tmpBlock instanceof Block)) {
                throw new Error("Error trying to reorganize past the genesis block")
            }
            block = tmpBlock
            popStopHeight -= 1
        }

        let popHeight = this.blockTip.height
        let popHash = new Hash(this.blockTip.header)
        const popCount = popHeight - popStopHeight + 1
        if (popCount >= 1) {
            logger.info(`Reorganizing, removing ${popCount} blocks for ${newBlocks.length} new blocks on a longer chain, `
                + `new tip ${newBlockHash.toString()}(${newDBBlock.height}, ${newDBBlock.totalWork.toExponential()}), `
                + `previous tip ${popHash.toString()}(${popHeight}, ${this.blockTip.totalWork.toExponential()}`)
        }

        const popTxs: SignedTx[] = []
        while (popHeight >= popStopHeight) {
            const popBlock = await this.db.getBlock(popHash)
            if (!(popBlock instanceof Block)) {
                throw new Error("Error trying to reorganize past the genesis block")
            }
            await this.db.setBlockStatus(popHash, BlockStatus.Block)
            this.emit("txs", popBlock.txs)
            for (const one of popBlock.txs) {
                popTxs.push(one)
            }
            popHash = popBlock.header.previousHash[0]
            popHeight -= 1
        }

        if (newBlocks.length !== newBlockHashes.length) {
            throw new Error("Error during reorganization")
        }

        let pushHeight = popStopHeight
        const removeTxs: SignedTx[] = []
        while (newBlockHashes.length > 0) {
            hash = newBlockHashes.pop()
            block = newBlocks.pop()
            await this.db.setBlockStatus(hash, BlockStatus.MainChain)
            await this.db.setHashAtHeight(pushHeight, hash)
            for (const tx of block.txs) {
                removeTxs.push(tx)
            }
            pushHeight += 1
            if (this.txdb) { await this.txdb.putTxs(hash, block.header.timeStamp, block.txs) }
            this.emit("block", block)
        }

        this.blockTip = newDBBlock
        // This must not use await because of lock. So we used then.
        this.txPool.putTxs(popTxs).then(() => this.txPool.removeTxs(removeTxs))
    }

    private async initGenesisBlock(): Promise<GenesisBlock> {
        try {
            const genesis = GenesisBlock.loadFromFile()
            const transition = await this.worldState.first(genesis)
            await this.worldState.putPending(transition.batch, transition.mapAccount)
            genesis.header.merkleRoot = new Hash("Centralization is the root of tyranny.")
            const genesisHash = new Hash(genesis.header)
            const { fileNumber, length, filePosition, offset } = await this.db.writeBlock(genesis)
            const dbBlock = new DBBlock({ fileNumber, header: genesis.header, height: 0, length, offset, tEMA: DifficultyAdjuster.getTargetTime(), pEMA: Math.pow(2, -10), totalWork: 0, nextDifficulty: Math.pow(2, -10) })
            await this.db.putDBBlock(genesisHash, dbBlock)
            this.blockTip = this.headerTip = dbBlock
            await this.db.setBlockStatus(genesisHash, BlockStatus.MainChain)
            await this.db.setHashAtHeight(0, genesisHash)
            await this.db.setHeaderTip(genesisHash)
            await this.db.setBlockTip(genesisHash)
            if (this.txdb) {
                await this.txdb.putTxs(genesisHash, genesis.header.timeStamp, genesis.txs)
            }
            return genesis
        } catch (e) {
            logger.error(`Fail to initGenesisBlock : ${e}`)
            throw e
        }
    }
}
