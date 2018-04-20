import { Address } from "./address"
import { SignedTx } from "./txSigned"
type TopTxCallback = (txs: SignedTx[]) => void
export interface ITxPool {
    putTxs(txs: SignedTx[]): Promise<number>
    getTxs(): SignedTx[]
    removeTxs(old: SignedTx[], maxReturn?: number): SignedTx[]
    getPending(index: number, count: number): { txs: SignedTx[], length: number, totalAmount: Long, totalFee: Long }
    getTxsOfAddress(address: Address): SignedTx[] | undefined
    isExist(address: Address): { isExist: boolean, totalAmount?: Long, lastNonce?: number }
}
