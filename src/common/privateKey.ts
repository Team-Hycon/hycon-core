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
            const hash = signatureHash(tx).toBuffer()
            const sign = secp256k1.sign(hash, this.privKey)

            return new SignedTx(tx, sign.signature, sign.recovery)
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
