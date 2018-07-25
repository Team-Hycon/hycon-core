import { Address } from "../../common/address"
import { Hash } from "../../util/hash"
import { AnySignedTx, IConsensus } from "../iconsensus"
import { DBTx } from "./dbtx"
export interface ITxDatabase {
    init(consensus: IConsensus, tipHeight?: number): Promise<void>
    getLastBlock(idx: number): Promise<Hash | undefined>
    putTxs(blockHash: Hash, timestamp: number, txs: AnySignedTx[]): Promise<void>
    getLastTxs(address: Address, result: DBTx[], idx: number, count?: number): Promise<DBTx[]>
    getTxsInBlock(blockHash: string, result: DBTx[], idx: number, count?: number): Promise<{ txs: DBTx[], amount: string, fee: string, length: number }>
    getNextTxs(address: Address, txHash: Hash, result: DBTx[], idx: number, count?: number): Promise<DBTx[]>
    getNextTxsInBlock(blockHash: string, txHash: string, result: DBTx[], idx: number, count?: number): Promise<DBTx[]>
    getTx(key: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined>
    getBurnAmount(): Promise<{ amount: Long }>
}
