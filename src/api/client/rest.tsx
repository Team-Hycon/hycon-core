// tslint:disable:ban-types
export interface IResponseError {
    status: number,
    timestamp: number,
    error: string
    message: string
}

export interface IUser {
    idx: number
    uname: string
    pw: string
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
    active?: boolean
    currentQueue?: number
    location?: string
    latitude?: number
    longitude?: number
    successCount?: number
}

export interface ILocationDetails {
    location: string
    lat: number
    lng: number
    count: number
}

export interface ICreateWallet {
    passphrase?: string
    mnemonic?: string
    language?: string
    privateKey?: string
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
    index?: number
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
    networkHashRate: number
    currentMinerAddress: string
}

export interface IRest {
    loadingListener(callback: (loading: boolean) => void): void
    setLoading(loading: boolean): void
    // Exchange Featured
    createNewWallet(meta: IHyconWallet): Promise<IHyconWallet | IResponseError>
    getWalletBalance(address: string): Promise<{ balance: string } | IResponseError>
    getWalletTransactions(address: string, nonce?: number): Promise<{ txs: ITxProp[] } | IResponseError>

    outgoingSignedTx(tx: { privateKey: string, to: string, amount: string, fee: string, nonce: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError>
    outgoingTx(tx: { signature: string, from: string, to: string, amount: string, fee: string, nonce: number, recovery: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError>

    // tslint:disable:adjacent-overload-signatures
    // BlockExplorer
    // [Depreciated] changeAccount(name: string, represent: number): Promise<boolean>
    deleteWallet(name: string): Promise<boolean>
    generateWallet(Hwallet: IHyconWallet): Promise<string>
    getAddressInfo(address: string): Promise<IWalletAddress>
    getAllAccounts(name: string, password: string, startIndex: number): Promise<Array<{ address: string, balance: string }> | boolean>
    getBlock(hash: string): Promise<IBlock | IResponseError>
    getBlockList(index: number): Promise<{ blocks: IBlock[], length: number }>
    getTopTipHeight(): Promise<{ height: number }>
    getMnemonic(lang: string): Promise<string>
    // [ipeer.ts not implemented] getPeerDetails(hash: string): Promise<IPeer>
    // [ipeer.ts not implemented] getPeersList(hash: string): Promise<IPeer[]>
    getTx(hash: string): Promise<ITxProp | IResponseError>
    getWalletDetail(name: string): Promise<IHyconWallet | IResponseError>
    getWalletList(idx?: number): Promise<{ walletList: IHyconWallet[], length: number }>
    recoverWallet(Hwallet: IHyconWallet): Promise<string | boolean>
    // [Depreciated: Use above] recoverWalletForce(Hwallet: IHyconWallet): Promise<string | boolean>
    sendTx(tx: { name: string, password: string, address: string, amount: string, minerFee: string, nonce: number }, queueTx?: Function): Promise<{ res: boolean, case?: number }>
    getPeerList(): Promise<IPeer[]>
    getPeerConnected(index: number): Promise<{ peersInPage: IPeer[], pages: number }>
    getPendingTxs(index: number): Promise<{ txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }>
    getHint(name: string): Promise<string>
    getNextTxs(address: string, txHash: string, index: number): Promise<ITxProp[]>
    getNextTxsInBlock(blockhash: string, txHash: string, index: number): Promise<ITxProp[]>
    checkDupleName(name: string): Promise<boolean>
    getMinedBlocks(address: string, blockHash: string, index: number): Promise<IMinedInfo[]>
    getMiner(): Promise<IMiner>
    setMiner(address: string): Promise<boolean>
    startGPU(): Promise<boolean>
    setMinerCount(count: number): Promise<void>
    getFavoriteList(): Promise<Array<{ alias: string, address: string }>>
    addFavorite(alias: string, address: string): Promise<boolean>
    deleteFavorite(alias: string): Promise<boolean>
    addWalletFile(name: string, password: string, key: string): Promise<boolean>
    getLedgerWallet(startIndex: number, count: number): Promise<IHyconWallet[] | number>
    sendTxWithLedger(index: number, from: string, to: string, amount: string, fee: string, queueTx?: Function): Promise<{ res: boolean, case?: number }>
    possibilityLedger(): Promise<boolean>
    getMarketCap(): Promise<{ amount: string }>
}
