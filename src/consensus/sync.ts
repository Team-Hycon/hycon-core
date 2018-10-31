import { Hash } from "../util/hash"

export enum BlockStatus {
    Rejected = -1,
    Nothing = 0,
    Header = 1,
    InvalidBlock = 1.5, // The header is valid,  it's uncles or block is invalid, May become an uncle, but never MainChain
    Block = 2,
    MainChain = 3,
}

export interface ITip {
    hash: Hash,
    height: number,
    totalwork: number
}
