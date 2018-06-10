import { getLogger } from "log4js"
import Long = require("long")
import { hyconfromString, hycontoString } from "../api/client/stringUtil"
import { TxValidity } from "../consensus/database/worldState"
import { BlockStatus } from "../consensus/sync"
import { NewTx } from "../serialization/proto"
import { Server } from "../server"
import { Hash } from "../util/hash"
import { Address } from "./address"
import { AsyncLock } from "./asyncLock"
import { ITxPool } from "./itxPool"
import { PriorityQueue } from "./priorityQueue"
import { SignedTx } from "./txSigned"
// tslint:disable-next-line:no-var-requires
const assert = require("assert")
const logger = getLogger("AppTxPool")

interface ITxQueue {
    sum: Long,
    queue: PriorityQueue<SignedTx>,
    address: string
}

export class TxPool implements ITxPool {
    private server: Server

    private pool: PriorityQueue<ITxQueue>

    private minFee: Long
    private maxAddresses: number
    private maxTxsPerAddress: number
    private accountMap: Map<string, PriorityQueue<SignedTx>>
    private accountSums: Map<string, Long>

    constructor(server: Server, minFee?: Long) {
        this.server = server
        this.maxTxsPerAddress = 4096 // TODO: Figure out proper numbers
        this.maxAddresses = 4096
        this.minFee = minFee === undefined ? Long.fromNumber(1, true) : minFee
        this.accountMap = new Map<string, PriorityQueue<SignedTx>>()
        this.accountSums = new Map<string, Long>()
        this.pool = new PriorityQueue<ITxQueue>(this.maxAddresses, (a: ITxQueue, b: ITxQueue) => {
            return a.sum.subtract(b.sum).toNumber()
        })
    }

    public async putTxs(txs: SignedTx[]) {
        const sortNonce = (a: SignedTx, b: SignedTx) => {
            const nonceDiff = a.nonce - b.nonce
            if (nonceDiff !== 0) {
                return nonceDiff
            }
            return a.fee.compare(b.fee)
        }

        const broadcastTxs: SignedTx[] = []
        for (const tx of txs) {
            if (tx.fee.lessThan(this.minFee)) {
                continue
            }
            const validity = await this.server.consensus.txValidity(tx)
            if (validity === TxValidity.Invalid) {
                continue
            }
            const from = tx.from.toString()
            let accountTxs = this.accountMap.get(from)
            if (accountTxs === undefined) {
                accountTxs = new PriorityQueue<SignedTx>(this.maxTxsPerAddress, sortNonce)
                accountTxs.insert(tx)
                this.accountMap.set(from, accountTxs)
                this.accountSums.set(from, tx.fee)
            } else {
                accountTxs.insert(tx)
                const sum = this.accountSums.get(from)
                this.accountSums.set(from, sum.add(tx.fee))
            }
            broadcastTxs.push(tx)
        }

        let foundQueue = false
        for (const address of this.accountMap.keys()) {
            const accountTxs = this.accountMap.get(address)
            const accountSum = this.accountSums.get(address)
            for (let i = 0; i < this.pool.length(); i++) {
                const poolITxQueue = this.pool.peek(i)
                if (poolITxQueue.address === address) {
                    poolITxQueue.sum = accountSum
                    poolITxQueue.queue = accountTxs
                    foundQueue = true
                    break
                }
            }
            if (!foundQueue) {
                const itxqueue: ITxQueue = { sum: accountSum, queue: accountTxs, address }
                this.pool.insert(itxqueue)
            }
            if (foundQueue) {
                break
            }
        }

        return broadcastTxs
    }

    public removeTxs(txs: SignedTx[]) {
        for (const tx of txs) {
            const address = tx.from.toString()
            let txqueue: ITxQueue
            for (let i = 0; i < this.pool.length(); i++) {
                const itxqueue = this.pool.peek(i)
                if (itxqueue.address === address) {
                    txqueue = this.pool.pop(i)
                    txqueue.queue.remove(tx, compareTxs)
                    txqueue.sum = txqueue.sum.subtract(tx.fee)
                    this.accountSums.set(address, txqueue.sum)
                    break
                }
            }
            if (txqueue !== undefined) {
                this.pool.insert(txqueue)
            }
        }
    }

    public getTxs(count: number): SignedTx[] {
        const txs: SignedTx[] = []
        let j = 0
        for (let i = 0; i < count; i++) {
            const txqueue = this.pool.peek(j)
            if (txqueue === undefined) {
                return txs
            }
            const tx = txqueue.queue.peek(i)
            if (tx === undefined) {
                j++
                count -= i
                i = 0
                continue
            }
            txs.push(tx)
        }
        return txs
    }

    public getPending(index: number, count: number): { txs: SignedTx[], length: number, totalAmount: Long, totalFee: Long } {
        const txs = this.getTxs(4096).slice()
        let totalAmount = hyconfromString("0")
        let totalFee = hyconfromString("0")
        for (const tx of txs) {
            totalAmount = totalAmount.add(tx.amount)
            totalFee = totalFee.add(tx.fee)
        }
        let final = index + count
        final > txs.length ? final = txs.length : final = final
        return { txs: txs.slice(index, final), length: txs.length, totalAmount, totalFee }
    }
    public getTxsOfAddress(address: Address): SignedTx[] {
        const txqueue = this.accountMap.get(address.toString())
        if (txqueue === undefined) {
            return []
        }
        return txqueue.toArray()
    }
}

function compareTxs(a: SignedTx, b: SignedTx) {
    return new Hash(a).equals(new Hash(b))
}
