import { Hash } from "../util/hash"

export enum BlockStatus {
    Rejected = -1,
    Nothing = 0,
    Header = 1,
    Block = 2,
    MainChain = 3,
}

export interface ITip {
    hash: Hash,
    height: number,
    totalwork: number
}
