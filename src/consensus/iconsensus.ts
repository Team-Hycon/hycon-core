import { EventEmitter } from "events"
import { Address } from "../common/address"
import { AnyBlock, Block } from "../common/block"
import { GenesisBlock } from "../common/blockGenesis"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { GenesisSignedTx } from "../common/txGenesisSigned"
import { SignedTx } from "../common/txSigned"
import { Account } from "../consensus/database/account"
import { BlockStatus } from "../consensus/sync"
import { Hash } from "../util/hash"
import { DBMined } from "./database/dbMined"
import { DBTx } from "./database/dbtx"
import { TxValidity } from "./database/worldState"

export interface IStatusChange { oldStatus?: BlockStatus, status?: BlockStatus, htip?: boolean }

export type AnySignedTx = (GenesisSignedTx | SignedTx)

export type NewBlockCallback = (block: AnyBlock) => void
export interface IConsensus extends EventEmitter {
    init(): Promise<void>
    putBlock(block: Block): Promise<IStatusChange>
    putHeader(header: BlockHeader): Promise<IStatusChange>
    getBlockByHash(hash: Hash): Promise<AnyBlock>
    getHeaderByHash(hash: Hash): Promise<AnyBlockHeader>
    getBlocksRange(fromHeight: number, count?: number): Promise<AnyBlock[]>
    getHeadersRange(fromHeight: number, count?: number): Promise<AnyBlockHeader[]>
    getAccount(address: Address): Promise<Account>
    getLastTxs(address: Address, count?: number): Promise<DBTx[]>
    getNextTxs(address: Address, txHash: Hash, index: number, count?: number): Promise<DBTx[]>
    getMinedBlocks(address: Address, count?: number, index?: number, blockHash?: Hash): Promise<DBMined[]>
    getBlockStatus(hash: Hash): Promise<BlockStatus>
    getBlocksTip(): { hash: Hash, height: number, totalwork: number }
    getCurrentDiff(): number
    getHeadersTip(): { hash: Hash, height: number, totalwork: number }
    getTx(hash: Hash): Promise<{ tx: DBTx, confirmation: number } | undefined>
    txValidity(tx: SignedTx): Promise<TxValidity>
    getHash(height: number): Promise<Hash>
    getBlockHeight(hash: Hash): Promise<number | undefined>
    getBlockAtHeight(height: number): Promise<Block | GenesisBlock | undefined>
}
