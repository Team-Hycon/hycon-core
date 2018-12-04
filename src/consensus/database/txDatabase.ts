import { getLogger } from "log4js"
import Long = require("long")
import * as sqlite3 from "sqlite3"
import { hyconfromString, hycontoString } from "../../api/client/stringUtil"
import { Address } from "../../common/address"
import { AnySignedTx, SignedTx } from "../../common/txSigned"
import { Hash } from "../../util/hash"
import { START_HEIGHT } from "../consensus"
import { Consensus } from "../consensus"
import { BlockStatus } from "../sync"
import { DBTx } from "./dbtx"
import { strictAdd } from "./worldState"
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

    public async getLastTxs(address: Address, result: DBTx[] = [], pageNumber: number = 0, count?: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: pageNumber * count,
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE txto = $address OR txfrom = $address ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const rows = await this.get(this.db, query, params)
        for (const row of rows) {
            const status = await this.consensus.getBlockStatus(Hash.decode(row.blockhash))
            if (status === BlockStatus.MainChain) {
                result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime, row.nonce))
            }
            if (result.length === count) { break }
        }
        if (rows.length < count) {
            return result
        }
        if (result.length < count) {
            result = await this.getLastTxs(address, result, ++pageNumber, count)
        }
        return result
    }

    public async getTxsInBlock(blockHash: string, result: DBTx[] = [], index: number = 0, count: number = 10): Promise<{ txs: DBTx[], amount: string, fee: string, length: number }> {
        const params: IGetParam = {
            $blockhash: blockHash.toString(),
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE blockhash = $blockhash ORDER BY blocktime, nonce DESC`
        const rows = await this.get(this.db, query, params)
        let amount = Long.UZERO
        let fee = Long.UZERO
        for (const row of rows) {
            const status = await this.consensus.getBlockStatus(Hash.decode(row.blockhash))
            if (status === BlockStatus.MainChain) {
                amount = strictAdd(amount, hyconfromString(row.amount))
                fee = strictAdd(fee, hyconfromString(row.fee))
                if (index < count) {
                    result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime, row.nonce))
                }
                ++index
            }
        }
        return { txs: result, amount: hycontoString(amount), fee: hycontoString(fee), length: index }
    }

    public async getNextTxs(address: Address, txHash: Hash, result: DBTx[] = [], pageNumber: number = 1, count?: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $address: address.toString(),
            $count: count - result.length,
            $startIndex: pageNumber * count,
            $txhash: txHash.toString(),
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE (blocktime <= (SELECT blocktime FROM txdb WHERE txhash = $txhash)) AND (txto = $address OR txfrom = $address) ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const rows = await this.get(this.db, query, params)
        for (const row of rows) {
            const status = await this.consensus.getBlockStatus(Hash.decode(row.blockhash))
            if (status === BlockStatus.MainChain) {
                result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime, row.nonce))
            }
            if (result.length === count) { break }
        }
        if (rows.length < count) {
            return result
        }
        if (result.length < count) {
            result = await this.getNextTxs(address, txHash, result, ++pageNumber, count)
        }
        return result

    }

    public async getNextTxsInBlock(blockHash: string, txHash: string, result: DBTx[], idx: number, count?: number): Promise<DBTx[]> {
        const params: IGetParam = {
            $blockhash: blockHash.toString(),
            $count: count - result.length,
            $startIndex: idx * count,
            $txhash: txHash,
        }
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE (blocktime <= (SELECT blocktime FROM txdb WHERE txhash = $txhash)) AND (blockhash = $blockhash) ORDER BY blocktime DESC, nonce DESC LIMIT $startIndex, $count`
        const rows = await this.get(this.db, query, params)
        for (const row of rows) {
            const status = await this.consensus.getBlockStatus(Hash.decode(row.blockhash))
            if (status === BlockStatus.MainChain) {
                result.push(new DBTx(row.txhash, row.blockhash, row.txto, row.txfrom, row.amount, row.fee, row.blocktime, row.nonce))
            }
            if (result.length === count) { break }
        }
        if (rows.length < count) {
            return result
        }
        if (result.length < count) {
            result = await this.getNextTxsInBlock(blockHash, txHash, result, ++idx, count)
        }
        return result
    }

    public async getTx(key: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined> {
        const params: IGetParam = { $txhash: key.toString() }
        let tx: DBTx
        const query = `SELECT txhash, txto, txfrom, amount, fee, blockhash, blocktime, nonce FROM txdb WHERE txhash = $txhash LIMIT 1`
        const row = await this.get(this.db, query, params)
        if (row === undefined || row.length < 1) { return undefined }
        tx = new DBTx(row[0].txhash, row[0].blockhash, row[0].txto, row[0].txfrom, row[0].amount, row[0].fee, row[0].blocktime, row[0].nonce)
        const height = await this.consensus.getBlockHeight(Hash.decode(tx.blockhash))
        const tip = this.consensus.getBlocksTip()
        const confirmation = tip.height - height
        return { tx, confirmation }
    }

    public async getBurnAmount(): Promise<{ amount: Long }> {
        return new Promise<{ amount: Long }>(async (resolved, rejected) => {
            this.db.all(`select amount from txdb where txto = '🔥'`, async (err: Error, rows: any) => {
                let amount: Long = Long.UZERO
                if (rows !== undefined) {
                    for (const row of rows) {
                        amount = strictAdd(amount, Long.fromNumber(rows.amount, true))
                    }
                }
                return resolved({ amount })
            })
        })
    }
    private async put(insertArray: ITxDBRow[]) {
        const insertsql = `INSERT OR REPLACE INTO txdb (txhash, blockhash, txto, txfrom, amount, fee, blocktime, nonce) VALUES ($txhash, $blockhash, $txto, $txfrom, $amount, $fee, $blocktime, $nonce)`
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

    private async get(db: sqlite3.Database, query: string, params: IGetParam): Promise<ITxDBRowResult[]> {
        return new Promise<ITxDBRowResult[]>(async (resolve, reject) => {
            db.all(query, params, async (err: Error, rows: any) => {
                if (err) { return reject(err) }
                return resolve(rows)
            })
        })
    }
}
