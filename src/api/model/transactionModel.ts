import { hyconfromString, hycontoString, strictAdd } from "@glosfer/hyconjs-util"
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../../common/address"
import { TxPool } from "../../common/txPool"
import { SignedTx } from "../../common/txSigned"
import { Consensus } from "../../consensus/consensus"
import { DBTx } from "../../consensus/database/dbtx"
import { RestManager } from "../../rest/restManager"
import { Hash } from "../../util/hash"
import { TxDTO } from "../dto/txDTO"
import { IResponseError } from "../interface/iRestResponse"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("TransactionModel")

// tslint:disable:no-bitwise

export class TransactionModel {
    private consensus: Consensus
    private txPool: TxPool
    private hyconServer: RestManager
    constructor(consensus: Consensus, hyconServer: RestManager) {
        this.consensus = consensus
        this.hyconServer = hyconServer
        this.txPool = hyconServer.txQueue
    }

    public async getTx(hashOrAddress: string, count: number = 10) {
        try {
            if (hashOrAddress === undefined) { return Responser.missingParameter() }
            count = Number(count)
            const value = this.getValue(hashOrAddress)
            if (value === undefined) {
                return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `The parameter must be the hash of the transaction or address.`)
            }
            if (value instanceof Hash) {
                return this.getTxByHash(value)
            }
            if (isNaN(count) || count <= 0) { return Responser.invalidParam() }
            return this.getTxsByAddress(value, count)
        } catch (e) {
            logger.warn(`Failed to getTx : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, e.toString())
        }
    }

    public async outgoingTx(from: string, to: string, amount: string, fee: string, signature: string, recovery: number, nonce: number) {
        try {
            if (from === undefined || to === undefined || amount === undefined || fee === undefined || signature === undefined || recovery === undefined || nonce === undefined) {
                return Responser.missingParameter()
            }
            const stx = new SignedTx({
                amount: hyconfromString(amount),
                fee: hyconfromString(fee),
                from: new Address(from),
                nonce: nonce | 0,
                recovery: recovery | 0,
                signature: Buffer.from(signature, "hex"),
                to: new Address(to),
            })

            if (!stx.verify(false)) {
                return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `transaction(${new Hash(stx)}) information or signature is incorrect.`)
            }

            const validAmount = await this.validAmountCheck(stx.from, stx.amount, stx.fee, stx.nonce)
            if (!validAmount) {
                return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `Insufficient wallet(${from}) balance to send transaction.`)
            }
            // TODO : Queue Tx
            const txs = await this.txPool.putTxs([stx])
            this.hyconServer.broadcastTxs(txs)
            return TxDTO.txhashToDTO(new Hash(stx))
        } catch (e) {
            logger.warn(`Failed to outgoingTx : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, e.toString())
        }
    }

    public async getPendingTxs(address: string, count: number) {
        try {
            if (count !== undefined) {
                count = Number(count)
                if (isNaN(count) || count <= 0) { return Responser.invalidParam() }
            }
            let pendingTxs: SignedTx[] = []
            if (address === undefined) {
                pendingTxs = this.txPool.getTxs(count)
            } else {
                const addressPendingTxs = this.txPool.getAllPendingAddress(new Address(address), count)
                pendingTxs = addressPendingTxs.pendings
            }
            const { totalPending, txsDTO } = this.calculatePendingTxs(pendingTxs, address)
            return { address, count: txsDTO.length, totalPending: hycontoString(totalPending), pendingTxs: txsDTO }
        } catch (e) {
            logger.warn(`Failed to getPendingTxs : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, e.toString())
        }
    }

    private async validAmountCheck(from: Address, amount: Long, fee: Long, nonce: number): Promise<boolean> {
        const pendingTxs = this.txPool.getOutPendingAddress(from)
        const { totalPending } = this.calculatePendingTxs(pendingTxs, from.toString(), nonce)

        const account = await this.consensus.getAccount(from)
        if (account === undefined) { return false }
        const totalSend = strictAdd(strictAdd(amount, fee), totalPending)
        if (account.balance.lessThan(totalSend)) {
            return false
        }
        return true
    }

    private calculatePendingTxs(pendingTxs: SignedTx[], address: string, nonce?: number): { totalPending: Long, txsDTO: TxDTO[] } {
        let totalPending = Long.UZERO
        const txsDTO: TxDTO[] = []
        for (const pending of pendingTxs) {
            if (nonce !== undefined && pending.nonce === nonce) { break }
            if ((address === undefined) || (address !== undefined && pending.from.toString() === address)) {
                totalPending = strictAdd(totalPending, strictAdd(pending.fee, pending.amount))
            }
            txsDTO.push(TxDTO.txToDTO(pending))
        }
        return { totalPending, txsDTO }
    }

    private txsToDTOs(dbtxs: DBTx[]) {
        const txs: TxDTO[] = []
        for (const dbtx of dbtxs) {
            txs.push(TxDTO.txToDTO(dbtx))
        }
        return txs
    }

    private async getTxsByAddress(address: Address, count: number) {
        const dbtxs: DBTx[] = await this.consensus.getLastTxs(address, count)
        const txs = this.txsToDTOs(dbtxs)
        return txs
    }

    private async getTxByHash(hash: Hash): Promise<TxDTO | IResponseError> {
        const tx = await this.consensus.getTx(hash)
        if (tx === undefined) {
            return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `The transaction(${hash}) does not exist in the txDB.`)
        }
        return TxDTO.txToDTO(tx.tx, tx.confirmation)
    }

    private getValue(str: string): Address | Hash | undefined {
        try {
            return new Address(str)
        } catch (e) {
            return this.getHash(str)
        }
    }

    private getHash(str: string): Hash | undefined {
        try {
            return Hash.decode(str)
        } catch (e) {
            return undefined
        }
    }

}
