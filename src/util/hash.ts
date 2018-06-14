import Base58 = require("base-58")
import blake2b = require("blake2b")
import { Block } from "../common/block"
import { AnyBlockHeader, BlockHeader } from "../common/blockHeader"
import { BaseBlockHeader, GenesisBlockHeader } from "../common/genesisHeader"
import { Tx } from "../common/tx"
import { GenesisTx } from "../common/txGenesis"
import { GenesisSignedTx } from "../common/txGenesisSigned"
import { SignedTx } from "../common/txSigned"
import { Account } from "../consensus/database/account"
import { StateNode } from "../consensus/database/stateNode"
import * as proto from "../serialization/proto"
// tslint:disable-next-line:no-var-requires
const cryptonight = require("node-cryptonight").asyncHash

function toUint8Array(ob?: Tx | Block | GenesisBlockHeader | BlockHeader | string | SignedTx | GenesisTx | GenesisSignedTx | StateNode | Account | Uint8Array | Buffer): Uint8Array {
    // Consensus Critical
    if (ob !== undefined) {
        if (typeof ob === "string") {
            return Hash.hash(ob)
        } else if (ob instanceof Uint8Array || ob instanceof Buffer) {
            if (ob.length !== 32) {
                throw new Error(`Hash length ${ob.length} but should be 32`)
            }
            return ob
        } else if (ob instanceof SignedTx || ob instanceof GenesisSignedTx) {
            const usignedTx = Object.assign({}, ob)
            delete usignedTx.recovery
            delete usignedTx.signature
            return Hash.hash(proto.Tx.encode(usignedTx).finish())
        } else if (ob instanceof Tx || ob instanceof BlockHeader || ob instanceof BaseBlockHeader || ob instanceof Block || ob instanceof StateNode || ob instanceof Account || ob instanceof GenesisBlockHeader || ob instanceof GenesisTx) {
            return Hash.hash(ob.encode())
        }
        // Danger: typescript claims this line is unreachable, but it is reachable via the slice function
        if (ob === 32) {
            return ob // Here we return the number 32
        }
        throw new Error("Trying to allocate a hash which is not 32 bytes long")
    }
    return Hash.emptyHash
}

export class Hash extends Uint8Array {
    public static readonly emptyHash = blake2b(32).digest()

    public static hash(ob: Uint8Array | string): Uint8Array {
        // Consensus Critical
        typeof ob === "string" ? ob = Buffer.from(ob) : ob = ob
        return blake2b(32).update(ob).digest()
    }

    public static async hashCryptonight(ob: Uint8Array | string): Promise<Uint8Array> {
        // Consensus Critical
        if (typeof ob === "string") {
            ob = Buffer.from(ob)
        }
        return new Promise<Uint8Array>((resolve, reject) => {
            cryptonight(ob, (hash: any) => {
                return resolve(new Uint8Array(hash))
            })
        })
    }

    public static decode(str: string): Hash {
        return new Hash(Base58.decode(str))
    }

    constructor(ob?: Tx | Block | GenesisBlockHeader | BlockHeader | string | SignedTx | GenesisTx | GenesisSignedTx | StateNode | Account | Uint8Array | Buffer) {
        // Consensus Critical
        super(toUint8Array(ob))
    }

    public toString(): string {
        return Base58.encode(this)
    }

    public toHex() {
        return Buffer.from(this as Uint8Array as Buffer).toString("hex")
    }

    public toBuffer(): Buffer {
        // Consensus Critical
        return Buffer.from(this as Uint8Array as Buffer)
    }

    public equals(other: ArrayLike<number>): boolean {
        // Consensus Critical
        if (this.length !== other.length) { return false }
        for (let i = 0; i < other.length; i++) {
            if (this[i] !== other[i]) {
                return false
            }
        }
        return true
    }
}
