import { Address } from "./address"
import { SignedTx } from "./txSigned"
type TopTxCallback = (txs: SignedTx[]) => void
export interface ITxPool {
    putTxs(txs: SignedTx[]): Promise<SignedTx[]>
    getTxs(count: number): SignedTx[]
    removeTxs(old: SignedTx[], maxReturn?: number): void
    getPending(index: number, count: number): { txs: SignedTx[], length: number, totalAmount: Long, totalFee: Long }
    getTxsOfAddress(address: Address): SignedTx[]
}
