
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../common/address"
import { AsyncLock } from "../common/asyncLock"
import { Block } from "../common/block"
import { BlockHeader } from "../common/blockHeader"
import { Hash } from "../util/hash"
import { Consensus, IPutResult } from "./consensus"
import { Database } from "./database/database"
import { DBBlock } from "./database/dbblock"
import { DeferredDatabaseChanges } from "./database/deferedDatabaseChanges"
import { IMinedDB } from "./database/minedDatabase"
import { DifficultyAdjuster } from "./difficultyAdjuster"
import { BlockStatus } from "./sync"

const logger = getLogger("Ghost Consensus")

const uncleRewardR = 75 / 100
const uncleRewardA = 0.9 / uncleRewardR
export const maxUncleHeightDelta = 10
export const maxNumberOfUncles = 10
const recentHeaderTrackingRange = 2 * maxUncleHeightDelta

export function uncleReward(minerReward: number, heightDelta: number) {
    const factor = uncleRewardA * Math.pow(uncleRewardR, heightDelta)
    return Long.fromNumber(factor * minerReward, true)
}

const emaAlpha = 0.01
function EMA(x: number, previousEMA: number) {
    return emaAlpha * x + (1 - emaAlpha) * previousEMA
}
function EMA_Adjust(x: number, depth: number, previousEMA: number) {
    return previousEMA + emaAlpha * Math.pow(1 - emaAlpha, depth) * x
}

export interface IUncleCandidate {
    hash: Hash,
    height: number,
    miner: Address,
}
export class GhostConsensus {
    public static async checkNonce(preHash: Uint8Array, nonce: Long, difficulty: number): Promise<boolean> {
        // Consensus Critical
        const hash = await Consensus.cryptonightHashNonce(preHash, nonce)
        const target = this.getTarget(difficulty)
        return DifficultyAdjuster.acceptable(hash, target)
    }

    public static getTarget(p: number, length: number = 32) {
        // Consensus Critical
        if (p > 1) {
            logger.warn(`Difficulty(${p.toExponential()}) is too low, anything is possible. (　＾∇＾)`)
            p = 1
        }
        if (p < Math.pow(0x100, -length)) {
            logger.warn(`Difficulty(${p.toExponential()}) is too high, give up now. (╯°□°）╯︵ ┻━┻`)
            p = Math.pow(0x100, -length)
        }
        const target = Buffer.allocUnsafe(length)
        let carry = p
        for (let i = target.length - 1; i >= 0; i--) {
            carry *= 0x100
            target[i] = Math.floor(carry)
            carry -= target[i]
        }
        for (let i = 0; i < target.length; i++) {
            target[i]--
            if (target[i] !== 0xFF) {
                break
            }
        }
        return target
    }
    private consensus: Consensus
    private db: Database
    private readonly targetTime: number
    private candidateLock: AsyncLock
    private recentHeaders: Map<number, IUncleCandidate[]>
    private uncleCandidates: Map<number, Map<string, IUncleCandidate>>

    constructor(consensus: Consensus, db: Database, targetTime: number = 15000 / Math.LN2) {
        this.consensus = consensus
        this.db = db
        this.targetTime = targetTime
        this.recentHeaders = new Map<number, IUncleCandidate[]>()
        this.uncleCandidates = new Map<number, Map<string, IUncleCandidate>>()
        this.candidateLock = new AsyncLock()
    }
    public getTargetTime(): number {
        return this.targetTime
    }

    public async process(result: IPutResult, previousDBBlock: DBBlock, previousBlockStatus: BlockStatus, hash: Hash, header: BlockHeader, block?: Block): Promise<IPutResult> {
        // Consensus Critical
        if (result.oldStatus === BlockStatus.Nothing) {
            await this.processHeader(previousDBBlock, previousBlockStatus, header, hash, result)
            if (result.status === BlockStatus.Rejected) {
                return result
            }
        }

        if (block === undefined || previousBlockStatus < BlockStatus.Block) {
            return result
        }

        if (result.oldStatus >= BlockStatus.Nothing && result.oldStatus <= BlockStatus.Header) {
            if (result.dbBlock === undefined) { result.dbBlock = await this.db.getDBBlock(hash) }
            await this.processBlock(block, hash, header, previousDBBlock, result)
            if (result.status !== BlockStatus.Block) {
                return result
            }
        }
        return result
    }

    public async validateUncles(deferredDB: DeferredDatabaseChanges, uncleHashes: Hash[], height: number, minedUncleChange: IMinedDB[]) {
        const uncleStatusPromises = uncleHashes.map((hash) => deferredDB.getBlockStatus(hash))
        const uncleStatuses = await Promise.all(uncleStatusPromises)
        for (const uncleStatus of uncleStatuses) {
            switch (uncleStatus) {
                case BlockStatus.InvalidBlock:
                case BlockStatus.Header:
                case BlockStatus.Block:
                    // Status Ok
                    break
                case BlockStatus.Nothing:
                    logger.fatal(`Accepted block with missing uncles`)
                    return false
                case BlockStatus.Rejected:
                    logger.fatal(`Accepted block with rejected uncles`)
                    return false
                case BlockStatus.MainChain:
                    // Not Ok - Abort Reorganization, mark block and subBlocks statuses as invalid
                    logger.error(`Uncle Error - MainChain uncle`)
                    return false
            }
        }

        const missingHashes = [] as Hash[]
        const uncleValidPreviousPromises = uncleHashes.map(async (uncleHash) => {
            // TODO: Optimize to remove potential double getDBBlock
            const dbblock = await deferredDB.getDBBlock(uncleHash)
            if (dbblock === undefined) {
                logger.error(`Uncle Error - ${uncleHash.toString()} could not be found`)
                missingHashes.push(uncleHash)
                return false
            }
            if (dbblock.uncle) {
                logger.error(`Uncle Error - ${uncleHash.toString()} is already an uncle`)
                return false
            }
            if (!(dbblock.header instanceof BlockHeader)) {
                logger.error(`Uncle Error - ${uncleHash.toString()} seems to be a gensis block`)
                return false
            }

            const unclePreviousHash = dbblock.header.previousHash[0]
            const previousBlockStatus = await deferredDB.getBlockStatus(unclePreviousHash)
            if (previousBlockStatus !== BlockStatus.MainChain) {
                logger.error(`Uncle Error - ${uncleHash.toString()} previous block status: ${previousBlockStatus}`)
                return false
            }

            await deferredDB.setUncle(uncleHash, true)
            minedUncleChange.push({
                blockhash: uncleHash,
                blocktime: dbblock.header.timeStamp,
                miner: (dbblock.header as BlockHeader).miner,
                reward: uncleReward(120e9, height - dbblock.height),
            })
            return true
        })
        const uncleValidPrevious = await Promise.all(uncleValidPreviousPromises)
        if (missingHashes.length > 0) {
            // If this error occurs block status and dbblock are inconsistant
            logger.fatal("Unexpected missing hashes during reorganization")
            this.consensus.emit("missingUncles", height, missingHashes)
            return false
        }

        return uncleValidPrevious.every((valid) => valid)
    }

    public async updateUncleCandidates(deferredDB: DeferredDatabaseChanges, tipHeight: number) {
        return this.candidateLock.critical(async () => {
            // TODO: Optimize
            this.uncleCandidates.clear()
            for (const [height, recentHeaders] of this.recentHeaders) {
                if (Math.abs(tipHeight - height) > recentHeaderTrackingRange) {
                    this.uncleCandidates.delete(height)
                    continue
                }
                let uncleCandidatesAtHeight = this.uncleCandidates.get(height)
                if (uncleCandidatesAtHeight === undefined) {
                    uncleCandidatesAtHeight = new Map<string, IUncleCandidate>()
                }

                const dbblockPromises = recentHeaders.map(async (candidate) => {
                    const status = await deferredDB.getBlockStatus(candidate.hash)
                    switch (status) {
                        case BlockStatus.Nothing:
                        case BlockStatus.Rejected:
                        case BlockStatus.MainChain:
                            return
                    }
                    const dbblock = await deferredDB.getDBBlock(candidate.hash)
                    if (dbblock === undefined) {
                        logger.warn(`Uncle candidate(${candidate.hash}) could not be found`)
                        return
                    }
                    if (dbblock.uncle) { return }
                    if (!(dbblock.header instanceof BlockHeader)) { return }
                    const previousStatus = await deferredDB.getBlockStatus(dbblock.header.previousHash[0])
                    if (previousStatus !== BlockStatus.MainChain) { return }
                    uncleCandidatesAtHeight.set(candidate.hash.toString(), candidate)
                })
                const dbblocks = await Promise.all(dbblockPromises)

                if (uncleCandidatesAtHeight.size > 0) {
                    this.uncleCandidates.set(height, uncleCandidatesAtHeight)
                }
            }
        })
    }

    public async getUncleCandidates(candidateHeight: number, previousHash: Hash): Promise<IUncleCandidate[]> {
        return this.candidateLock.critical(async () => {
            const candidates = [] as IUncleCandidate[]
            const startHeight = candidateHeight - maxUncleHeightDelta
            for (let i = startHeight; candidates.length < maxNumberOfUncles && i < candidateHeight; i++) {
                const candidateAtHeight = this.uncleCandidates.get(i)
                if (candidateAtHeight === undefined) { continue }
                for (const [hash, uncleCandidate] of candidateAtHeight) {
                    if (!previousHash.equals(uncleCandidate.hash)) {
                        candidates.push(uncleCandidate)
                        if (candidates.length >= maxNumberOfUncles) { break }
                    }
                }
            }
            return candidates
        })
    }

    private async processHeader(previousDBBlock: DBBlock, previousBlockStatus: BlockStatus, header: BlockHeader, hash: Hash, result: IPutResult): Promise<void> {
        // Consensus Critical
        if (header.timeStamp < previousDBBlock.header.timeStamp + 50) {
            result.status = BlockStatus.Rejected
            return
        }

        if (header.previousHash.length > maxNumberOfUncles + 1) {
            logger.warn(`Rejecting header(${hash.toString()}): Header has too many uncles(${header.previousHash.length - 1}) the maximum is ${maxNumberOfUncles}`)
            result.status = BlockStatus.Rejected
            return
        }

        if (previousDBBlock.nextDifficulty !== header.difficulty) {
            logger.warn(`Rejecting header(${hash.toString()}): Difficulty(${header.difficulty}) does not match calculated value(${previousDBBlock.nextDifficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const preHash = header.preHash()
        const nonceCheck = await GhostConsensus.checkNonce(preHash, header.nonce, header.difficulty)
        if (!nonceCheck) {
            logger.warn(`Rejecting header(${hash.toString()}): Hash does not meet difficulty(${header.difficulty})`)
            result.status = BlockStatus.Rejected
            return
        }

        const height = previousDBBlock.height + 1

        await this.candidateLock.critical(async () => {
            if (Math.abs(height - this.consensus.getBtip().height) < recentHeaderTrackingRange) {
                let headersAtHeight = this.recentHeaders.get(height)
                if (headersAtHeight === undefined) {
                    headersAtHeight = []
                    this.recentHeaders.set(height, headersAtHeight)
                }
                headersAtHeight.push({ hash, height, miner: header.miner })
            }
        })

        const work = 1 / previousDBBlock.nextDifficulty
        const workEMA = EMA(work, previousDBBlock.pEMA)
        const totalWork = previousDBBlock.totalWork + work

        const timeDelta = previousDBBlock.height > 0 ? header.timeStamp - previousDBBlock.header.timeStamp : this.targetTime
        const tEMA = EMA(timeDelta, previousDBBlock.tEMA)

        const hashesPerSecond = workEMA / tEMA
        const nextBlockTargetHashes = hashesPerSecond * this.targetTime
        const nextDifficulty = 1 / nextBlockTargetHashes

        result.dbBlock = new DBBlock({ header, height, tEMA, pEMA: workEMA, nextDifficulty, totalWork })
        result.status = BlockStatus.Header
        return
    }

    private async processUncles(header: BlockHeader, previousDBBlock: DBBlock, result: IPutResult) {
        const blockHash = new Hash(header)
        const uncleHashes = header.previousHash.slice(1)
        const uncleHashStrings = new Set<string>()
        const uncleStatusPromises = [] as Array<Promise<{ status: BlockStatus, hash: Hash }>>
        for (const uncleHash of uncleHashes) {
            const uncleHashString = uncleHash.toString()
            if (uncleHashStrings.has(uncleHashString)) {
                continue
            }
            uncleHashStrings.add(uncleHashString)
            const unclePromise = this.db.getBlockStatus(uncleHash).then((status) => ({ status, hash: uncleHash }))
            uncleStatusPromises.push(unclePromise)
        }
        const uncleStatuses = await Promise.all(uncleStatusPromises)
        const missingHashes = [] as Hash[]
        let invalidUncle = false
        for (const uncle of uncleStatuses) {
            switch (uncle.status) {
                case BlockStatus.InvalidBlock: // Header Ok, only block/uncles failed validation
                case BlockStatus.Header: // Ok
                case BlockStatus.Block: // Ok
                case BlockStatus.MainChain: // Not Ok, but may change during reorganization
                    continue
                case BlockStatus.Nothing: // Not Ok, Can not calculate the totalWork
                    missingHashes.push(uncle.hash)
                    invalidUncle = true
                    logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) status is missing`)
                    break
                case BlockStatus.Rejected: // Not Ok
                    logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) status is rejected`)
                    invalidUncle = true
                    result.status = BlockStatus.InvalidBlock
                    break
            }
        }

        if (missingHashes.length > 0) {
            this.consensus.emit("missingUncles", previousDBBlock.height + 1, missingHashes)
            return
        }
        if (invalidUncle) {
            return
        }
        const unclePromises = uncleStatuses.map((uncle) =>
            this.db.getDBBlock(uncle.hash).then((uncleDBBlock) => ({
                dbblock: uncleDBBlock,
                hash: uncle.hash,
                status: uncle.status,
            })),
        )
        const uncles = await Promise.all(unclePromises)

        let totalWorkAdjustment = 0
        const candidates = [] as IUncleCandidate[]
        for (const uncle of uncles) {
            const heightDelta = result.dbBlock.height - uncle.dbblock.height
            if (heightDelta > maxUncleHeightDelta || !(uncle.dbblock.header instanceof BlockHeader)) {
                logger.warn(`Block(${blockHash})'s Uncle(${uncle.hash}) heightDelta is too large ${heightDelta}`)
                result.status = BlockStatus.InvalidBlock
                return
            }
            const uncleWork = 1 / uncle.dbblock.header.difficulty
            totalWorkAdjustment += uncleWork
            candidates.push({ hash: uncle.hash, height: uncle.dbblock.height, miner: uncle.dbblock.header.miner })
        }
        logger.debug(`Block ${result.dbBlock.height}: ${result.dbBlock.pEMA.toFixed(1)} H / ${(result.dbBlock.tEMA / 1000).toFixed(1)}s = ${(result.dbBlock.pEMA * 1000 / result.dbBlock.tEMA).toFixed(1)}H/s`)
        return { totalWorkAdjustment, candidates }
    }

    private async processBlock(block: Block, hash: Hash, header: BlockHeader, previousDBBlock: DBBlock, result: IPutResult): Promise<void> {
        // Consensus Critical
        const height = previousDBBlock.height + 1
        const uncles = await this.processUncles(header, previousDBBlock, result)
        if (!uncles) {
            return
        }

        await this.consensus.processBlock(block, hash, header, previousDBBlock, result, 120e9, uncles.candidates)
        if (result.status !== BlockStatus.Block) {
            return
        }
        result.dbBlock.totalWork += uncles.totalWorkAdjustment
        return
    }
}
