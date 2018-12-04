// tslint:disable:ban-types
export interface IResponseError {
    status: number,
    timestamp: number,
    error: string
    message: string
}

export interface ITxProp {
    hash: string
    amount: string
    estimated: string
    receiveTime?: number
    confirmation?: number
    blockHash?: string
    fee?: string
    from?: string
    to?: string
    signature?: string
    nonce?: number
}
export interface IBlock {
    hash: string
    height?: number
    txs: ITxProp[]
    timeStamp: number
    amount?: string
    fee?: string
    length?: number
    volume?: string
    difficulty: string
    prevBlock?: string
    nonce?: string
    txSummary?: string
    resultHash?: string
    stateRoot?: string
    merkleRoot?: string
    miner?: string
}
export interface IWalletAddress {
    hash: string
    balance: string
    nonce: number
    txs: ITxProp[]
    pendings?: ITxProp[]
    minedBlocks?: IMinedInfo[]
    pendingAmount?: string
}
export interface IPeer {
    host: string
    port: number
    lastSeen?: string
    failCount?: number
    lastAttempt?: string
    active?: number
    successCount?: number
}

export interface ICreateWallet {
    passphrase?: string
    mnemonic?: string
    language?: string
    privateKey?: string
    rootKey?: string
    index?: number
}

export interface IHyconWallet {
    name?: string
    passphrase?: string
    password?: string
    hint?: string
    mnemonic?: string
    address?: string
    balance?: string
    txs?: ITxProp[]
    pendings?: ITxProp[]
    language?: string
    pendingAmount?: string
    minedBlocks?: IMinedInfo[]
    rootKey?: string // Related with HDwallet api, return IHyconWallet with rootKey
    index?: number
    privateKey?: string // Related with wallet api, return IHyconWallet with privateKey
}

export interface IMinedInfo {
    blockhash: string
    timestamp: number
    miner: string
    feeReward: string
}

export interface IMiner {
    cpuHashRate: number
    cpuCount: number
    networkHashRate: string
    currentMinerAddress: string
}
