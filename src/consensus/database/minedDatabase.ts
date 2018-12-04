import { getLogger } from "log4js"
import Long = require("long")
import * as sqlite3 from "sqlite3"
import { hycontoString } from "../../api/client/stringUtil"
import { Address } from "../../common/address"
import { BlockHeader } from "../../common/blockHeader"
import { SignedTx } from "../../common/txSigned"

import { userOptions } from "../../main"
import { Hash } from "../../util/hash"
import { Consensus } from "../consensus"
import { GhostConsensus } from "../consensusGhost"
import { JabiruConsensus } from "../consensusJabiru"
import { BlockStatus } from "../sync"
import { uncleReward } from "../uncleManager"
import { DBMined } from "./dbMined"
import { strictAdd } from "./worldState"
const sqlite = sqlite3.verbose()
const logger = getLogger("MinedDB")
const MINEDDB_BATCH_SIZE = 1000

export interface IMinedDB { blockhash: Hash, blocktime: number, miner: Address, reward?: Long, txs?: SignedTx[] }
export interface IMinedDBRow {
    $blockhash: string,
    $blocktime: number,
    $feeReward: string,
    $miner: string,
}
export class MinedDatabase {
    private db: sqlite3.Database
    private consensus: Consensus
    constructor(path: string) {
        this.db = new sqlite.Database(path + `sql`)
    }
    public async init(consensus: Consensus) {
        this.consensus = consensus
        this.db.serialize(() => {
            this.db.run(`PRAGMA synchronous = OFF;`)
            this.db.run(`PRAGMA journal_mode = MEMORY;`)
            this.db.run(`CREATE TABLE IF NOT EXISTS mineddb(blockhash TEXT PRIMARY KEY,
                                                        blocktime INTEGER,
                                                        feeReward TEXT,
                                                        miner TEXT)`)
            this.db.run(`CREATE INDEX IF NOT EXISTS miner ON mineddb(miner);`)
            this.db.run(`CREATE INDEX IF NOT EXISTS blocktime ON mineddb(blocktime);`)
        })
        setImmediate(async () => { await this.updateMinedDB() })
    }
    public async updateMinedDB() {
        const tip = this.consensus.getBlocksTip()
        try {
            if (tip === undefined) { return }
            const tipHeight = tip.height
            if (tipHeight !== undefined) {
                let lastHash = await this.getLastBlock()
                lastHash = await this.consensus.findMainChainHash(lastHash)

                let putArray: IMinedDBRow[] = []
                let height = await this.consensus.getBlockHeight(lastHash)
                while (height <= tipHeight) {
                    const block = await this.consensus.getBlockByHash(lastHash)
                    if (block === undefined || !(block.header instanceof BlockHeader)) {
                        height++
                        lastHash = await this.consensus.getHash(height)
                        continue
                    }
                    const blockReward = height <= userOptions.jabiruHeight ? GhostConsensus.BLOCK_REWARD : JabiruConsensus.BLOCK_REWARD
                    const uncles = block.header.previousHash.slice(1)
                    for (const uncleHash of uncles) {
                        const uncleHeight = await this.consensus.getBlockHeight(uncleHash)
                        const uncle = await this.consensus.getHeaderByHash(uncleHash)
                        if (uncle === undefined) {
                            continue
                        }
                        const reward = uncleReward(blockReward, height - uncleHeight)

                        if (!(uncle instanceof BlockHeader)) {
                            continue
                        }

                        const miner = uncle.miner
                        const uncleRow: IMinedDBRow = {
                            $blockhash: uncleHash.toString(),
                            $blocktime: uncle.timeStamp,
                            $feeReward: hycontoString(reward),
                            $miner: miner.toString(),
                        }
                        putArray.push(uncleRow)
                    }

                    let fee = Long.UZERO
                    for (const tx of block.txs) {
                        if (!(tx instanceof SignedTx)) { continue }
                        fee = strictAdd(fee, tx.fee)
                    }
                    const blockRow: IMinedDBRow = {
                        $blockhash: lastHash.toString(),
                        $blocktime: block.header.timeStamp,
                        $feeReward: hycontoString(strictAdd(Long.fromNumber(blockReward, true), fee)),
                        $miner: block.header instanceof BlockHeader ? block.header.miner.toString() : "",
                    }

                    putArray.push(blockRow)
                    if (putArray.length >= MINEDDB_BATCH_SIZE) {
                        await this.put(putArray)
                        putArray = []
                    }
                    height++
                    lastHash = await this.consensus.getHash(height)
                }
                if (putArray.length > 0) {
                    await this.put(putArray)
                }
            }
        } catch (e) {
            logger.error(`Failed to putMinedBlock : ${e}`)
        } finally {
            setTimeout(async () => { await this.updateMinedDB() }, 25000)
        }
    }

    public async getLastBlock(): Promise<Hash | undefined> {
        try {
            let hashData: string = ""
            return new Promise<Hash | undefined>(async (resolved, rejected) => {
                this.db.all(`SELECT * FROM mineddb ORDER BY blocktime DESC LIMIT 1`, (err, rows) => {
                    if (rows === undefined || rows.length < 1) { return resolved(undefined) }
                    hashData = rows[0].blockhash
                    return resolved(Hash.decode(hashData))
                })
            })
        } catch (e) {
            logger.error(`Fail to getlastBlock : ${e}`)
            throw e
        }
    }

    public async getMinedInfo(blockHash: string): Promise<DBMined | undefined> {
        const param = { $blockHash: blockHash }
        return new Promise<DBMined | undefined>(async (resolved, rejected) => {
            this.db.all(`SELECT blockhash, feeReward, blocktime, miner FROM mineddb WHERE blockHash = $blockHash LIMIT 1`, param, async (err: Error, rows: any) => {
                if (rows === undefined || rows.length < 1) { return resolved(undefined) }
                return resolved(new DBMined(rows[0].blockhash, rows[0].feeReward, rows[0].blocktime, rows[0].miner))
            })
        })
    }

    public async getMinedBlocks(address: Address, count: number, index: number, blockHash?: string, result: DBMined[] = []): Promise<DBMined[]> {
        const params = {
            $count: count - result.length,
            $miner: address.toString(),
            $startIndex: index * count,
        }
        let query = ""
        if (blockHash === undefined) {
            query = `SELECT blockhash, feeReward, blocktime, miner FROM mineddb `
                + `WHERE miner = $miner ORDER BY blocktime DESC LIMIT $startIndex, $count`
        } else {
            query = `SELECT blockhash, feeReward, blocktime, miner FROM mineddb `
                + `WHERE (blocktime <= (SELECT blocktime FROM mineddb WHERE blockhash = $blockhash)) AND (miner = $miner) ORDER BY blocktime DESC LIMIT $startIndex, $count`
            Object.assign(params, { $blockhash: blockHash })
        }
        return new Promise<DBMined[]>(async (resolved, rejected) => {
            this.db.all(query, params, async (err, rows) => {
                for (const row of rows) {
                    const hash = Hash.decode(row.blockhash)
                    const status = await this.consensus.getBlockStatus(hash)
                    if (status === BlockStatus.MainChain || await this.consensus.isUncleBlock(hash)) {
                        result.push(new DBMined(row.blockhash, row.feeReward, row.blocktime, row.miner))
                    }
                    if (result.length === count) { break }
                }
                if (rows.length < count) {
                    return resolved(result)
                }
                if (result.length < count) {
                    result = await this.getMinedBlocks(address, count, ++index, blockHash, result)
                }
                return resolved(result)
            })
        })
    }

    private async put(insertArray: any[]) {
        const insertsql = `INSERT OR REPLACE INTO mineddb (blockhash, feeReward, blocktime, miner) VALUES ($blockhash, $feeReward, $blocktime, $miner)`
        return new Promise<void>((resolve, reject) => {
            const insert = this.db.prepare(insertsql, (err) => {
                if (err) {
                    reject(err)
                    return
                }
                this.db.parallelize(() => {
                    for (const param of insertArray) { insert.run(param) }
                })
                insert.finalize((error) => {
                    if (error) { reject(error) } else { resolve() }
                })
            })
        })
    }
}
