import { getLogger } from "log4js"
import * as sqlite3 from "sqlite3"
import { resolve } from "url"
import { hycontoString } from "../../api/client/stringUtil"
import { Address } from "../../common/address"
import { Block } from "../../common/block"
import { BlockHeader } from "../../common/blockHeader"
import { SignedTx } from "../../common/txSigned"
import { Hash } from "../../util/hash"
import { AnySignedTx, IConsensus } from "../iconsensus"
import { BlockStatus } from "../sync"
import { DBTx } from "./dbtx"
import { ITxDatabase } from "./itxDatabase"
// tslint:disable-next-line:no-var-requires
const TransactionDatabase = require("sqlite3-transactions").TransactionDatabase
const sqlite = sqlite3.verbose()
const logger = getLogger("TxDB")

export class TxDatabase implements ITxDatabase {
    public db: any
    private consensus: IConsensus
    constructor(path: string) {
        this.db = new TransactionDatabase(new sqlite.Database(path + `sql`))
    }
    public async init(consensus: IConsensus, tipHeight?: number) {
        this.consensus = consensus
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS txdb(idx INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        txhash TEXT,
                                                        blockhash TEXT,
                                                        txto TEXT,
                                                        txfrom TEXT,
                                                        amount TEXT,
                                                        fee TEXT,
                                                        blocktime INTEGER,
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
                    if (block instanceof Block) {
                        await this.putTxs(blockHash, block.header.timeStamp, block.txs)
                    } else {
                        await this.putTxs(blockHash, block.header.timeStamp, block.txs)
                    }
                }
            }
        }
    }

    public async getLastBlock(): Promise<Hash | undefined> {
        try {
            let hashData: string = ""
            return new Promise<Hash>(async (resolved, rejected) => {
                this.db.each(`SELECT blockhash FROM txdb ORDER BY timestamp DESC LIMIT 1`, (err: Error, row: any) => {
                    if (row === undefined) {
                        return resolved(undefined)
                    }
                    hashData = row.blockhash
                    return resolved(Hash.decode(hashData))
                })
            })
        } catch (e) {
            logger.error(`Fail to getlastBlock : ${e}`)
            throw e
        }
    }

    public async putTxs(blockHash: Hash, timestamp: number, txs: AnySignedTx[]): Promise<void> {

        const insertArray: any[] = []
        const updateArray: any[] = []
        for (const tx of txs) {
            const txHash = (new Hash(tx)).toString()
            const preBlockHash = await this.getBlockHash(txHash)
            if (preBlockHash !== undefined) {
                updateArray.push({ $blockhash: blockHash.toString(), $preblockhash: preBlockHash, $txhash: txHash })
                continue
            }
            const param = {
                $amount: hycontoString(tx.amount),
                $blockhash: blockHash.toString(),
                $blocktime: timestamp,
                $txhash: txHash,
                $txto: tx.to === undefined ? "🔥" : tx.to.toString(),
            }
            if (tx instanceof SignedTx) {
                Object.assign(param, { $fee: hycontoString(tx.fee), $txfrom: tx.from.toString() })
            }
            insertArray.push(param)
        }

        const insertsql = `INSERT INTO txdb (txhash, blockhash, txto, txfrom, amount, fee, blocktime) VALUES ($txhash, $blockhash, $txto, $txfrom, $amount, $fee, $blocktime)`
        const updatesql = `UPDATE txdb SET blockhash=$blockhash, timestamp=DATETIME('now') WHERE txhash=$txhash AND blockhash=$preblockhash`
        this.db.beginTransaction((err: Error, transaction: any) => {
            for (const param of insertArray) {
                transaction.run(insertsql, param, (error: Error) => { })
            }
            for (const param of updateArray) {
                transaction.run(updatesql, param, (error: Error) => { })
            }
            transaction.commit(((error: Error) => { }))
        })
    }

    public async getLastTxs(address: Address, result: DBTx[] = [], idx: number = 0, count?: number): Promise<DBTx[]> {
        const params = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: idx * count,
        }
        return new Promise<DBTx[]>(async (resolved, rejected) => {
            this.db.all(`SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, timestamp FROM txdb WHERE txto = $address OR txfrom = $address ORDER BY blocktime DESC LIMIT $startIndex, $count`, params, async (err: Error, rows: any) => {
                for (const row of rows) {
                    const status = await this.consensus.getBlockStatus(row.blockhash)
                    if (status === BlockStatus.MainChain) {
                        result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime))
                    }
                    if (result.length === count) { break }
                }
                if (rows.length < count) {
                    return resolved(result)
                }
                if (result.length < count) {
                    result = await this.getLastTxs(address, result, ++idx, count)
                }
                return resolved(result)
            })
        })
    }

    public async getNextTxs(address: Address, txHash: Hash, result: DBTx[] = [], idx: number = 1, count?: number): Promise<DBTx[]> {
        const params = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: idx * count,
            $txhash: txHash.toString(),
        }
        return new Promise<DBTx[]>(async (resolved, rejected) => {
            this.db.all(`SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime FROM txdb WHERE (blocktime <= (SELECT blocktime FROM txdb WHERE txhash = $txhash)) AND (txto = $address OR txfrom = $address) ORDER BY blocktime DESC LIMIT $startIndex, $count`, params, async (err: Error, rows: any) => {
                for (const row of rows) {
                    const status = await this.consensus.getBlockStatus(row.blockhash)
                    if (status === BlockStatus.MainChain) {
                        result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime))
                    }

                    if (result.length === count) { break }
                }
                if (rows.length < count) {
                    return resolved(result)
                }
                if (result.length < count) {
                    result = await this.getNextTxs(address, txHash, result, ++idx, count)
                }
                return resolved(result)
            })
        })

    }

    public async getTx(key: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined> {
        const params = { $txhash: key.toString() }
        let tx: DBTx
        return new Promise<{ tx: DBTx, confirmation: number } | undefined>(async (resolved, rejected) => {
            this.db.all(`SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime FROM txdb WHERE txhash = $txhash LIMIT 1`, params, async (err: Error, rows: any) => {
                if (rows === undefined || rows.length < 1) { return resolved(undefined) }
                tx = new DBTx(rows[0].txhash, rows[0].blockhash, rows[0].txto, rows[0].txfrom, rows[0].amount, rows[0].fee, rows[0].blocktime)
                const height = await this.consensus.getBlockHeight(Hash.decode(tx.blockhash))
                const tip = this.consensus.getBlocksTip()
                const confirmation = tip.height - height
                return resolved({ tx, confirmation })
            })
        })
    }
    private async getBlockHash(txhash: string): Promise<string | undefined> {
        const blockhash = ""
        return new Promise<string | undefined>(async (resolved, rejected) => {
            this.db.all(`SELECT blockhash FROM txdb WHERE txhash=$txhash LIMIT 1`, { $txhash: txhash }, (err: Error, rows: any) => {
                if (rows === undefined || rows.length < 1) { return resolved(undefined) }
                return resolved(rows[0].blockhash)
            })
        })
    }
}
