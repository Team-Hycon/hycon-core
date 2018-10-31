import { getLogger } from "log4js"
import Long = require("long")
import * as sqlite3 from "sqlite3"
import { hycontoString } from "../../api/client/stringUtil"
import { Address } from "../../common/address"
import { AnyBlock, Block } from "../../common/block"
import { BlockHeader } from "../../common/blockHeader"
import { SignedTx } from "../../common/txSigned"

import { Hash } from "../../util/hash"
import { IConsensus } from "../iconsensus"
import { BlockStatus } from "../sync"
import { DBMined } from "./dbMined"
const sqlite = sqlite3.verbose()
const logger = getLogger("MinedDB")

export interface IMinedDB { blockhash: Hash, blocktime: number, miner: Address, reward?: Long, txs?: SignedTx[] }
export class MinedDatabase {
    private db: sqlite3.Database
    private consensus: IConsensus
    constructor(path: string) {
        this.db = new sqlite.Database(path + `sql`)
    }
    public async init(consensus: IConsensus, tipHeight?: number) {
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
        if (tipHeight !== undefined) {
            let status: BlockStatus
            let lastHeight = 0
            const i = 0
            let lastHash = await this.getLastBlock()
            while (lastHash !== undefined) {
                status = await this.consensus.getBlockStatus(lastHash)
                if (status === BlockStatus.MainChain) {
                    lastHeight = await this.consensus.getBlockHeight(lastHash)
                    break
                }
                const header = await this.consensus.getHeaderByHash(lastHash)
                if (header instanceof BlockHeader) {
                    lastHash = header.previousHash[0]
                } else { break }
            }

            if (lastHeight < tipHeight) {
                const { nakamotoBlocks, ghostBlocks } = await this.consensus.getBlocksRanges(lastHeight + 1)
                await this.putMinedBlock(nakamotoBlocks, ghostBlocks)
            }
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

    public async applyReorganize(blocks: IMinedDB[], uncles: IMinedDB[]) {
        const insertArray: any[] = []
        for (const block of blocks) {
            if (block.txs === undefined || block.reward === undefined) { continue }
            insertArray.push({
                $blockhash: block.blockhash.toString(),
                $blocktime: block.blocktime,
                $feeReward: this.calculateFeeReward(block.reward, block.txs),
                $miner: block.miner.toString(),
            })
        }
        for (const uncle of uncles) {
            if (uncle.reward === undefined) { continue }
            insertArray.push({
                $blockhash: uncle.blockhash.toString(),
                $blocktime: uncle.blocktime,
                $feeReward: hycontoString(uncle.reward),
                $miner: uncle.miner.toString(),
            })
        }
        await this.put(insertArray)
    }

    public async putMinedBlock(nakamotoBlocks: AnyBlock[], ghostBlocks: AnyBlock[]): Promise<void> {
        const insertArray: any[] = []
        const nakamotoLength = nakamotoBlocks.length
        const blocks = nakamotoBlocks.concat(ghostBlocks)
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i]
            if (!(block instanceof Block) || !(block.header instanceof BlockHeader)) { continue }
            const reward = i < nakamotoLength ? Long.fromNumber(240e9) : Long.fromNumber(120e9)
            insertArray.push({
                $blockhash: (new Hash(block.header)).toString(),
                $blocktime: block.header.timeStamp,
                $feeReward: this.calculateFeeReward(reward, block.txs),
                $miner: block.header.miner.toString(),
            })
        }
        await this.put(insertArray)
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
            Object.assign(params, { $blockhash: blockHash.toString() })
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

    private calculateFeeReward(reward: Long, txs: SignedTx[]): string {
        let feeReward = reward
        for (const tx of txs) { feeReward = feeReward.add(tx.fee) }
        return hycontoString(feeReward)
    }
}
