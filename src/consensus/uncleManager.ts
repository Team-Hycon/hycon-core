
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../common/address"
import { AsyncLock } from "../common/asyncLock"
import { BlockHeader } from "../common/blockHeader"
import { Hash } from "../util/hash"
import { Consensus } from "./consensus"
import { Database } from "./database/database"
import { DeferredDatabaseChanges } from "./database/deferedDatabaseChanges"
import { IMinedDB } from "./database/minedDatabase"
import { BlockStatus } from "./sync"

const logger = getLogger("Uncle Manager")

const uncleRewardR = 75 / 100
const uncleRewardA = 0.9 / uncleRewardR
export const maxUncleHeightDelta = 10
export const maxNumberOfUncles = 10
export const recentHeaderTrackingRange = 2 * maxUncleHeightDelta

export function uncleReward(minerReward: number, heightDelta: number) {
    const factor = uncleRewardA * Math.pow(uncleRewardR, heightDelta)
    return Long.fromNumber(factor * minerReward, true)
}

const emaAlpha = 0.01
export function EMA(x: number, previousEMA: number) {
    return emaAlpha * x + (1 - emaAlpha) * previousEMA
}
export function EMA_Adjust(x: number, depth: number, previousEMA: number) {
    return previousEMA + emaAlpha * Math.pow(1 - emaAlpha, depth) * x
}

export interface IUncleCandidate {
    hash: Hash,
    height: number,
    miner: Address,
}

export class UncleManager {
    private consensus: Consensus
    private candidateLock: AsyncLock
    private recentHeaders: Map<number, IUncleCandidate[]>
    private uncleCandidates: Map<number, Map<string, IUncleCandidate>>

    constructor(consensus: Consensus) {
        this.consensus = consensus
        this.recentHeaders = new Map<number, IUncleCandidate[]>()
        this.uncleCandidates = new Map<number, Map<string, IUncleCandidate>>()
        this.candidateLock = new AsyncLock()
    }

    public async setUncleHeader(height: number, hash: Hash, miner: Address) {
        return this.candidateLock.critical(async () => {
            if (Math.abs(height - this.consensus.getBtip().height) < recentHeaderTrackingRange) {
                let headersAtHeight = this.recentHeaders.get(height)
                if (headersAtHeight === undefined) {
                    headersAtHeight = []
                    this.recentHeaders.set(height, headersAtHeight)
                }
                headersAtHeight.push({ hash, height, miner })
            }
        })

    }

    public async validateUncles(deferredDB: DeferredDatabaseChanges, uncleHashes: Hash[], height: number) {
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
}
