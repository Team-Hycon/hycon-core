import { EventEmitter } from "events"
import * as fs from "fs"
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../common/address"
import { AsyncLock } from "../common/asyncLock"
import { AnyBlock, Block } from "../common/block"
import { GenesisBlock } from "../common/blockGenesis"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { DelayQueue } from "../common/delayQueue"
import { TxPool } from "../common/txPool"
import { SignedTx } from "../common/txSigned"
import { userOptions } from "../main"
import { MAX_HEADER_SIZE } from "../network/networkConstants"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { GhostConsensus } from "./consensusGhost"
import { JabiruConsensus } from "./consensusJabiru"
import { Account } from "./database/account"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { DBMined } from "./database/dbMined"
import { DBTx } from "./database/dbtx"
import { DeferredDatabaseChanges } from "./database/deferedDatabaseChanges"
import { IMinedDB, MinedDatabase } from "./database/minedDatabase"
import { TxDatabase } from "./database/txDatabase"
import { TxValidity, WorldState } from "./database/worldState"
import { strictAdd } from "./database/worldState"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"
import { IUncleCandidate, UncleManager, uncleReward } from "./uncleManager"

const logger = getLogger("Consensus")

const REBROADCAST_DIFFICULTY_TOLERANCE = 0.05

export const START_HEIGHT = 404540
export const TIMESTAMP_TOLERANCE = 120000
export interface IStatusChange { oldStatus?: BlockStatus, status?: BlockStatus, height?: number }
export interface IPutResult {
    oldStatus: BlockStatus,
    status?: BlockStatus,
    dbBlock?: DBBlock,
}

export class Consensus extends EventEmitter {
    public static async cryptonightHashNonce(preHash: Uint8Array, nonce: Long): Promise<Uint8Array> {
        const buffer = Buffer.allocUnsafe(72)
        buffer.fill(preHash, 0, 64)
        buffer.writeUInt32LE(nonce.getLowBitsUnsigned(), 64)
        buffer.writeUInt32LE(nonce.getHighBitsUnsigned(), 68)
        return Hash.hashCryptonight(buffer)
    }

    public static getTarget(p: number, height: number) {
        if (height <= this.lastGhostBlock) {
            return GhostConsensus.getTarget(p)
        }
        return JabiruConsensus.getTarget(p)
    }
    private static readonly lastGhostBlock = userOptions.jabiruHeight
    private txdb?: TxDatabase
    private minedDatabase: MinedDatabase
    private txPool: TxPool
    private worldState: WorldState
    private db: Database
    private blockTip: DBBlock
    private headerTip: DBBlock
    private lock: AsyncLock
    private futureBlockQueue: DelayQueue

    private seenBlocksSet: Set<string> = new Set<string>()
    private seenBlocks: string[] = []
    private blockBroadcastLock: AsyncLock = new AsyncLock()
    private pendingBlocksPreviousMap: Map<string, Array<{ hash: string, block: Block }>>
    private pendingBlocksHashes: Set<string>
    private pendingBlocks: Array<{ hash: string, previousHash: string }>
    private ghostConsensus: GhostConsensus
    private jabiruConsensus: JabiruConsensus

    private uncleManager: UncleManager

    constructor(txPool: TxPool, worldState: WorldState, dbPath: string, filePath: string, txPath?: string, minedDBPath?: string) {
        super()
        this.worldState = worldState
        this.txPool = txPool
        this.db = new Database(dbPath, filePath)
        if (txPath) { this.txdb = new TxDatabase(txPath) }
        if (minedDBPath) { this.minedDatabase = new MinedDatabase(minedDBPath) }
        this.futureBlockQueue = new DelayQueue(10)
        this.pendingBlocksPreviousMap = new Map<string, Array<{ hash: string, block: Block }>>()
        this.pendingBlocksHashes = new Set<string>()
        this.pendingBlocks = []
        this.uncleManager = new UncleManager(this)
        this.ghostConsensus = new GhostConsensus(this, this.db, this.uncleManager)
        this.jabiruConsensus = new JabiruConsensus(this, this.db, this.uncleManager)
    }
    public async init() {
        if (this.lock !== undefined) {
            throw new Error("Multiple calls to init")
        }
        this.lock = new AsyncLock(1)
        try {
            await this.db.init()
            this.blockTip = await this.db.getBlockTip()
            this.headerTip = await this.db.getHeaderTip()

            if (this.txdb !== undefined) {
                await this.txdb.init(this)
            }
            if (this.minedDatabase !== undefined) {
                await this.minedDatabase.init(this)
            }
            if (this.blockTip === undefined) {
                const exodusHash = Hash.decode("2RSAyaRbTr3NxEAZVvj7iJrAoKrm8ibs5MqUE1diVFpp")
                await this.initExodusBlock(userOptions.dataExodus, userOptions.dataExodusDB, exodusHash)
            }

            if (userOptions.bootstrap) {
                const candidateHeight = this.blockTip.height + 1
                const nextDifficulty = this.getNextDifficulty(candidateHeight, this.blockTip)
                const reward = this.getReward(candidateHeight)
                const hash = await this.db.getHashAtHeight(this.blockTip.height)
                this.emit("candidate", this.blockTip, hash, nextDifficulty, reward)
            }

            logger.info(`Initialization of consensus is over.`)
            await this.syncStatus()
        } catch (e) {
            logger.error(`Initialization failure in consensus: ${e}`)
            process.exit(1)
        } finally {
            this.lock.releaseLock()
        }
    }

    public minimumVersionNumber() {
        if (this.blockTip.height < Consensus.lastGhostBlock) {
            return 12
        }
        return 13
    }

    public getReward(height: number) {
        if (height <= Consensus.lastGhostBlock) {
            return GhostConsensus.BLOCK_REWARD
        } else {
            return JabiruConsensus.BLOCK_REWARD
        }
    }
    public async process(hash: Hash, header: BlockHeader, block?: Block): Promise<IPutResult> {
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

        const previousBlockHash = header.previousHash[0]
        const previousBlockStatus = await this.db.getBlockStatus(previousBlockHash)
        if (previousBlockStatus <= BlockStatus.Nothing) {
            return result
        }

        const previousDBBlock = await this.db.getDBBlock(previousBlockHash)
        if (previousDBBlock === undefined) {
            return result
        }
        const height = previousDBBlock.height + 1
        if (height <= Consensus.lastGhostBlock) {
            return this.ghostConsensus.process(result, previousDBBlock, previousBlockStatus, hash, header, block)
        } else {
            if (previousDBBlock.height === Consensus.lastGhostBlock) {
                previousDBBlock.blockWorkEMA = previousDBBlock.pEMA
                previousDBBlock.nextBlockDifficulty = previousDBBlock.nextDifficulty
            }
            return this.jabiruConsensus.process(result, previousDBBlock, previousBlockStatus, hash, header, block)
        }
    }

    public async processBlock(block: Block, hash: Hash, header: BlockHeader, previousDBBlock: DBBlock, result: IPutResult, minerReward: number, legacyTx: boolean, uncles?: IUncleCandidate[]): Promise<void> {
        // Consensus Critical
        const merkleRoot = Block.calculateMerkleRoot(block.txs)
        if (!merkleRoot.equals(header.merkleRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): Merkle root(${header.merkleRoot.toString()}) does not match calculated value(${merkleRoot.toString()})`)
            return
        }

        for (const tx of block.txs) {
            if (tx.verify(legacyTx)) {
                delete tx.transitionSignature
                delete tx.transitionRecovery
                continue
            }

            // TODO : Remove after Jabiru Fork
            if (tx.transitionSignature !== undefined && tx.transitionRecovery !== undefined) {
                tx.signature = tx.transitionSignature
                tx.recovery = tx.transitionRecovery
                if (tx.verify(legacyTx)) {
                    delete tx.transitionSignature
                    delete tx.transitionRecovery
                    continue
                }
            }

            logger.warn(`Rejecting block(${hash.toString()}): TX(${new Hash(tx).toString()}) signature is incorrect`)
            result.status = BlockStatus.InvalidBlock
            return
        }

        const height = previousDBBlock.height + 1
        const reward = await this.calculateBlockReward(result.dbBlock)
        const { stateTransition, validTxs, invalidTxs } = await this.worldState.next(previousDBBlock.header.stateRoot, block.header.miner, minerReward, block.txs, height, uncles)
        if (!stateTransition.currentStateRoot.equals(block.header.stateRoot)) {
            logger.warn(`Rejecting block(${hash.toString()}): stateRoot(${header.stateRoot}) does not match calculated value(${stateTransition.currentStateRoot})`)
            result.status = BlockStatus.InvalidBlock
            return
        }

        if (invalidTxs.length > 0 || validTxs.length !== block.txs.length) {
            logger.warn(`Rejecting block(${hash.toString()}): expected ${block.txs.length} transactions to be processed, but ${validTxs.length} were processed and ${invalidTxs.length} were rejected`)
            result.status = BlockStatus.InvalidBlock
            return
        }

        const { offset, fileNumber, length } = await this.db.writeBlock(block)
        await this.worldState.putPending(stateTransition.batch, stateTransition.mapAccount)
        result.dbBlock.offset = offset
        result.dbBlock.fileNumber = fileNumber
        result.dbBlock.length = length
        result.dbBlock.totalSupply = strictAdd(previousDBBlock.totalSupply, reward)
        result.status = BlockStatus.Block
        return
    }

    public getTargetTime(): number {
        if (!this.blockTip || this.blockTip.height <= Consensus.lastGhostBlock) {
            return GhostConsensus.TARGET_MEAN_TIME
        }
        return JabiruConsensus.TARGET_MEAN_TIME
    }

    public async putBlock(block: Block, rebroadcast?: () => void, ip?: string): Promise<IStatusChange> {
        const status = await this.put(block.header, block, rebroadcast, ip)
        if (status.status === undefined || status.status < BlockStatus.Nothing) {
            return status
        }

        const hash = new Hash(block.header).toString()
        const previousHash = block.header.previousHash[0].toString()

        if (status.status < BlockStatus.Block && !this.pendingBlocksHashes.has(hash)) {
            logger.debug(`PENDING: Block(${hash}) pended due to status(${status.status})`)
            this.pendingBlocks.push({ hash, previousHash })
            this.pendingBlocksHashes.add(hash)
            const previousHashString = block.header.previousHash[0].toString()
            if (this.pendingBlocksPreviousMap.has(previousHashString)) {
                const pendings = this.pendingBlocksPreviousMap.get(previousHashString)
                pendings.push({ hash, block })
                logger.debug(`PENDING: Block(${hash}) appended to pendingBlocksPreviousMap(${pendings.length})`)
            } else {
                this.pendingBlocksPreviousMap.set(previousHashString, [{ hash, block }])
                logger.debug(`PENDING: Block(${hash}) created entry in pendingBlocksPreviousMap`)
            }

            while (this.pendingBlocks.length > 50) {
                const [old] = this.pendingBlocks.splice(0, 1)
                logger.debug(`PENDING: Removing old pending Block(${old.hash})`)
                this.pendingBlocksHashes.delete(old.hash)
                const pendings = this.pendingBlocksPreviousMap.get(old.previousHash)
                if (pendings !== undefined && pendings.length > 1) {
                    const newPendings = pendings.filter((pending) => pending.hash !== hash)
                    logger.debug(`PENDING: Filtering pending map(${pendings.length}) from Block(${old.previousHash}) to Block(${old.hash}), new length is ${newPendings.length} map size is ${this.pendingBlocksPreviousMap.size}`)
                    this.pendingBlocksPreviousMap.set(previousHash, newPendings)
                } else {
                    this.pendingBlocksPreviousMap.delete(previousHash)
                    logger.debug(`PENDING: Removing previousMap entry from Block(${old.previousHash}) to Block(${old.hash}), map size is ${this.pendingBlocksPreviousMap.size}`)

                }
            }
        }

        if (status.status >= BlockStatus.Block) {
            const pendings = this.pendingBlocksPreviousMap.get(hash)
            if (pendings !== undefined) {
                for (const pending of pendings) {
                    logger.debug(`PENDING: Will attempt to proccess Block(${pending.hash}) which was waiting for Block(${hash})`)
                    setImmediate(() => this.putBlock(pending.block))
                }
                this.pendingBlocksPreviousMap.delete(hash)
            }
        }

        return status
    }

    public putHeader(header: BlockHeader): Promise<IStatusChange> {
        return this.put(header)
    }

    public async putTxBlocks(txBlocks: Array<{ hash: Hash, txs: SignedTx[] }>) {
        const statusChanges: IStatusChange[] = []
        for (const txBlock of txBlocks) {
            const header = await this.getHeaderByHash(txBlock.hash)
            if (!(header instanceof BlockHeader)) { continue }
            const block = new Block({ header, txs: txBlock.txs })
            await this.upgradeHeaders(header)
            statusChanges.push(await this.putBlock(block))
        }
        try {
            if (this.headerTip.header instanceof BlockHeader) {
                await this.upgradeHeaders(this.headerTip.header)
            }
        } catch (e) {
            logger.debug(`Failed to upgrade to header tip: ${e}`)
        }
        return statusChanges
    }

    public async getBlockTxs(hash: Hash) {
        const block = (await this.getBlockByHash(hash))
        if (!(block instanceof Block)) {
            throw new Error(`Tried to get txs from genesis block`)
        }
        return { hash, txs: block.txs }
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

    public async getHeadersChainRange(fromHeight: number, count?: number): Promise<AnyBlockHeader[]> {
        try {
            if (count === undefined) {
                this.headerTip.height >= fromHeight ? count = this.headerTip.height - fromHeight + 1 : count = 0
            }
            const dbblocks = await this.db.getDBBlocksChainRange(fromHeight, count)
            return dbblocks.map((dbblock) => dbblock.header)
        } catch (e) {
            logger.error(`getHeadersChainRange failed\n${e}`)
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

    public getTxsInBlock(blockHash: string, count?: number): Promise<{ txs: DBTx[], amount: string, fee: string, length: number }> {
        if (this.txdb === undefined) {
            throw new Error(`The database to get txs does not exist.`)
        }
        const result: DBTx[] = []
        const idx: number = 0
        return this.txdb.getTxsInBlock(blockHash, result, idx, count)
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

    public async getNextTxsInBlock(blockHash: string, txHash: string, index: number, count?: number): Promise<DBTx[]> {
        try {
            if (this.txdb) {
                const result: DBTx[] = []
                return await this.txdb.getNextTxsInBlock(blockHash, txHash, result, index, count)
            } else {
                return Promise.reject(`The database to get txs does not exist.`)
            }
        } catch (e) {
            logger.error(`Fail to getNextTxs : ${e}`)
            return e
        }
    }

    public async getMinedBlocks(address: Address, count?: number, index?: number, blockHash?: string): Promise<DBMined[]> {
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
    public getMinedInfo(blockHash: string): Promise<DBMined | undefined> {
        if (!this.minedDatabase) { return undefined }
        return this.minedDatabase.getMinedInfo(blockHash)
    }

    public getBlockStatus(hash?: Hash): Promise<BlockStatus> {
        if (hash === undefined) {
            return Promise.resolve(BlockStatus.Nothing)
        }
        return this.db.getBlockStatus(hash)
    }

    public getBlocksTip(): { hash: Hash; height: number, totalwork: number } {
        if (this.blockTip === undefined) {
            return undefined
        }
        return { hash: new Hash(this.blockTip.header), height: this.blockTip.height, totalwork: this.blockTip.totalWork }
    }

    public getCurrentDiff(): number {
        return this.blockTip.header.difficulty
    }
    public getHeadersTip(): { hash: Hash; height: number, totalwork: number } {
        return { hash: new Hash(this.headerTip.header), height: this.headerTip.height, totalwork: this.headerTip.totalWork }
    }

    public getHtip() {
        return this.headerTip
    }

    public getBtip() {
        return this.blockTip
    }

    public async txValidity(tx: SignedTx): Promise<TxValidity> {
        return this.lock.critical(async () => {
            const legacyTx = this.getLegacyTx()
            if (!tx.verify(legacyTx)) {
                if (tx.transitionSignature === undefined || tx.transitionRecovery === undefined) {
                    return TxValidity.Invalid
                }
                tx.signature = tx.transitionSignature
                tx.recovery = tx.transitionRecovery
                if (!tx.verify(legacyTx)) { return TxValidity.Invalid }
            }

            const validity = await this.worldState.validateTx(this.blockTip.header.stateRoot, tx)
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

    public async getBurnAmount(): Promise<{ amount: Long }> {
        return this.txdb.getBurnAmount()
    }

    public async isUncleBlock(hash: Hash): Promise<boolean> {
        const dbblock = await this.db.getDBBlock(hash)
        if (dbblock === undefined) { return false }
        return dbblock.uncle
    }

    public getLegacyTx(): boolean {
        return this.blockTip.height < Consensus.lastGhostBlock
    }

    public async findMainChainHash(hash: Hash): Promise<Hash> {
        let status: BlockStatus
        if (hash !== undefined) {
            status = await this.getBlockStatus(hash)
            while (status !== BlockStatus.MainChain) {
                const header = await this.getHeaderByHash(hash)
                if (header instanceof BlockHeader) {
                    hash = header.previousHash[0]
                } else { break }
                status = await this.getBlockStatus(hash)
            }
        } else {
            hash = await this.getHash(START_HEIGHT)
        }
        return hash
    }

    private async put(header: BlockHeader, block?: Block, rebroadcast?: () => void, ip?: string): Promise<IStatusChange> {
        try {
            const hash = new Hash(header)
            if (header.merkleRoot.equals(Hash.emptyHash)) {
                // Block contains no transactions, create a new empty block
                block = new Block({ header, txs: [] })
            }

            if (block !== undefined) {
                if (await this.blockBroadcastCondition(block, hash)) {
                    if (rebroadcast === undefined) {
                        this.emit("blockBroadcast", block)
                        logger.info(`Broadcasting Block(${new Hash(block.header).toString()})`)
                    } else {
                        rebroadcast()
                        logger.info(`Rebroadcasting Block(${new Hash(block.header).toString()}) from ${ip}`)
                    }
                }
            }

            if (header.timeStamp > Date.now() + TIMESTAMP_TOLERANCE) {
                if (this.futureBlockQueue.size() >= 10) {
                    logger.warn(`Please check your system clock`)
                }
                await this.futureBlockQueue.waitUntil(header.timeStamp - TIMESTAMP_TOLERANCE)
            }
            return this.lock.critical(async () => {
                const { oldStatus, status, dbBlock } = await this.process(hash, header, block)

                if (status !== undefined && oldStatus !== status) {
                    await this.db.setBlockStatus(hash, status)
                }

                if (dbBlock === undefined || status < BlockStatus.Header) {
                    return { oldStatus, status }
                }

                await this.db.putDBBlock(hash, dbBlock)

                if (this.headerTip === undefined || (this.forkChoice(dbBlock, this.headerTip))) {
                    this.headerTip = dbBlock
                    await this.db.setHeaderTip(hash)
                }

                const timeDelta = Date.now() - header.timeStamp
                if (status < BlockStatus.Block) {
                    if (timeDelta < TIMESTAMP_TOLERANCE) {
                        logger.info(`Processed ${block !== undefined ? "BHeader" : "Header "}`
                            + ` ${hash}\t(${dbBlock.height}, ${dbBlock.totalWork.toExponential(3)}),`
                            + `\tBTip(${this.blockTip.height}, ${this.blockTip.totalWork.toExponential(3)}),`
                            + `\tHTip(${this.headerTip.height}, ${this.headerTip.totalWork.toExponential(3)})`)
                    }
                    return { oldStatus, status, height: dbBlock.height }
                }

                if (block !== undefined) {
                    if (this.blockTip === undefined || this.forkChoice(dbBlock, this.blockTip)) {
                        const reorganized = await this.reorganize(hash, block, dbBlock)
                        if (reorganized) {
                            this.blockTip = dbBlock
                            const candidateHeight = dbBlock.height + 1
                            const nextDifficulty = this.getNextDifficulty(candidateHeight, dbBlock)
                            const reward = this.getReward(candidateHeight)
                            let candidateUncles: IUncleCandidate[]
                            candidateUncles = await this.uncleManager.getUncleCandidates(candidateHeight, hash)
                            if (candidateUncles.length > 0) {
                                logger.debug(`Emitting candidate with ${candidateUncles.length} uncles`)
                            }
                            if (this.blockTip.height === Consensus.lastGhostBlock) {
                                setImmediate(() => { this.txPool.transition() })
                            }
                            this.emit("candidate", this.blockTip, hash, nextDifficulty, reward, candidateUncles)
                        }
                    }
                }

                if (timeDelta < TIMESTAMP_TOLERANCE) {
                    logger.info(`Processed Block(${hash})`
                        + `\t(${dbBlock.height}, ${dbBlock.totalWork.toExponential(3)}),`
                        + `\tUncles: ${(dbBlock.header as BlockHeader).previousHash.length - 1}`
                        + `\tBTip(${this.blockTip.height}, ${this.blockTip.totalWork.toExponential(3)}),`
                        + `\tHTip(${this.headerTip.height}, ${this.headerTip.totalWork.toExponential(3)})`)
                }

                return { oldStatus, status, height: dbBlock.height }
            })
        } catch (e) {
            logger.warn(`Put error: ${e}`)
        }
    }

    private async reorganize(newBlockHash: Hash, newBlock: Block, newDBBlock: DBBlock): Promise<boolean> {
        // Consensus Critical
        const deferredDB = new DeferredDatabaseChanges(this.db)
        const newBlockHashes = [] as Hash[]
        const newBlocks = [] as Block[]
        let popStopHeight = newDBBlock.height
        let hash = newBlockHash
        let block = newBlock
        let pushDBblock = newDBBlock
        while (popStopHeight > 0) {
            newBlockHashes.push(hash)
            newBlocks.push(block)

            const blockReward = await this.calculateBlockReward(pushDBblock, deferredDB)

            hash = block.header.previousHash[0]
            if (await this.db.getBlockStatus(hash) === BlockStatus.MainChain) {
                break
            }
            pushDBblock = await this.db.getDBBlock(hash)
            const tmpBlock = await this.db.dbBlockToBlock(pushDBblock)
            if (!(tmpBlock instanceof Block)) {
                logger.error(`Error trying to reorganize past the genesis block`)
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
            const popDBblock = await this.db.getDBBlock(popHash)
            const popBlock = await this.db.dbBlockToBlock(popDBblock)
            if (!(popBlock instanceof Block)) {
                logger.error(`Error trying to reorganize past the genesis block 2`)
                throw new Error("Error trying to reorganize past the genesis block")
            }
            deferredDB.setBlockStatus(popHash, BlockStatus.Block)
            const uncleHashes = popBlock.header.previousHash.slice(1)
            for (const uncleHash of uncleHashes) { await deferredDB.setUncle(uncleHash, false) }
            for (const tx of popBlock.txs) { popTxs.push(tx) }
            const blockReward = await this.calculateBlockReward(popDBblock, deferredDB)
            popHash = popBlock.header.previousHash[0]
            popHeight -= 1
        }

        if (newBlocks.length !== newBlockHashes.length) {
            logger.error(`Error trying to reorganize`)
            throw new Error("Error during reorganization")
        }

        let pushHeight = popStopHeight
        const removeTxs = [] as SignedTx[]
        let minedBlockChange = [] as IMinedDB[]
        let validUncles = true
        while (newBlockHashes.length > 0) {
            hash = newBlockHashes.pop()
            block = newBlocks.pop()
            if (validUncles) {
                const uncleHashes = block.header.previousHash.slice(1)
                const validate = await this.uncleManager.validateUncles(deferredDB, uncleHashes, pushHeight, minedBlockChange)
                if (!validate) {
                    deferredDB.revert()
                    minedBlockChange = []
                    validUncles = false
                }
            }

            let blockStatus: BlockStatus
            if (validUncles) {
                blockStatus = BlockStatus.MainChain
                deferredDB.setHashAtHeight(pushHeight, hash)
                for (const tx of block.txs) { removeTxs.push(tx) }
                this.emit("block", block)
            } else {
                // Invalid uncles - Abort Reorganization, mark block and subsequent Blocks statuses as invalid
                logger.warn(`block(${hash.toString()}) Marked as invalid during reorganization`)
                blockStatus = BlockStatus.InvalidBlock
            }
            deferredDB.setBlockStatus(hash, blockStatus)
            pushHeight += 1
        }

        if (validUncles) {
            await this.uncleManager.updateUncleCandidates(deferredDB, newDBBlock.height)
            deferredDB.setBlockTip(newBlockHash)
            this.emit("txs", popTxs)
            // This must not use await because of lock. So we used then.
            this.txPool.putTxs(popTxs).then(() => this.txPool.removeTxs(removeTxs))
        }
        await deferredDB.commit()
        return validUncles
    }

    private async upgradeHeaders(header: BlockHeader) {
        logger.debug(`Upgrading headers up to hash: ${new Hash(header).toString()}`)
        const upgradeQueue: BlockHeader[] = []
        const maxLength = Math.floor((100 * 1024 * 1024) / MAX_HEADER_SIZE) // 100MB of headers
        let status: BlockStatus
        const results: IStatusChange[] = []
        do {
            status = await this.getBlockStatus(header.previousHash[0])
            if (status >= BlockStatus.Block) { break }
            logger.debug(header.previousHash[0].toString())
            const previousHeader = await this.getHeaderByHash(header.previousHash[0])
            if (!(previousHeader instanceof BlockHeader)) {
                // Header is genesis header
                break
            }
            if (!previousHeader.merkleRoot.equals(Hash.emptyHash)) {
                throw new Error(`Header merkleRoot is not empty`)
            }
            header = previousHeader
            upgradeQueue.push(header)
            if (upgradeQueue.length > maxLength) {
                upgradeQueue.shift()
            }
        } while (status < BlockStatus.Block)
        upgradeQueue.reverse()
        for (const blockHeader of upgradeQueue) {
            results.push(await this.putHeader(blockHeader))
        }
        return results
    }

    private forkChoice(newDBBlock: DBBlock, tip: DBBlock): boolean {
        return newDBBlock.totalWork > tip.totalWork
    }

    private async initExodusBlock(blockPath: string, blockDBPath: string, blockHash?: Hash): Promise<GenesisBlock> {
        try {
            const exodusDBBuffer = fs.readFileSync(blockDBPath)
            const exodusDBProto = proto.BlockDB.decode(exodusDBBuffer)
            const exodusDB = new DBBlock(exodusDBProto)

            const exodusBlockBuffer = fs.readFileSync(blockPath)
            const exodusProto = proto.GenesisBlock.decode(exodusBlockBuffer)
            exodusProto.header = exodusDB.header

            if (userOptions.networkid !== "hycon") {
                logger.info(`Using networkid: ${userOptions.networkid}`)
                exodusProto.header.difficulty = 0.0001
                exodusDB.nextDifficulty = 0.0001
                exodusDB.nextBlockDifficulty = 0.0001
                exodusDB.pEMA = 10000
                exodusDB.tEMA = GhostConsensus.TARGET_MEAN_TIME
            }

            const exodus = new GenesisBlock(exodusProto)

            const { stateRoot, batch, mapAccount } = await this.worldState.initialize(exodusProto)
            if (!stateRoot.equals(exodusDB.header.stateRoot)) {
                throw new Error(`Exodus Block computed state root(${stateRoot}) differs from expected root(${exodusDB.header.stateRoot})`)
            }
            await this.worldState.putPending(batch, mapAccount)

            const { fileNumber, length, offset } = await this.db.writeBlock(exodus)
            let totalSupply: Long = Long.UZERO
            for (const tx of exodus.txs) {
                totalSupply = strictAdd(totalSupply, tx.amount)
            }

            exodusDB.fileNumber = fileNumber
            exodusDB.length = length
            exodusDB.offset = offset
            exodusDB.totalSupply = totalSupply

            if (blockHash === undefined) {
                blockHash = new Hash(exodus.header)
            }
            const realHash = new Hash(exodus.header)

            await this.db.putDBBlock(blockHash, exodusDB)
            await this.db.putDBBlock(realHash, exodusDB)

            this.blockTip = this.headerTip = exodusDB
            await this.db.setBlockStatus(blockHash, BlockStatus.MainChain)
            await this.db.setBlockStatus(realHash, BlockStatus.MainChain)
            await this.db.setHashAtHeight(START_HEIGHT, blockHash)
            await this.db.setHeaderTip(blockHash)
            await this.db.setBlockTip(blockHash)
            return exodus
        } catch (e) {
            logger.error(`Failed to initialize Exodus block: ${e}`)
            throw e
        }
    }

    private async blockBroadcastCondition(block: Block, hash: Hash) {
        const hashString = hash.toString()
        return this.blockBroadcastLock.critical(async () => {
            const timeDelta = Math.abs(block.header.timeStamp - Date.now())
            if (timeDelta > TIMESTAMP_TOLERANCE) {
                return false
            }
            if (this.seenBlocksSet.has(hashString)) {
                return false
            }

            const merkleRoot = Block.calculateMerkleRoot(block.txs)
            if (!block.header.merkleRoot.equals(merkleRoot)) {
                return false
            }

            const status = await this.getBlockStatus(hash)
            if (status < BlockStatus.Nothing || status >= BlockStatus.Block) {
                return false
            }

            const proximalDifficulty = this.getHtip().header.difficulty * (1 + REBROADCAST_DIFFICULTY_TOLERANCE)
            const prehash = block.header.preHash()
            const proximalHeight = this.getHtip().height

            const cryptonightHash = await Consensus.cryptonightHashNonce(prehash, block.header.nonce)

            const ghostTarget = GhostConsensus.getTarget(proximalDifficulty)
            const jabiruTarget = JabiruConsensus.getTarget(proximalDifficulty)

            if (proximalHeight < Consensus.lastGhostBlock) {
                if (!DifficultyAdjuster.acceptable(cryptonightHash, ghostTarget)) { return false }
            } else {
                if (!DifficultyAdjuster.acceptable(cryptonightHash, jabiruTarget)) { return false }
            }

            this.seenBlocksSet.add(hashString)
            if (this.seenBlocks.length > 1000) {
                const [old] = this.seenBlocks.splice(0, 1)
                this.seenBlocksSet.delete(old)
            }
            this.seenBlocks.push(hashString)

            return true
        })
    }

    private async syncStatus() {
        const epoch = (await this.getBlockAtHeight(START_HEIGHT)).header.timeStamp
        const now = Date.now()
        const duration = now - epoch

        if (this.headerTip.header.timeStamp > now + TIMESTAMP_TOLERANCE || now < epoch) {
            logger.warn(`Please check your system clock`)
        }
        if (this.blockTip.header.timeStamp < now - 1000 * 60 * 5) {
            const blockDelta = Math.max(this.blockTip.header.timeStamp - epoch, 0)
            const blockProgress = 100 * blockDelta / duration
            const blockRemaining = Math.round((now - this.blockTip.header.timeStamp) / this.getTargetTime())

            logger.info(`Syncing blocks  ${blockProgress.toFixed(3)}% complete approximately ${blockRemaining} remaining`)
        }

        if (this.headerTip.header.timeStamp < now - 1000 * 60 * 5) {
            const headerDelta = Math.max(this.headerTip.header.timeStamp - epoch, 0)
            const headerProgress = 100 * headerDelta / duration
            const headersRemaining = Math.round((now - this.headerTip.header.timeStamp) / this.getTargetTime())

            logger.info(`Syncing headers ${headerProgress.toFixed(3)}% complete approximately ${headersRemaining} remaining`)
        }
        setTimeout(async () => await this.syncStatus(), 10000)
    }

    private async calculateBlockReward(dbBlock: DBBlock, deferredDB?: DeferredDatabaseChanges): Promise<Long> {
        const reward: number = this.getReward(dbBlock.height)
        let totalReward: Long = Long.fromNumber(reward, true)

        const previousHashs: Hash[] = (dbBlock.header as BlockHeader).previousHash.slice(1)

        for (const prevHash of previousHashs) {
            let prevDBBlock: DBBlock
            if (deferredDB === undefined) {
                prevDBBlock = await this.db.getDBBlock(prevHash)
            } else {
                prevDBBlock = await deferredDB.getDBBlock(prevHash)
            }
            totalReward = strictAdd(totalReward, uncleReward(reward, dbBlock.height - prevDBBlock.height))
        }
        return totalReward
    }

    private getNextDifficulty(height: number, dbBlock: DBBlock) {
        if (height <= Consensus.lastGhostBlock + 1) {
            return dbBlock.nextDifficulty
        } else {
            return dbBlock.nextBlockDifficulty
        }
    }
}
