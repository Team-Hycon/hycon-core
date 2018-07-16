import { getLogger } from "log4js"
import * as Long from "long"
import { Address } from "../common/address"
import { PublicKey } from "../common/publicKey"
import * as proto from "../serialization/proto"
const logger = getLogger("TxSigned")
export class SignedTx implements proto.ITx {
    public static decode(data: Uint8Array): SignedTx {
        const stx = proto.Tx.decode(data)
        return new SignedTx(stx)
    }
    public from: Address
    public to: Address
    public amount: Long
    public fee: Long
    public nonce: number
    public signature: Buffer
    public recovery: number

    constructor(tx?: proto.ITx, signature?: Uint8Array, recovery?: number) {
        if (tx) {
            if (signature !== undefined) {
                if (tx.signature === undefined) {
                    tx.signature = signature
                } else { throw new Error("Two signature information exists.") }
            }
            if (recovery !== undefined) {
                if (tx.recovery === undefined) {
                    tx.recovery = recovery
                } else { throw new Error("Two recovery information exists.") }
            }
            this.set(tx)
        }
    }

    public set(stx: proto.ITx): void {
        if (stx.from === undefined) { throw (new Error("from address not defined in input")) }
        if (stx.amount === undefined) { throw (new Error("amount not defined in input")) }
        if (stx.fee === undefined) { throw (new Error("fee not defined in input")) }
        if (stx.nonce === undefined) { throw (new Error("nonce not defined in input")) }
        if (stx.signature === undefined) { throw (new Error("signature not defined in input")) }
        if (stx.recovery === undefined) { throw (new Error("recovery not defined in input")) }

        this.from = new Address(stx.from)
        if (stx.to !== undefined && stx.to.length > 0) {
            this.to = new Address(stx.to)
        }
        this.amount = stx.amount instanceof Long ? stx.amount : Long.fromNumber(stx.amount, true)
        if (this.amount.lessThan(0)) {
            throw new Error("Transaction amount can not be negative")
        }
        this.fee = stx.fee instanceof Long ? stx.fee : Long.fromNumber(stx.fee, true)
        if (this.fee.lessThan(0)) {
            throw new Error("Transaction fee can not be negative")
        }
        if (!this.amount.unsigned || !this.fee.unsigned) {
            logger.fatal(`Protobuf problem with SignedTx (amount | fee) `)
            throw new Error("Protobuf problem with SignedTx (amount | fee) ")
        }
        this.nonce = stx.nonce
        this.signature = Buffer.from(stx.signature as Buffer)
        this.recovery = stx.recovery
    }

    public equals(tx: SignedTx): boolean {
        if (!this.amount.equals(tx.amount)) {
            return false
        }
        if (!this.fee.equals(tx.fee)) {
            return false
        }
        if (this.nonce !== tx.nonce) {
            return false
        }
        if (this.recovery !== tx.recovery) {
            return false
        }
        if (this.to !== undefined && !this.to.equals(tx.to)) {
            return false
        }
        if (this.to === undefined && tx.to !== undefined) {
            return false
        }
        if (!this.from.equals(tx.from)) {
            return false
        }
        if (!this.signature.equals(tx.signature)) {
            return false
        }
        return true
    }

    public encode(): Uint8Array {
        return proto.Tx.encode(this).finish()
    }

    public verify(): boolean {
        // Consensus Critical
        try {
            const pubkey = new PublicKey(this)
            return pubkey.verify(this)
        } catch (e) {
            return false
        }
    }
}
