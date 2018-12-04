import secp256k1 = require("secp256k1")
import { Hash } from "../util/hash"
import { Address } from "./address"
import { GenesisSignedTx } from "./txGenesisSigned"
import { SignedTx } from "./txSigned"

export class PublicKey {
    public readonly pubKey: Buffer

    constructor(pubKeySource: (SignedTx | GenesisSignedTx | Buffer)) {
        // Consensus Critical
        if (pubKeySource instanceof Buffer) {
            this.pubKey = pubKeySource
        } else {
            const hash = new Hash(pubKeySource)
            this.pubKey = secp256k1.recover(hash.toBuffer(), pubKeySource.signature, pubKeySource.recovery)
        }
    }

    public address(): Address {
        // Consensus Critical
        const hash: Uint8Array = Hash.hash(this.pubKey)
        const add = new Uint8Array(20)
        for (let i = 12; i < 32; i++) {
            add[i - 12] = hash[i]
        }
        const address = new Address(add)
        return address
    }
}
