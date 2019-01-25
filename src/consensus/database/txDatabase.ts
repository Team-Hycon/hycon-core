import { hyconfromString, hycontoString, strictAdd } from "@glosfer/hyconjs-util"
import { getLogger } from "log4js"
import Long = require("long")
import * as sqlite3 from "sqlite3"
import { Address } from "../../common/address"
import { AnySignedTx, SignedTx } from "../../common/txSigned"
import { Hash } from "../../util/hash"
import { START_HEIGHT } from "../consensus"
import { Consensus } from "../consensus"
import { BlockStatus } from "../sync"
import { DBTx } from "./dbtx"
// tslint:disable-next-line:no-var-requires
const TransactionDatabase = require("sqlite3-transactions").TransactionDatabase
const sqlite = sqlite3.verbose()
const logger = getLogger("TxDB")
const TXDB_BATCH_SIZE = 200
export interface ITxDB { blockhash: Hash, height: number, blocktime: number, txs: AnySignedTx[] }
export interface ITxDBRow {
    $amount: string,
    $blockhash: string,
    $blocktime: number,
    $txhash: string,
    $txto: string,
    $fee?: string,
    $txfrom?: string,
    $nonce?: number,
}

export interface IGetParam {
    $address?: string,
    $blockhash?: string,
    $txhash?: string,
    $count?: number,
    $startIndex?: number,
}
export interface ITxDBRowResult {
    amount: string,
    blockhash: string,
    blocktime: number,
    txhash: string,
    txto: string,
    fee?: string,
    txfrom?: string,
    nonce?: number,
}

export class TxDatabase {
    public db: sqlite3.Database
    private consensus: Consensus
    constructor(path: string) {
        this.db = new TransactionDatabase(new sqlite.Database(path + `sql`))
    }
    public async init(consensus: Consensus) {
        this.consensus = consensus
        this.db.serialize(() => {
            this.db.run(`PRAGMA synchronous = OFF;`)
            this.db.run(`PRAGMA journal_mode = MEMORY;`)
            this.db.run(`CREATE TABLE IF NOT EXISTS txdb(txhash TEXT PRIMARY KEY,
                                                        blockhash TEXT,
                                                        txto TEXT,
                                                        txfrom TEXT,
                                                        amount TEXT,
                                                        fee TEXT,
                                                        blocktime INTEGER,
                                                        nonce INTEGER) WITHOUT ROWID;`)
            this.db.run(`CREATE INDEX IF NOT EXISTS blocktime ON txdb(blocktime);`)
            this.db.run(`CREATE INDEX IF NOT EXISTS txto ON txdb(txto);`)
            this.db.run(`CREATE INDEX IF NOT EXISTS txfrom ON txdb(txfrom);`)
            this.db.run(`CREATE INDEX IF NOT EXISTS blockhash ON txdb(blockhash);`)
        })
        setImmediate(async () => { await this.updateTxDB() })
    }
    public async updateTxDB() {
        const tip = this.consensus.getBlocksTip()
        try {
            if (tip === undefined) { return }
            const tipHeight = tip.height
            if (tipHeight !== undefined) {
                let lastHash = await this.getLastBlock()
                lastHash = await this.consensus.findMainChainHash(lastHash)

                let putArray: ITxDB[] = []
                let height = await this.consensus.getBlockHeight(lastHash)
                while (height <= tipHeight) {
                    const block = await this.consensus.getBlockByHash(lastHash)
                    if (block.txs.length > 0) {
                        const blockHash = height === START_HEIGHT ? Hash.decode("2RSAyaRbTr3NxEAZVvj7iJrAoKrm8ibs5MqUE1diVFpp") : new Hash(block.header)
                        putArray.push({ blockhash: blockHash, blocktime: block.header.timeStamp, height, txs: block.txs })
                    }
                    if (putArray.length >= TXDB_BATCH_SIZE) {
                        await this.putTxs(putArray)
                        putArray = []
                    }
                    height++
                    lastHash = await this.consensus.getHash(height)
                }
                if (putArray.length > 0) {
                    await this.putTxs(putArray)
                }
            }
        } catch (e) {
            logger.error(`Failed to putTxs : ${e}`)
        } finally {
            setTimeout(async () => { await this.updateTxDB() }, 25000)
        }
    }

    public async getLastBlock(): Promise<Hash | undefined> {
        try {
            let hashData: string = ""
            return new Promise<Hash>(async (resolve, reject) => {
                this.db.get(`SELECT DISTINCT blockhash FROM txdb ORDER BY blocktime DESC`, (err: Error, row: any) => {
                    if (err) {
                        return reject(err)
                    }
                    if (row === undefined) {
                        return resolve(undefined)
                    }
                    hashData = row.blockhash
                    return resolve(Hash.decode(hashData))
                })
            })
        } catch (e) {
            logger.error(`Fail to getlastBlock : ${e}`)
            throw e
        }
    }

    public async putTxs(putArray: ITxDB[]) {
        const insertArray: ITxDBRow[] = []
        for (const data of putArray) {
            const blockhash = data.blockhash.toString()
            for (const tx of data.txs) {
                const param = {
                    $amount: hycontoString(tx.amount),
                    $blockhash: blockhash,
                    $blocktime: data.blocktime,
                    $txhash: new Hash(tx).toString(),
                    $txto: tx.to === undefined ? "🔥" : tx.to.toString(),
                }
                if (tx instanceof SignedTx) {
                    Object.assign(param, { $fee: hycontoString(tx.fee), $txfrom: tx.from.toString(), $nonce: tx.nonce })
                }
                insertArray.push(param)
            }
        }
        await this.put(insertArray)
    }

    public async getTxsInBlock(blockHash: string, result: DBTx[] = [], index: number = 0, count: number = 10): Promise<{ txs: DBTx[], amount: string, fee: string, length: number }> {
        const params: IGetParam = {
            $blockhash: blockHash.toString(),
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE blockhash = $blockhash ORDER BY blocktime, nonce DESC`

        const { amount, fee, idx, results } = await this.getMainChainTxs(query, params, count, index)
        result = result.concat(results)
        return { txs: result, amount: hycontoString(amount), fee: hycontoString(fee), length: idx }
    }

    public async getLastTxs(address: Address, result: DBTx[] = [], pageNumber: number = 0, count: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: pageNumber * count,
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE txto = $address OR txfrom = $address ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const { getLength, results } = await this.getMainChainTxs(query, params, count)
        result = result.concat(results)
        if (getLength < count) { return result }

        if (result.length < count) {
            result = await this.getLastTxs(address, result, ++pageNumber, count)
        }
        return result
    }

    public async getNextTxs(address: Address, txHash: Hash, result: DBTx[] = [], pageNumber: number, count: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: pageNumber * count,
            $txhash: txHash.toString(),
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE (blocktime <= (SELECT blocktime FROM txdb WHERE txhash = $txhash)) AND (txto = $address OR txfrom = $address) ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const { getLength, results } = await this.getMainChainTxs(query, params, count)
        result = result.concat(results)
        if (getLength < count) { return result }

        if (result.length < count) {
            result = await this.getNextTxs(address, txHash, result, ++pageNumber, count)
        }
        return result

    }

    public async getNextTxsInBlock(blockHash: string, txHash: string, result: DBTx[], idx: number, count: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $blockhash: blockHash.toString(),
            $count: count - result.length,
            $startIndex: idx * count,
            $txhash: txHash,
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE (blocktime <= (SELECT blocktime FROM txdb WHERE txhash = $txhash)) AND (blockhash = $blockhash) ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const { getLength, results } = await this.getMainChainTxs(query, params, count)
        result = result.concat(results)
        if (getLength < count) { return result }

        if (result.length < count) {
            result = await this.getNextTxsInBlock(blockHash, txHash, result, ++idx, count)
        }
        return result
    }

    public async getTx(key: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined> {
        const params: IGetParam = { $txhash: key.toString() }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE txhash = $txhash LIMIT 1`
        const rows: DBTx[] = await this.getDBTxs(query, params)
        if (rows === undefined || rows.length < 1) { return undefined }

        const height = await this.consensus.getBlockHeight(Hash.decode(rows[0].blockhash))
        const tip = this.consensus.getBlocksTip()
        if (tip === undefined) { return undefined }

        const confirmation = tip.height - height
        return { tx: rows[0], confirmation }
    }

    public async getBurnAmount(): Promise<{ amount: Long }> {
        let amount: Long = Long.UZERO
        const query = `select amount from txdb where txto = '🔥'`
        const rows = await this.get(query)
        for (const row of rows) {
            amount = strictAdd(amount, hyconfromString(row.amount))
        }
        return { amount }
    }
    private async put(insertArray: ITxDBRow[]) {
        const insertsql = `INSERT OR REPLACE INTO txdb (txhash, blockhash, txto, txfrom, amount, fee, blocktime, nonce) VALUES ($txhash, $blockhash, $txto, $txfrom, $amount, $fee, $blocktime, $nonce)`
        return new Promise<void>((resolve, reject) => {
            const insert = this.db.prepare(insertsql, (err) => {
                if (err) { return reject(err) }
                this.db.parallelize(() => {
                    for (const param of insertArray) { insert.run(param) }
                })
                insert.finalize((error) => {
                    if (error) { reject(error) } else { resolve() }
                })
            })
        })
    }

    private async getDBTxs(query: string, params: IGetParam): Promise<DBTx[]> {
        const results: DBTx[] = []
        const rows = await this.get(query, params)
        for (const row of rows) {
            const amount = hycontoString(hyconfromString(row.amount))
            const fee = row.fee !== null ? hycontoString(hyconfromString(row.fee)) : "0"
            const dbtx = new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, amount, fee, row.blocktime, row.nonce)
            results.push(dbtx)
        }
        return results
    }

    private async get(query: string, params: IGetParam = {}): Promise<ITxDBRowResult[]> {
        return new Promise<ITxDBRowResult[]>(async (resolve, reject) => {
            this.db.all(query, params, async (err: Error, rows: any) => {
                if (err) { return reject(err) }
                return resolve(rows)
            })
        })
    }

    private async getMainChainTxs(query: string, params: IGetParam, count: number, index?: number): Promise<{ amount: Long, fee: Long, getLength: number, idx: number, results: DBTx[] }> {
        const txs: DBTx[] = await this.getDBTxs(query, params)
        let amount = Long.UZERO
        let fee = Long.UZERO
        const results = []
        for (const tx of txs) {
            const status = await this.consensus.getBlockStatus(Hash.decode(tx.blockhash))
            if (status === BlockStatus.MainChain) {
                if (index !== undefined) {
                    amount = strictAdd(amount, hyconfromString(tx.amount))
                    fee = strictAdd(fee, hyconfromString(tx.fee))
                    if (index < count) { results.push(tx) }
                    ++index
                } else {
                    results.push(tx)
                    if (results.length === count) { break }
                }
            }
        }
        return { amount, fee, getLength: txs.length, idx: index, results }
    }

}
