import { getLogger } from "log4js"
import Long = require("long")
import { hyconfromString } from "../api/client/stringUtil"
import { strictAdd, TxValidity } from "../consensus/database/worldState"
import { userOptions } from "../main"
import { Server } from "../server"
import { Hash } from "../util/hash"
import { Address } from "./address"
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

const TX_BROADCAST_NUMBER: number = 4096
export class TxPool {
    private server: Server
    private seenTxsSet: Set<string> = new Set<string>()
    private seenTxs: string[] = []
    private pool: PriorityQueue<ITxQueue>

    private minFee: Long
    private maxAddresses: number
    private maxTxsPerAddress: number
    private accountMap: Map<string, ITxQueue>
    private transitionWaiting: SignedTx[]

    constructor(server: Server, minFee?: Long) {
        this.server = server
        this.transitionWaiting = []
        this.maxTxsPerAddress = userOptions.txPoolMaxTxsPerAddress
        this.maxAddresses = userOptions.txPoolMaxAddresses
        this.seenTxsSet = new Set<string>()
        this.seenTxs = []
        this.minFee = minFee === undefined ? Long.fromNumber(1, true) : minFee
        this.accountMap = new Map<string, ITxQueue>()
        this.pool = new PriorityQueue<ITxQueue>(this.maxAddresses, (a: ITxQueue, b: ITxQueue) => {
            return b.sum.compare(a.sum)
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
            const newTxHash = new Hash(tx).toString()
            if (this.seenTxsSet.has(newTxHash)) {
                continue
            }
            const oldTxs = this.seenTxs.splice(0, this.seenTxs.length - 10000)
            for (const oldTx of oldTxs) {
                this.seenTxsSet.delete(oldTx)
            }

            // Put to SeenTxs only when transaction is invalid or inserted to queue
            if (tx.fee.lessThan(this.minFee)) {
                this.putSeenTxs(newTxHash)
                continue
            }
            const validity = await this.server.consensus.txValidity(tx)
            if (validity === TxValidity.Invalid) {
                if (this.server.consensus.getLegacyTx() && tx.verify(false)) {
                    this.transitionWaiting.push(tx)
                }
                this.putSeenTxs(newTxHash)
                continue
            }
            const address = tx.from.toString()
            let itxqueue = this.accountMap.get(address)

            if (itxqueue === undefined) {
                const queue = new PriorityQueue<SignedTx>(this.maxTxsPerAddress, sortNonce)
                itxqueue = { address, queue, sum: Long.UZERO }
                if (!this.pool.insert(itxqueue)) { continue }
                this.accountMap.set(address, itxqueue)
            } else {
                // Check if tx is already inserted
                let duplicate = false
                for (const accountTx of itxqueue.queue.toArray()) {
                    const txHash = new Hash(accountTx).toString()
                    if (txHash === newTxHash) {
                        // tx is already in the txpool
                        duplicate = true
                        break
                    }
                }
                if (duplicate) {
                    continue
                }
            }
            if (itxqueue.queue.length() === 0 && validity === TxValidity.Waiting) {
                continue
            }
            if (itxqueue.queue.length() === 0) {
                if (itxqueue.queue.insert(tx)) {
                    itxqueue.sum = strictAdd(itxqueue.sum, tx.fee)
                    this.putSeenTxs(newTxHash)
                }
                broadcastTxs.push(tx)
            } else {
                const lastNonce: number = itxqueue.queue.peek(itxqueue.queue.length() - 1).nonce
                if (tx.nonce - lastNonce <= 1) {
                    if (itxqueue.queue.insert(tx)) {
                        itxqueue.sum = strictAdd(itxqueue.sum, tx.fee)
                        this.putSeenTxs(newTxHash)
                    }
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
            const txHash = new Hash(tx).toString()
            this.seenTxsSet.delete(txHash)
            if (txqueue.queue.length() <= 0) {
                this.accountMap.delete(address)
                this.pool.remove(txqueue)
            }
        }
        this.pool.resort()
    }

    public getTxs(count: number): SignedTx[] {
        const txs: SignedTx[] = []
        for (const txqueue of this.pool.toArray()) {
            for (let i = 0; i < txqueue.queue.length(); i++) {
                if (txs.length >= count) { return txs }
                const tx = txqueue.queue.peek(i)
                txs.push(tx)
            }
        }
        return txs
    }

    public getPending(index: number, count: number): { txs: SignedTx[], length: number, totalAmount: Long, totalFee: Long } {
        const txs = this.getTxs(4096).slice()
        let totalAmount = hyconfromString("0")
        let totalFee = hyconfromString("0")
        for (const tx of txs) {
            totalAmount = strictAdd(totalAmount, tx.amount)
            totalFee = strictAdd(totalFee, tx.fee)
        }
        let final = index + count
        final > txs.length ? final = txs.length : final = final
        return { txs: txs.slice(index, final), length: txs.length, totalAmount, totalFee }
    }

    // getTxsOfAddress is only for outside direction pending txs.
    public getOutPendingAddress(address: Address): SignedTx[] {
        const txqueue = this.accountMap.get(address.toString())
        if (txqueue === undefined) {
            return []
        }
        return txqueue.queue.toArray()
    }

    // getAllPendingAddress is for all direction pending txs.
    public getAllPendingAddress(address: Address): { pendings: SignedTx[], pendingAmount: Long } {
        let pendingAmount = Long.UZERO
        const pendings: SignedTx[] = []
        for (const txqueue of this.pool.toArray()) {
            for (let i = 0; i < txqueue.queue.length(); i++) {
                const tx = txqueue.queue.peek(i)
                if (tx.from.equals(address)) {
                    pendingAmount = strictAdd(strictAdd(pendingAmount, tx.amount), tx.fee)
                    pendings.push(tx)
                } else if (tx.to.equals(address)) {
                    pendings.push(tx)
                }
            }
        }
        return { pendings, pendingAmount }
    }

    public async transition() {
        const transitionWaiting = this.transitionWaiting
        this.transitionWaiting = []
        for (const tx of transitionWaiting) {
            const hash = new Hash(tx).toString()
            this.seenTxsSet.delete(hash)
        }
        return this.putTxs(transitionWaiting)
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

    private putSeenTxs(hash: string) {
        this.seenTxsSet.add(hash)
        this.seenTxs.push(hash)
    }

}

function compareTxs(a: SignedTx, b: SignedTx) {
    return new Hash(a).equals(new Hash(b))
}
