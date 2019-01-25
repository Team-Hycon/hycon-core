
import { hycontoString } from "@glosfer/hyconjs-util"
import { GenesisSignedTx } from "../../common/txGenesisSigned"
import { SignedTx } from "../../common/txSigned"
import { DBTx } from "../../consensus/database/dbtx"
import { Hash } from "../../util/hash"

export class TxDTO {

    public static txToDTO(tx: GenesisSignedTx | SignedTx | DBTx, confirmation?: number) {
        const txDTO = new TxDTO()
        if (tx instanceof DBTx) {
            txDTO.amount = tx.amount
            txDTO.blockhash = tx.blockhash
            txDTO.blocktime = tx.blocktime
            txDTO.confirmation = confirmation
            txDTO.fee = tx.fee
            txDTO.from = tx.from
            txDTO.nonce = tx.nonce
            txDTO.to = tx.to
            txDTO.txhash = tx.txhash
            return txDTO
        }

        txDTO.amount = hycontoString(tx.amount)
        txDTO.to = tx.to.toString()
        txDTO.txhash = new Hash(tx).toString()

        if (tx instanceof SignedTx) {
            txDTO.fee = hycontoString(tx.fee)
            txDTO.from = tx.from.toString()
            txDTO.nonce = tx.nonce
        }
        return txDTO
    }

    public static txhashToDTO(hash: Hash) {
        const txDTO = new TxDTO()
        txDTO.txhash = hash.toString()
        return txDTO
    }

    public amount: string
    public blockhash: string
    public blocktime: number
    public confirmation: number
    public fee: string
    public from: string
    public nonce: number
    public to: string
    public txhash: string

    constructor() { }
}
