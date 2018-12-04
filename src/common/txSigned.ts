import { getLogger } from "log4js"
import * as Long from "long"
import secp256k1 = require("secp256k1")
import { Address } from "../common/address"
import { PublicKey } from "../common/publicKey"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
import { signatureHash } from "./tx"
import { GenesisSignedTx } from "./txGenesisSigned"
const logger = getLogger("TxSigned")

export type AnySignedTx = (GenesisSignedTx | SignedTx)

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
    public transitionSignature: Buffer
    public transitionRecovery: number

    constructor(tx: proto.ITx, signature?: Uint8Array, recovery?: number) {
        if (signature !== undefined) {
            if (tx.signature !== undefined) {
                throw new Error("Two signature information exists.")
            }
            tx.signature = signature
        }
        if (recovery !== undefined) {
            if (tx.recovery !== undefined) {
                throw new Error("Two recovery information exists.")
            }
            tx.recovery = recovery
        }
        this.set(tx)
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

        // After decode singedTx, if there isnt transitionSignatrue and transitionRecovery, they will be Buffer[0] and 0.
        if (stx.transitionSignature !== undefined && stx.transitionSignature.length > 0) {
            this.transitionSignature = Buffer.from(stx.transitionSignature as Buffer)
            if (stx.transitionRecovery !== undefined) { this.transitionRecovery = stx.transitionRecovery }
        }

        this.signature = Buffer.from(stx.signature as Buffer)
        this.recovery = stx.recovery
    }
    public encode(): Uint8Array {
        return proto.Tx.encode(this).finish()
    }

    public verify(legacy: boolean): boolean {
        // Consensus Critical
        try {
            if (this.signature === undefined || this.recovery === undefined) { return false }
            let hash
            if (legacy) {
                hash = new Hash(this).toBuffer()
            } else {
                hash = signatureHash(this).toBuffer()
            }
            const pubKey = new PublicKey(secp256k1.recover(hash, this.signature, this.recovery))
            const address = pubKey.address()
            if (!this.from.equals(address)) { return false }
            return secp256k1.verify(hash, this.signature, pubKey.pubKey)
        } catch (e) {
            return false
        }
    }
}
