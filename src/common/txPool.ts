import { getLogger } from "log4js"
import Long = require("long")
import { hyconfromString } from "../api/client/stringUtil"
import { TxValidity } from "../consensus/database/worldState"
import { Server } from "../server"
import conf = require("../settings")
import { Hash } from "../util/hash"
import { Address } from "./address"
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

const TX_BROADCAST_NUMBER: number = 30
export class TxPool implements ITxPool {
    private server: Server

    private pool: PriorityQueue<ITxQueue>

    private minFee: Long
    private maxAddresses: number
    private maxTxsPerAddress: number
    private accountMap: Map<string, ITxQueue>

    constructor(server: Server, minFee?: Long) {
        this.server = server
        this.maxTxsPerAddress = Number(conf.txPoolMaxTxsPerAddress)
        this.maxAddresses = Number(conf.txPoolMaxAddresses)
        this.minFee = minFee === undefined ? Long.fromNumber(1, true) : minFee
        this.accountMap = new Map<string, ITxQueue>()
        this.pool = new PriorityQueue<ITxQueue>(this.maxAddresses, (a: ITxQueue, b: ITxQueue) => {
            return a.sum.subtract(b.sum).toNumber()
        })
        setInterval(() => {
            const txs: SignedTx[] = this.prepareForBroadcast()
            if (txs.length > 0) {
                this.server.network.broadcastTxs(txs)
            }
        }, 60000)
    }

    public async putTxs(txs: SignedTx[]) {
        const sortNonce = (a: SignedTx, b: SignedTx) => {
            const nonceDiff = a.nonce - b.nonce
            if (nonceDiff !== 0) {
                return nonceDiff
            }
            return b.fee.compare(a.fee)
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
            const address = tx.from.toString()
            let itxqueue = this.accountMap.get(address)

            if (itxqueue === undefined) {
                const queue = new PriorityQueue<SignedTx>(this.maxTxsPerAddress, sortNonce)
                itxqueue = { address, queue, sum: tx.fee }
                this.accountMap.set(address, itxqueue)
                this.pool.insert(itxqueue)
            } else {
                // Check if tx is already inserted
                const newTxHash = new Hash(tx)
                let duplicate = false
                for (const accountTx of itxqueue.queue.toArray()) {
                    const txHash = new Hash(accountTx)
                    if (txHash.equals(newTxHash)) {
                        // tx is already in the txpool
                        duplicate = true
                        break
                    }
                }
                if (duplicate) {
                    continue
                }
                itxqueue.sum = itxqueue.sum.add(tx.fee)
            }
            if (itxqueue.queue.length() === 0 && validity === TxValidity.Waiting) {
                continue
            }
            if (itxqueue.queue.length() === 0) {
                itxqueue.queue.insert(tx)
                broadcastTxs.push(tx)
            } else {
                const lastNonce: number = itxqueue.queue.peek(itxqueue.queue.length() - 1).nonce
                if (tx.nonce - lastNonce <= 1) {
                    itxqueue.queue.insert(tx)
                    broadcastTxs.push(tx)
                }
            }
        }

        this.pool.resort()

        return broadcastTxs
    }

    public removeTxs(txs: SignedTx[]) {
        for (const tx of txs) {
            const address = tx.from.toString()
            const txqueue: ITxQueue = this.accountMap.get(address)
            if (txqueue === undefined) {
                continue
            }
            txqueue.queue.remove(tx, compareTxs)
            txqueue.sum = txqueue.sum.subtract(tx.fee)
            if (txqueue.queue.length() <= 0) {
                this.accountMap.delete(address)
                this.pool.remove(txqueue)
            }
        }
        this.pool.resort()
    }

    public getTxs(count: number): SignedTx[] {
        const txs: SignedTx[] = []
        for (const address of this.accountMap.keys()) {
            const txqueue = this.accountMap.get(address)
            for (let i = 0; i < txqueue.queue.length(); i++) {
                const tx = txqueue.queue.peek(i)
                if (txs.length < count) {
                    txs.push(tx)
                }
            }
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
        return txqueue.queue.toArray()
    }

    private prepareForBroadcast(): SignedTx[] {
        const broadcast: SignedTx[] = []
        // Initial case: Return empty if TxPool is empty
        if (this.pool.length() === 0) {
            return broadcast
        }
        // Iterate over Tx pool in 2 dimensions to try to fill the desired number of transactions
        // Transactions are returned either when limit is reached or at the end of the pool
        const pendQueue: Array<{ queue: PriorityQueue<SignedTx> }> = []
        let maxLength: number = 0
        for (let i = 0; i < Math.min(TX_BROADCAST_NUMBER, this.pool.length()); i++) {
            const { queue } = this.pool.peek(i)
            queue.length() > maxLength ? maxLength = queue.length() : maxLength = maxLength
            pendQueue.push({ queue })
        }
        for (let i = 0; i < maxLength; i++) {
            for (const queue of pendQueue) {
                if (i >= queue.queue.length()) { continue }
                const tx = queue.queue.peek(i)
                broadcast.push(tx)
                if (broadcast.length === TX_BROADCAST_NUMBER) {
                    return broadcast
                }
            }
        }

        return broadcast
    }

}

function compareTxs(a: SignedTx, b: SignedTx) {
    return new Hash(a).equals(new Hash(b))
}
