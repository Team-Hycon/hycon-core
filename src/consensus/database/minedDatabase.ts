import { getLogger } from "log4js"
import * as sqlite3 from "sqlite3"
import { resolve } from "url"
import { hyconfromString, hycontoString } from "../../api/client/stringUtil"
import { Address } from "../../common/address"
import { Block } from "../../common/block"
import { BlockHeader } from "../../common/blockHeader"
import { SignedTx } from "../../common/txSigned"
import { Hash } from "../../util/hash"
import { AnySignedTx, IConsensus } from "../iconsensus"
import { BlockStatus } from "../sync"
import { DBMined } from "./dbMined"
const sqlite = sqlite3.verbose()
const logger = getLogger("MinedDB")

export class MinedDatabase {
    private db: sqlite3.Database
    private consensus: IConsensus
    constructor(path: string) {
        this.db = new sqlite.Database(path + `sql`)
    }
    public async init(consensus: IConsensus, tipHeight?: number) {
        this.consensus = consensus
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS mineddb(idx INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        blockhash TEXT,
                                                        blocktime INTEGER,
                                                        feeReward TEXT,
                                                        miner TEXT,
                                                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`)
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
                const blocks = await this.consensus.getBlocksRange(lastHeight + 1)
                for (const block of blocks) {
                    const blockHash = new Hash(block.header)
                    if (block instanceof Block && block.header.miner !== undefined) {
                        await this.putMinedBlock(blockHash, block.header.timeStamp, block.txs, block.header.miner)
                    }
                }
            }
        }
    }

    public async getLastBlock(): Promise<Hash | undefined> {
        try {
            let hashData: string = ""
            return new Promise<Hash | undefined>(async (resolved, rejected) => {
                this.db.all(`SELECT * FROM mineddb ORDER BY timestamp DESC LIMIT 1`, (err, rows) => {
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

    public async putMinedBlock(blockHash: Hash, timestamp: number, txs: AnySignedTx[], miner: Address): Promise<void> {
        const isExist = await this.get(blockHash)
        if (!isExist) {
            const stmtInsert = this.db.prepare(`INSERT INTO mineddb (blockhash, feeReward, blocktime, miner) VALUES ($blockhash, $feeReward, $blocktime, $miner)`)
            let feeReward = hyconfromString("240")
            for (const tx of txs) { tx instanceof SignedTx ? feeReward = feeReward.add(tx.fee) : feeReward = feeReward }
            const params = {
                $blockhash: blockHash.toString(),
                $blocktime: timestamp,
                $feeReward: hycontoString(feeReward),
                $miner: miner.toString(),
            }
            stmtInsert.run(params)
            stmtInsert.finalize()
        }
    }

    public async getMinedBlocks(address: Address, count: number, index: number, blockHash?: Hash, result: DBMined[] = []): Promise<DBMined[]> {
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
                    const status = await this.consensus.getBlockStatus(row.blockhash)
                    if (status === BlockStatus.MainChain) {
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

    public async get(key: Hash): Promise<boolean> {
        const params = { $blockhash: key.toString() }
        return new Promise<boolean>(async (resolved, rejected) => {
            this.db.all(`SELECT blockhash, feeReward, blocktime, miner FROM mineddb WHERE blockhash = $blockhash`, params, async (err, rows) => {
                if (rows === undefined || rows.length === 0) { return resolved(false) }
                return resolved(true)
            })
        })
    }
}
