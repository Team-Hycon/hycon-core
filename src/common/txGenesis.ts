import { getLogger } from "log4js"
import * as Long from "long"
import { Address } from "../common/address"
import * as proto from "../serialization/proto"
const logger = getLogger("TxGenesis")
export class GenesisTx implements proto.ITx {
    public to: Address
    public amount: Long

    constructor(tx?: proto.ITx) {
        if (tx) { this.set(tx) }
    }

    public set(tx: proto.ITx) {
        if (tx.to === undefined) {
            throw new Error("to address not defined in input")
        }
        if (tx.amount === undefined) {
            throw new Error("amount not defined in input")
        }

        this.to = new Address(tx.to)
        this.amount = tx.amount instanceof Long ? tx.amount : Long.fromNumber(tx.amount, true)
        if (!this.amount.unsigned) {
            logger.fatal(`Protobuf problem with TxGenesis amount`)
            throw new Error("Protobuf problem with TxGenesis amount")
        }
    }

    public equals(tx: GenesisTx): boolean {
        if (!this.to.equals(tx.to)) { return false }
        if (!this.amount.equals(tx.amount)) { return false }
        return true
    }
    public encode(): Uint8Array {
        return proto.Tx.encode(this).finish()
    }
}
