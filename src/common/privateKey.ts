import { randomBytes } from "crypto"
import secp256k1 = require("secp256k1")
import { Hash } from "../util/hash"
import { PublicKey } from "./publicKey"
import { signatureHash, Tx } from "./tx"
import { GenesisTx } from "./txGenesis"
import { GenesisSignedTx } from "./txGenesisSigned"
import { SignedTx } from "./txSigned"

export class PrivateKey {
    public readonly privKey: Buffer
    constructor(privateKey?: Buffer) {
        if (privateKey !== undefined) {
            this.privKey = privateKey
            if (!secp256k1.privateKeyVerify(this.privKey)) {
                throw new Error("Invalid private key")
            }
        } else {
            do {
                this.privKey = randomBytes(32)
            } while (!secp256k1.privateKeyVerify(this.privKey))
        }
    }

    public toHexString(): string {
        return this.privKey.toString("hex")
    }

    public sign(tx: (Tx | GenesisTx)): (SignedTx | GenesisSignedTx) {
        if (tx instanceof Tx) {
            const newHash = signatureHash(tx).toBuffer()
            const newSignature = secp256k1.sign(newHash, this.privKey)
            if (Date.now() <= 1544241600000) {
                const oldHash = new Hash(tx).toBuffer()
                const oldSignatrue = secp256k1.sign(oldHash, this.privKey)
                const tx2 = Object.assign(tx, {
                    recovery: oldSignatrue.recovery,
                    signature: oldSignatrue.signature,
                    transitionRecovery: newSignature.recovery,
                    transitionSignature: newSignature.signature,
                })
                return new SignedTx(tx2)
            } else {
                return new SignedTx(tx, newSignature.signature, newSignature.recovery)
            }
        } else {
            const hash = new Hash(tx).toBuffer()
            const signature = secp256k1.sign(hash, this.privKey)
            return new GenesisSignedTx(tx, signature.signature, signature.recovery)
        }
    }

    public publicKey(): PublicKey {
        const buffer = secp256k1.publicKeyCreate(this.privKey)
        return new PublicKey(buffer)
    }
}
