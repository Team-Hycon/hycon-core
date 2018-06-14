import * as Long from "long"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"
export type GenesisBlockHeader = BaseBlockHeader
export class BaseBlockHeader implements proto.IBlockHeader {
    public merkleRoot: Hash
    public timeStamp: number
    public difficulty: number
    public stateRoot: Hash

    // Consensus Critical
    constructor() { }

    public set(header: proto.IBlockHeader): void {
        // Consensus Critical
        if (!header) {
            throw new Error("Header is missing")
        }
        if (header.merkleRoot === undefined) {
            throw new Error("Header missing merkle root")
        }
        if (header.stateRoot === undefined || header.stateRoot.byteLength === 0) {
            throw new Error("Header missing state root")
        }
        if (header.timeStamp === undefined || header.timeStamp.valueOf() < 151500330500) {
            throw new Error("Header missing timeStamp")
        }
        if (header.difficulty === undefined || header.difficulty == null) {
            throw new Error("Header missing difficulty")
        }

        if (this.merkleRoot) {
            this.merkleRoot.set(header.merkleRoot)
        } else {
            this.merkleRoot = new Hash(header.merkleRoot)
        }

        if (this.stateRoot) {
            this.stateRoot.set(header.stateRoot)
        } else {
            this.stateRoot = new Hash(header.stateRoot)
        }

        this.timeStamp = header.timeStamp instanceof Long ? header.timeStamp.toNumber() : header.timeStamp
        this.difficulty = header.difficulty
    }

    public encode(): Uint8Array {
        return proto.BlockHeader.encode(this).finish()
    }
}

export function GenesisBlockHeader(): GenesisBlockHeader {
    const genesis = new BaseBlockHeader()
    genesis.set({
        difficulty: 1,
        merkleRoot: new Hash(),
        stateRoot: new Hash(),
        timeStamp: 151500330500,
    })
    return genesis
}

export function setGenesisBlockHeader(header: proto.IGenesisBlockHeader): GenesisBlockHeader {
    // Consensus Critical
    const genesis = new BaseBlockHeader()
    genesis.set({
        difficulty: header.difficulty,
        merkleRoot: header.merkleRoot,
        stateRoot: header.stateRoot,
        timeStamp: header.timeStamp,
    })
    return genesis
}
