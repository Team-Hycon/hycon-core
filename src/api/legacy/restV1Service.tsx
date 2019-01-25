import { getMnemonic, hyconfromString, hycontoString, strictAdd, strictSub, zeroPad } from "@glosfer/hyconjs-util"
import { getLogger } from "log4js"
import * as Long from "long"
import { Address } from "../../common/address"
import { AsyncLock } from "../../common/asyncLock"
import { AnyBlock } from "../../common/block"
import { BlockHeader } from "../../common/blockHeader"
import { PrivateKey } from "../../common/privateKey"
import { GenesisSignedTx } from "../../common/txGenesisSigned"
import { TxPool } from "../../common/txPool"
import { SignedTx } from "../../common/txSigned"
import { Consensus, START_HEIGHT } from "../../consensus/consensus"
import { DBBlock } from "../../consensus/database/dbblock"
import { DBMined } from "../../consensus/database/dbMined"
import { DBTx } from "../../consensus/database/dbtx"
import { userOptions } from "../../main"
import { MinerServer } from "../../miner/minerServer"
import { Network } from "../../network/network"
import { Hash } from "../../util/hash"
import { Bitbox } from "../../wallet/bitbox"
import { Ledger } from "../../wallet/ledger"
import { Wallet } from "../../wallet/wallet"
import { IBlock, ICreateWallet, IHyconWallet, IMinedInfo, IMiner, IPeer, IResponseError, ITxProp, IWalletAddress } from "../client/rest"
const logger = getLogger("RestV1Service")

// tslint:disable:object-literal-sort-keys
// tslint:disable:ban-types
// tslint:disable:no-bitwise
export class RestV1Service {
    private consensus: Consensus
    private txPool: TxPool
    private network: Network
    private miner: MinerServer

    private txNonceLock: AsyncLock

    constructor(consensus: Consensus, network: Network, txPool: TxPool, miner: MinerServer) {
        this.consensus = consensus
        this.network = network
        this.txPool = txPool
        this.miner = miner
        this.txNonceLock = new AsyncLock()
    }

    public createNewWallet(meta: ICreateWallet): Promise<IHyconWallet | IResponseError> {
        try {
            const hyconWallet: IHyconWallet = meta
            if (meta.privateKey === undefined) {
                if (meta.mnemonic === undefined) { meta.mnemonic = Wallet.getRandomMnemonic(meta.language) }
                const wallet = Wallet.generateKeyWithMnemonic(meta.mnemonic, meta.language, meta.passphrase)
                Object.assign(hyconWallet, {
                    privateKey: wallet.privKey.toHexString(),
                    address: wallet.pubKey.address().toString(),
                })
            } else {
                let privateKey: PrivateKey
                if (meta.mnemonic) {
                    privateKey = Wallet.generateKeyWithMnemonic(meta.mnemonic, meta.language, meta.passphrase).privKey
                    if (privateKey.toHexString() !== meta.privateKey) {
                        throw new Error("INVALID_PARAMETER : Mnemonic and PrivateKey does not match.")
                    }
                } else { delete hyconWallet.passphrase }
                if (!privateKey) { privateKey = new PrivateKey(Buffer.from(meta.privateKey, "hex")) }
                Object.assign(hyconWallet, {
                    address: privateKey.publicKey().address().toString(),
                })
            }
            return Promise.resolve(hyconWallet)
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
        }
    }

    public createNewHDWallet(meta: ICreateWallet): Promise<IHyconWallet | IResponseError> {
        try {
            const hyconWallet: IHyconWallet = meta
            if (meta.rootKey === undefined) {
                if (meta.mnemonic === undefined) { meta.mnemonic = Wallet.getRandomMnemonic(meta.language) }
                const wallet = Wallet.generateHDWalletWithMnemonic(meta.mnemonic, meta.language, meta.passphrase)
                Object.assign(hyconWallet, {
                    rootKey: wallet.rootKey,
                    address: meta.index !== undefined ? wallet.getAddressOfHDWallet(meta.index) : undefined,
                })
            } else {
                let wallet: Wallet
                if (meta.mnemonic) {
                    wallet = Wallet.generateHDWalletWithMnemonic(meta.mnemonic, meta.language, meta.passphrase)
                    if (wallet.rootKey !== meta.rootKey) {
                        throw new Error("INVALID_PARAMETER : Mnemonic and RootKey does not match.")
                    }
                } else { delete hyconWallet.passphrase }
                if (!wallet) { wallet = new Wallet(meta.rootKey) }
                Object.assign(hyconWallet, {
                    address: meta.index !== undefined ? wallet.getAddressOfHDWallet(meta.index) : undefined,
                })
            }
            return Promise.resolve(hyconWallet)
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
        }
    }

    public async getWalletBalance(address: string): Promise<{ balance: string } | IResponseError> {
        try {
            const addressOfWallet = new Address(address)
            const account = await this.consensus.getAccount(addressOfWallet)
            if (account === undefined) {
                return Promise.resolve({
                    status: 404,
                    timestamp: Date.now(),
                    error: "NOT_FOUND",
                    message: "the resource cannot be found / currently unavailable",
                })
            } else {
                const a = account.balance
                return Promise.resolve({
                    balance: account ? hycontoString(account.balance) : "0",
                })
            }
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_ADDRESS",
                message: e.toString(),
            })
        }
    }

    public async getWalletTransactions(address: string, nonce?: number): Promise<{ txs: ITxProp[] } | IResponseError> {
        try {
            const addressOfWallet = new Address(address)
            const account = await this.consensus.getAccount(addressOfWallet)
            if (account === undefined) {
                return Promise.resolve({
                    status: 404,
                    timestamp: Date.now(),
                    error: "NOT_FOUND",
                    message: "the resource cannot be found / currently unavailable",
                })
            }

            const n = 10
            const results = await this.consensus.getLastTxs(addressOfWallet, n)
            const webTxs: ITxProp[] = []
            for (const result of results) {
                let webTx: ITxProp
                webTx = {
                    hash: result.txhash,
                    amount: result.amount,
                    fee: result.fee,
                    from: result.from,
                    to: result.to,
                    estimated: hycontoString(strictAdd(hyconfromString(result.amount), (hyconfromString(result.fee)))),
                    receiveTime: result.blocktime,
                }
                webTxs.push(webTx)
            }

            return Promise.resolve({
                txs: webTxs,
            })
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_ADDRESS",
                message: e.toString(),
            })
        }
    }

    public async outgoingSignedTx(tx: { privateKey: string, to: string, amount: string, fee: string, nonce?: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        return this.txNonceLock.critical(async () => {
            try {
                const address = new Address(tx.to)
                const wallet = new Wallet(Buffer.from(tx.privateKey, "hex"))
                const from = new Address(wallet.pubKey.address())
                const account = await this.consensus.getAccount(from)
                const pendingTxs = this.txPool.getOutPendingAddress(from)
                let nonce = tx.nonce
                if (nonce === undefined) {
                    nonce = account.nonce + 1
                    for (const pendingTx of pendingTxs) {
                        if (nonce <= pendingTx.nonce) {
                            nonce = pendingTx.nonce + 1
                        }
                    }
                }
                const total = strictAdd(hyconfromString(tx.amount), hyconfromString(tx.fee))
                logger.debug(`Total HYC: ${hycontoString(total)}`)
                logger.debug(`Account Balance: ${hycontoString(account.balance)}`)
                logger.debug(`Boolean: ${account.balance.lessThan(total)}`)
                if (account.balance.lessThan(total)) {
                    throw new Error("insufficient wallet balance to send transaction")
                }
                const signedTx = wallet.send(address, hyconfromString(tx.amount.toString()), nonce, hyconfromString(tx.fee.toString()))
                const txHash = new Hash(signedTx).toString()
                if (queueTx) {
                    logger.info(`Sending TX ${txHash} {from: ${signedTx.from}, to: ${signedTx.to}, amount: ${signedTx.amount}, fee: ${signedTx.fee}, nonce: ${signedTx.nonce}}`)
                    queueTx(signedTx)
                } else {
                    throw new Error("could not queue transaction")
                }
                return { txHash }
            } catch (e) {
                return {
                    status: 404,
                    timestamp: Date.now(),
                    error: "INVALID_PARAMETER",
                    message: e.toString(),
                }
            }

        })
    }

    public async outgoingTx(tx: { signature: string, from: string, to: string, amount: string, fee: string, nonce: number, recovery: number, transitionSignature: string, transitionRecovery: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        try {
            const fromAddress = new Address(tx.from)

            const txObject = {
                from: fromAddress,
                to: new Address(tx.to),
                amount: hyconfromString(tx.amount),
                fee: hyconfromString(tx.fee),
                nonce: tx.nonce,
                signature: Buffer.from(tx.signature, "hex"),
                recovery: tx.recovery | 0,
                transitionSignature: tx.transitionSignature !== undefined ? Buffer.from(tx.transitionSignature, "hex") : undefined,
                transitionRecovery: tx.transitionRecovery !== undefined ? tx.transitionRecovery | 0 : undefined,
            }
            const legacyTx = this.consensus.getLegacyTx()

            const signedTx = new SignedTx(txObject)
            if (!signedTx.verify(legacyTx)) {
                if (signedTx.transitionSignature !== undefined && signedTx.transitionRecovery !== undefined) {
                    signedTx.signature = signedTx.transitionSignature
                    signedTx.recovery = signedTx.transitionRecovery
                    if (!signedTx.verify(legacyTx)) {
                        throw new Error("transaction information or signature is incorrect")
                    }
                    delete tx.transitionSignature
                    delete tx.transitionRecovery
                } else {
                    throw new Error("transaction information or signature is incorrect")
                }
            }

            const pendings = this.txPool.getOutPendingAddress(fromAddress)
            let pendingAmount = hyconfromString("0")
            for (const pendingTx of pendings) {
                if (pendingTx.nonce === tx.nonce) {
                    break
                }
                pendingAmount = strictAdd(pendingAmount, strictAdd(pendingTx.amount, pendingTx.fee))
            }
            const account = await this.consensus.getAccount(fromAddress)
            const total = strictAdd(strictAdd(hyconfromString(tx.amount), hyconfromString(tx.fee)), pendingAmount)
            if (account.balance.lessThan(total)) {
                throw new Error("insufficient wallet balance to send transaction")
            }
            if (queueTx) {
                await queueTx(signedTx)
            } else {
                throw new Error("could not queue transaction")
            }
            return Promise.resolve({
                txHash: new Hash(signedTx).toString(),
            })
        } catch (e) {
            return {
                status: 404,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            }
        }
    }

    public async deleteWallet(name: string): Promise<boolean> {
        try {
            await Wallet.walletInit()
            const resultBool = await Wallet.delete(name)
            return Promise.resolve(resultBool)
        } catch (e) {
            return Promise.resolve(false)
        }
    }

    public async generateWallet(Hwallet: IHyconWallet): Promise<string> {
        await Wallet.walletInit()
        if (Hwallet.name !== undefined && Hwallet.mnemonic !== undefined && Hwallet.language !== undefined) {
            let password = Hwallet.password
            let hint = Hwallet.hint
            let passphrase = Hwallet.passphrase
            if (Hwallet.password === undefined) { password = "" }
            if (Hwallet.passphrase === undefined) { passphrase = "" }
            if (Hwallet.hint === undefined) { hint = "" }
            const wallet = Wallet.generate({ name: Hwallet.name, passphrase, mnemonic: Hwallet.mnemonic, language: Hwallet.language, hint })
            await wallet.save(Hwallet.name, password, hint)
            const address = await Wallet.getAddress(Hwallet.name)
            return Promise.resolve(address.toString())
        } else {
            return Promise.reject("Information is missing.")
        }
    }

    public async getAddressInfo(address: string): Promise<IWalletAddress | IResponseError> {
        try {
            const walletAddress = new Address(address)
            const n = 10
            const account = await this.consensus.getAccount(walletAddress)
            const { pendings, pendingAmount } = this.txPool.getAllPendingAddress(walletAddress)
            const results = await this.consensus.getLastTxs(walletAddress, n)
            const minedinfo = await this.consensus.getMinedBlocks(walletAddress)
            const minedBlocks: IMinedInfo[] = []
            for (const mined of minedinfo) {
                minedBlocks.push({
                    blockhash: mined.blockhash,
                    timestamp: mined.blocktime,
                    miner: mined.miner,
                    feeReward: mined.feeReward,
                })
            }
            const webTxs: ITxProp[] = []
            const pendTxs: ITxProp[] = []
            for (const tx of pendings) {
                pendTxs.push(this.makeTxProp(tx))
            }
            for (const result of results) {
                webTxs.push(this.makeTxPropFromDBTx(result))
            }
            return Promise.resolve<IWalletAddress>({
                hash: address,
                balance: account ? hycontoString(account.balance) : "0.0",
                nonce: account ? account.nonce : 0,
                txs: webTxs,
                pendings: pendTxs,
                minedBlocks,
                pendingAmount: hycontoString(pendingAmount),
            })
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
        }
    }

    public async getAllAccounts(name: string, password: string, startIndex: number): Promise<Array<{ address: string, balance: string }> | boolean> {
        try {
            await Wallet.walletInit()
            const account = await Wallet.getAddress(name)
            const result: Array<{ address: string, balance: string }> = []
            const acctFromWS = await this.consensus.getAccount(new Address(account))
            const acctElement = { address: account, balance: "0" }
            if (acctFromWS !== undefined) {
                acctElement.balance = hycontoString(acctFromWS.balance)
            }
            result.push(acctElement)
            return Promise.resolve(result)
        } catch (e) {
            return Promise.resolve(false)
        }
    }

    public async getBlock(hash: string, txCount?: number): Promise<IBlock | IResponseError> {
        try {
            const webBlock = (txCount === undefined) ? await this.getBlockInfo(hash) : await this.getBlockInfoByTxCount(hash, txCount)

            return Promise.resolve(webBlock)
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: "the block cannot be found",
            })
        }
    }
    public async getBlockList(index: number): Promise<{ blocks: IBlock[], length: number }> {
        let blockList: IBlock[] = []
        let pageCount: number = 0
        const exodusHeight = START_HEIGHT
        try {
            const blockTip = await this.consensus.getBlocksTip()
            let indexCount = 20
            let startIndex = blockTip.height - (indexCount * (Number(index) + 1)) + 1
            pageCount = Math.ceil((blockTip.height - exodusHeight) / 20)
            if (startIndex < exodusHeight) {
                const difference = exodusHeight - startIndex
                indexCount -= difference
                startIndex = exodusHeight
            }
            const blocks = await this.consensus.getBlocksRange(startIndex, indexCount)
            blockList = await this.makeIBlockList(blocks)
        } catch (e) {
            logger.error(e)
        }
        return Promise.resolve({ blocks: blockList, length: pageCount })
    }

    public async getTopTipHeight(): Promise<{ height: number }> {
        let height: number = 0
        try {
            const blockTip = await this.consensus.getBlocksTip()
            height = blockTip.height
        } catch (e) {
            logger.error(`Failed to getTopTipHeight : ${e}`)
        }
        return Promise.resolve({ height })
    }

    public async getHTipHeight(): Promise<{ height: number }> {
        let height: number = 0
        try {
            const hTip = await this.consensus.getHeadersTip()
            if (hTip !== undefined) { height = hTip.height }
        } catch (e) {
            logger.error(`Failed to getHTipHeight : ${e}`)
        }
        return Promise.resolve({ height })
    }

    public async getBlockAtHeight(height: number): Promise<IBlock | IResponseError> {
        try {
            const blockResult = await this.consensus.getBlockAtHeight(height)
            if (blockResult === undefined) {
                return Promise.resolve({
                    status: 404,
                    timestamp: Date.now(),
                    error: "NOT_FOUND",
                    message: "No block found at that height",
                })
            }
            const txs: ITxProp[] = []
            for (const hyconTx of blockResult.txs) {
                txs.push(this.makeTxProp(hyconTx, blockResult.header.timeStamp))
            }
            const hash = new Hash(blockResult.header)
            const webBlock = {
                hash: hash.toString(),
                difficulty: blockResult.header.difficulty.toExponential(),
                stateRoot: blockResult.header.stateRoot.toString(),
                merkleRoot: blockResult.header.merkleRoot.toString(),
                txs,
                height,
                timeStamp: Number(blockResult.header.timeStamp),
            }
            return Promise.resolve(webBlock)
        } catch (e) {
            logger.error(e)
        }
    }
    public async getMnemonic(lang: string): Promise<string> {
        await Wallet.walletInit()
        logger.debug(lang)
        return Wallet.getRandomMnemonic(lang)
    }
    public async getTx(hash: string): Promise<ITxProp | IResponseError> {
        try {
            const getTxResult = await this.consensus.getTx(Hash.decode(hash))
            if (getTxResult === undefined || getTxResult.tx === undefined) {
                return Promise.resolve({
                    status: 404,
                    timestamp: Date.now(),
                    error: "NOT_FOUND",
                    message: "the transaction cannot be found",
                })
            }
            return this.makeTxPropFromDBTx(getTxResult.tx, getTxResult.confirmation)
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
        }
    }
    public async getWalletDetail(name: string): Promise<IHyconWallet | IResponseError> {
        try {
            await Wallet.walletInit()
            const addressString = await Wallet.getAddress(name)
            if (addressString === "") {
                return { name, address: "" }
            }
            const walletAddress = new Address(addressString)
            const n = 10
            const account = await this.consensus.getAccount(walletAddress)
            const results = await this.consensus.getLastTxs(walletAddress, n)
            const minedinfo = await this.consensus.getMinedBlocks(walletAddress)
            const { pendings, pendingAmount } = this.txPool.getAllPendingAddress(walletAddress)

            const minedBlocks: IMinedInfo[] = []
            for (const mined of minedinfo) {
                minedBlocks.push({
                    blockhash: mined.blockhash,
                    timestamp: mined.blocktime,
                    miner: mined.miner,
                    feeReward: mined.feeReward,
                })
            }
            const webTxs: ITxProp[] = []
            const pendTxs: ITxProp[] = []
            for (const tx of pendings) {
                pendTxs.push(this.makeTxProp(tx))
            }
            for (const result of results) {
                webTxs.push(this.makeTxPropFromDBTx(result))
            }
            const hyconWallet: IHyconWallet = {
                name,
                address: walletAddress.toString(),
                balance: account ? hycontoString(account.balance) : "0",
                txs: webTxs,
                pendings: pendTxs,
                minedBlocks,
                pendingAmount: hycontoString(pendingAmount),
            }
            return hyconWallet
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: "the wallet cannot be found",
            })
        }
    }

    public async getHDWallet(name: string, password: string, index: number, count: number): Promise<IHyconWallet[] | IResponseError> {
        try {
            const hdWallets = await Wallet.loadHDKeys(name, password, index, count)
            const wallets: IHyconWallet[] = []
            for (const wallet of hdWallets) {
                const address = wallet.pubKey.address()

                const account = await this.consensus.getAccount(address)
                const pendings = this.txPool.getOutPendingAddress(address)
                let pendingAmount = Long.UZERO
                for (const pending of pendings) {
                    pendingAmount = strictAdd(pendingAmount, strictAdd(pending.amount, pending.fee))
                }
                wallets.push({
                    address: address.toString(),
                    balance: account ? hycontoString(account.balance) : "0",
                    pendingAmount: hycontoString(pendingAmount),
                })
            }
            return wallets
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: "the wallet cannot be found",
            })
        }
    }

    public async getHDWalletFromRootKey(rootKey: string, index: number, count: number): Promise<IHyconWallet[] | IResponseError> {
        try {
            const addresses = Wallet.addressesFromRootKey(rootKey, index, count)
            const wallets: IHyconWallet[] = []
            let walletIndex = index ? index : 0
            for (const address of addresses) {
                const account = await this.consensus.getAccount(address)
                const pendings = this.txPool.getOutPendingAddress(address)
                let pendingAmount = Long.UZERO
                for (const pending of pendings) {
                    pendingAmount = strictAdd(pendingAmount, strictAdd(pending.amount, pending.fee))
                }
                wallets.push({
                    address: address.toString(),
                    balance: account ? hycontoString(account.balance) : "0",
                    pendingAmount: hycontoString(pendingAmount),
                    index: walletIndex++,
                })
            }
            return wallets
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: "the wallet cannot be found",
            })
        }
    }

    public async getWalletList(idx?: number): Promise<{ walletList: IHyconWallet[], length: number }> {
        try {
            await Wallet.walletInit()
            const walletList = new Array<IHyconWallet>()
            const walletListResult = await Wallet.walletList(idx)
            for (const wallet of walletListResult.walletList) {
                const name = wallet.name
                if (wallet.address !== "") {
                    const address = new Address(wallet.address)
                    const account = await this.consensus.getAccount(address)
                    const pendings = this.txPool.getOutPendingAddress(address)
                    let pendingAmount = Long.UZERO
                    for (const pending of pendings) {
                        pendingAmount = strictAdd(pendingAmount, strictAdd(pending.amount, pending.fee))
                    }
                    const tmpHwallet: IHyconWallet = {
                        address: wallet.address,
                        name,
                        balance: account ? hycontoString(account.balance) : "0",
                        pendingAmount: hycontoString(pendingAmount),
                    }
                    walletList.push(tmpHwallet)
                } else {
                    walletList.push({ address: "", name })
                }
            }
            return { walletList, length: walletListResult.length }
        } catch (e) {
            return Promise.reject("Error get wallet list : " + e)
        }
    }

    public async recoverWallet(Hwallet: IHyconWallet): Promise<string | boolean> {
        await Wallet.walletInit()

        if (Hwallet.name === undefined || Hwallet.mnemonic === undefined || Hwallet.language === undefined) {
            return false
        }
        if (!Wallet.validateMnemonic(Hwallet.mnemonic, Hwallet.language)) {
            return false
        }
        try {
            const password = Hwallet.password === undefined ? "" : Hwallet.password
            const passphrase = Hwallet.passphrase === undefined ? "" : Hwallet.passphrase
            const hint = Hwallet.hint === undefined ? "" : Hwallet.hint
            const addressString = await Wallet.recoverWallet({ name: Hwallet.name, passphrase, mnemonic: Hwallet.mnemonic, language: Hwallet.language, hint }, password)
            return Promise.resolve(addressString)
        } catch (e) {
            return false
        }
    }

    public async sendTx(tx: { name: string, password: string, address: string, amount: string, minerFee: string, nonce?: number }, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        tx.password === undefined ? tx.password = "" : tx.password = tx.password
        let status = 1
        try {
            await Wallet.walletInit()
            const wallet = await Wallet.loadKeys(tx.name, tx.password)
            status = 2

            const walletAddress = wallet.pubKey.address()

            const { address, nonce } = await this.prepareSendTx(walletAddress, tx.address, tx.amount, tx.minerFee, tx.nonce)

            const signedTx = wallet.send(address, hyconfromString(tx.amount), nonce, hyconfromString(tx.minerFee))
            if (queueTx) { queueTx(signedTx) } else { return Promise.reject(false) }
            return { res: true }
        } catch (e) {
            switch (e) {
                case 2:
                    return { res: false, case: 2 }
                case 3:
                    return { res: false, case: 3 }
                default:
                    return { res: false, case: status }
            }
        }
    }

    public getPendingTxs(index: number): Promise<{ txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }> {
        let pageCount: number = 0
        const cntPerPage: number = 10
        const startIndex = cntPerPage * index
        const txPoolTxs = this.txPool.getPending(startIndex, cntPerPage)
        pageCount = Math.ceil(txPoolTxs.length / cntPerPage)
        const txList: ITxProp[] = []
        for (const tx of txPoolTxs.txs) {
            txList.push(this.makeTxProp(tx))
        }
        return Promise.resolve({ txs: txList, length: pageCount, totalCount: txPoolTxs.length, totalAmount: hycontoString(txPoolTxs.totalAmount), totalFee: hycontoString(txPoolTxs.totalFee) })
    }

    public async getPeerList(): Promise<IPeer[]> {
        const peerList: IPeer[] = []
        const peers = await this.network.getPeerDb()
        // tslint:disable-next-line:prefer-const
        let result: any
        for (const peer of peers) {
            const lastSeen = Number(peer.lastSeen)
            const lastAttempt = Number(peer.lastAttempt)
            let seen: string = "0"
            let attempt: string = "0"
            if (lastSeen !== 0) {
                const tp = new Date(lastSeen)
                seen = tp.toLocaleString()
            }
            if (lastAttempt !== 0) {
                const tp = new Date(lastAttempt)
                attempt = tp.toLocaleString()
            }
            const temp: IPeer = {
                host: peer.host,
                port: peer.port,
                lastSeen: seen,
                failCount: peer.failCount,
                lastAttempt: attempt,
                active: peer.active,
            }
            peerList.push(temp)
        }
        peerList.sort((a, b) => {
            if (a.active < b.active) {
                return 1
            }
            if (a.active > b.active) {
                return -1
            }

            if (a.lastSeen < b.lastSeen) {
                return 1
            }
            if (a.lastSeen > b.lastSeen) {
                return -1
            }

            if (a.lastAttempt < b.lastAttempt) {
                return 1
            }
            if (a.lastAttempt > b.lastAttempt) {
                return -1
            }

            if (a.host < b.host) {
                return 1
            }
            if (a.host > b.host) {
                return -1
            }

            if (a.port < b.port) {
                return 1
            }
            if (a.port > b.port) {
                return -1
            }

            return 0
        })
        return peerList
    }

    public async getPeerConnected(index: number): Promise<{ peersInPage: IPeer[], pages: number }> {
        try {
            const peerList: IPeer[] = []
            const peers = await this.network.getConnection()
            for (const peer of peers) {
                const lastSeen = Number(peer.lastSeen)
                const lastAttempt = Number(peer.lastAttempt)
                let seen = "0"
                let attempt = "0"
                if (lastSeen !== 0) {
                    const tp = new Date(lastSeen)
                    seen = tp.toLocaleString()
                }
                if (lastAttempt !== 0) {
                    const tp = new Date(lastAttempt)
                    attempt = tp.toLocaleString()
                }
                peerList.push({
                    host: peer.host,
                    port: peer.port,
                    active: peer.active,
                    failCount: peer.failCount,
                    successCount: peer.successInCount + peer.successOutCount,
                    lastSeen: seen,
                    lastAttempt: attempt,
                })
            }
            peerList.sort((a, b) => {
                if (a.active < b.active) {
                    return 1
                }
                if (a.active > b.active) {
                    return -1
                }

                if (a.lastSeen < b.lastSeen) {
                    return 1
                }
                if (a.lastSeen > b.lastSeen) {
                    return -1
                }

                if (a.lastAttempt < b.lastAttempt) {
                    return 1
                }
                if (a.lastAttempt > b.lastAttempt) {
                    return -1
                }

                if (a.host < b.host) {
                    return 1
                }
                if (a.host > b.host) {
                    return -1
                }

                if (a.port < b.port) {
                    return 1
                }
                if (a.port > b.port) {
                    return -1
                }

                return 0
            })
            const start = index * 20
            const end = start + 20
            const peersInPage = peerList.slice(start, end)
            const pages = Math.ceil(peerList.length / 20)
            return Promise.resolve({ peersInPage, pages })
        } catch (e) {
            logger.warn(`getPeerConnected: ${e}`)
        }

    }

    public getHint(name: string): Promise<string> {
        return Wallet.getHint(name)
    }

    public async getNextTxs(address: string, txHash: string, index: number): Promise<ITxProp[]> {
        const cntPerPage: number = 10
        const results = await this.consensus.getNextTxs(new Address(address), Hash.decode(txHash), index, cntPerPage)
        const webTxs: ITxProp[] = []
        for (const result of results) {
            webTxs.push(this.makeTxPropFromDBTx(result))
        }
        return webTxs
    }

    public async getNextTxsInBlock(blockHash: string, txHash: string, index: number): Promise<ITxProp[]> {
        const cntPerPage: number = 10
        const results = await this.consensus.getNextTxsInBlock(blockHash, txHash, index, cntPerPage)
        const webTxs: ITxProp[] = []
        for (const result of results) {
            webTxs.push(this.makeTxPropFromDBTx(result))
        }
        return webTxs
    }

    public async checkDupleName(name: string): Promise<boolean> {
        return await Wallet.checkDupleName(name)
    }

    public async getMinedBlocks(address: string, blockHash: string, index: number): Promise<IMinedInfo[]> {
        const cntPerPage: number = 10
        const minedInfo = await this.consensus.getMinedBlocks(new Address(address), cntPerPage, index, blockHash)
        const minedBloks: IMinedInfo[] = []
        for (const mined of minedInfo) {
            minedBloks.push({
                blockhash: mined.blockhash,
                timestamp: mined.blocktime,
                miner: mined.miner,
                feeReward: mined.feeReward,
            })
        }
        return minedBloks
    }

    public async getMiner(): Promise<IMiner> {
        const minerInfo = this.miner.getMinerInfo()
        const currentDiff = this.consensus.getCurrentDiff()
        let networkHashRate = "Unknown"
        function decimalPlacesString(n: number, places: number) {
            const power = Math.pow(10, places)
            return (Math.round(n * power) / power).toLocaleString()
        }
        if (currentDiff !== 0) {
            const hashesPerBlock = (1 / currentDiff)
            const meanBlockTime = this.consensus.getTargetTime() / 1000
            const hashesPerSecond = (hashesPerBlock / meanBlockTime)
            if (hashesPerSecond > 20 * 1000 * 1000 * 1000) {
                networkHashRate = `${decimalPlacesString(hashesPerSecond / (1000 * 1000 * 1000), 2)} GH/s`
            } else if (hashesPerSecond > 20 * 1000 * 1000) {
                networkHashRate = `${decimalPlacesString(hashesPerSecond / (1000 * 1000), 2)} MH/s`
            } else if (hashesPerSecond > 20 * 1000) {
                networkHashRate = `${decimalPlacesString(hashesPerSecond / 1000, 2)} KH/s`
            } else {
                networkHashRate = `${decimalPlacesString(hashesPerSecond, 2)} H/s`
            }
        }
        return { cpuHashRate: minerInfo.hashRate, networkHashRate, currentMinerAddress: minerInfo.address, cpuCount: minerInfo.cpuCount }
    }

    public async setMiner(address: string): Promise<boolean> {
        try {
            await userOptions.setMiner(address)
            return true
        } catch (e) { return false }
    }

    public async setMinerCount(count: number): Promise<void> {
        await this.miner.setMinerCount(Number(count))
    }

    public async getFavoriteList(): Promise<Array<{ alias: string, address: string }>> {
        try {
            return await Wallet.getFavoriteList()
        } catch (e) {
            return Promise.reject("Error get favorite list : " + e)
        }
    }
    public async addFavorite(alias: string, address: string): Promise<boolean> {
        return await Wallet.addFavorite(alias, address)
    }
    public async deleteFavorite(alias: string): Promise<boolean> {
        return await Wallet.deleteFavorite(alias)
    }

    public async addWalletFile(name: string, password: string, key: string): Promise<boolean> {
        if (!await Wallet.checkDupleName(name)) {
            const result = await Wallet.addWalletFile(name, password, key)
            return result
        }
        return false
    }

    public async getLedgerWallet(startIndex: number, count: number): Promise<IHyconWallet[] | number> {
        try {
            const addresses = await Ledger.getAddresses(startIndex, count)
            const wallets: IHyconWallet[] = []
            for (const address of addresses) {
                const account = await this.consensus.getAccount(address)
                const pendings = this.txPool.getOutPendingAddress(address)
                let pendingAmount = Long.UZERO
                for (const pending of pendings) {
                    pendingAmount = strictAdd(pendingAmount, strictAdd(pending.amount, pending.fee))
                }
                wallets.push({
                    address: address.toString(),
                    balance: account ? hycontoString(account.balance) : "0",
                    pendingAmount: hycontoString(pendingAmount),
                })
            }
            return wallets
        } catch (e) {
            logger.error(`Fail to getLedgerWallet in restServer : ${e}`)
            return 1
        }
    }

    public async sendTxWithLedger(index: number, from: string, to: string, amount: string, fee: string, txNonce?: number, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        let status = 0
        try {
            const fromAddress = new Address(from)
            status = 1
            const { address, nonce } = await this.prepareSendTx(fromAddress, to, amount, fee, txNonce)
            status = 4
            const htip = this.consensus.getHtip()
            const htipHeight = htip !== undefined ? htip.height : 0
            const signedTx = await Ledger.sign(htipHeight, address, hyconfromString(amount), nonce, hyconfromString(fee), index)

            if (queueTx) { queueTx(signedTx) } else { return { res: false, case: status } }

            return { res: true, case: status }
        } catch (e) {
            switch (e) {
                case 2:
                    return { res: false, case: 2 }
                case 3:
                    return { res: false, case: 3 }
                default:
                    return { res: false, case: status }
            }
        }
    }

    public possibilityLedger(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public async sendTxWithHDWallet(tx: { name: string, password: string, address: string, amount: string, minerFee: string, nonce?: number }, index: number, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        tx.password === undefined ? tx.password = "" : tx.password = tx.password
        let status = 1
        try {
            await Wallet.walletInit()
            const hdWallet = (await Wallet.loadHDKeys(tx.name, tx.password, index, 1))[0]
            status = 2

            const walletAddress = hdWallet.pubKey.address()

            const { address, nonce } = await this.prepareSendTx(walletAddress, tx.address, tx.amount, tx.minerFee, tx.nonce)

            const signedTx = hdWallet.send(address, hyconfromString(tx.amount), nonce, hyconfromString(tx.minerFee))
            if (queueTx) { queueTx(signedTx) } else { return Promise.reject(false) }
            return { res: true }
        } catch (e) {
            switch (e) {
                case 2:
                    return { res: false, case: 2 }
                case 3:
                    return { res: false, case: 3 }
                default:
                    return { res: false, case: status }
            }
        }
    }

    public async sendTxWithHDWalletRootKey(tx: { address: string, amount: string, minerFee: string, nonce?: number }, rootKey: string, index: number, queueTx?: Function): Promise<{ hash: string } | IResponseError> {
        try {
            const wallet = Wallet.getWalletFromRootKey(rootKey, index)
            const walletAddress = wallet.pubKey.address()
            const { address, nonce } = await this.prepareSendTx(walletAddress, tx.address, tx.amount, tx.minerFee, tx.nonce)
            const signedTx = wallet.send(address, hyconfromString(tx.amount), nonce, hyconfromString(tx.minerFee))
            if (queueTx) { queueTx(signedTx) } else { return Promise.reject(false) }
            return { hash: (new Hash(signedTx)).toString() }
        } catch (e) {
            let message = e.toString()
            if (e === 2) { message = "Invalid address: Please check 'To Address'" }
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message,
            })
        }
    }
    public async generateHDWallet(Hwallet: IHyconWallet): Promise<string | IResponseError> {
        try {
            await Wallet.walletInit()
            if (Hwallet.name !== undefined && Hwallet.mnemonic !== undefined && Hwallet.language !== undefined) {
                const password = Hwallet.password === undefined ? "" : Hwallet.password
                const passphrase = Hwallet.passphrase === undefined ? "" : Hwallet.passphrase
                const hint = Hwallet.hint === undefined ? "" : Hwallet.hint
                const wallet = Wallet.generateHDWallet({ name: Hwallet.name, passphrase, mnemonic: Hwallet.mnemonic, language: Hwallet.language, hint })
                await wallet.save(Hwallet.name, password, hint)
                return Hwallet.name
            } else {
                return Promise.resolve({
                    status: 400,
                    timestamp: Date.now(),
                    error: "BAD_REQUEST",
                    message: "missing parameters",
                })
            }
        } catch (e) {
            return Promise.resolve({
                status: 409,
                timestamp: Date.now(),
                error: "CONFLICT",
                message: e.toString(),
            })
        }
    }

    public async recoverHDWallet(Hwallet: IHyconWallet): Promise<string | boolean> {
        try {
            await Wallet.walletInit()
            if (Hwallet.name === undefined || Hwallet.mnemonic === undefined || Hwallet.language === undefined) {
                return false
            }
            if (!Wallet.validateMnemonic(Hwallet.mnemonic, Hwallet.language)) {
                return false
            }
            const password = Hwallet.password === undefined ? "" : Hwallet.password
            const passphrase = Hwallet.passphrase === undefined ? "" : Hwallet.passphrase
            const hint = Hwallet.hint === undefined ? "" : Hwallet.hint
            await Wallet.recoverHDWallet({ name: Hwallet.name, passphrase, mnemonic: Hwallet.mnemonic, language: Hwallet.language, hint }, password)
            return Hwallet.name
        } catch (e) {
            throw false
        }
    }

    public async getMarketCap(): Promise<{ totalSupply: string, circulatingSupply: string }> {
        const dbBlock: DBBlock = this.consensus.getBtip()

        let totalAmount: Long = dbBlock.totalSupply

        const burnAmount = await this.consensus.getBurnAmount()

        totalAmount = strictSub(totalAmount, burnAmount.amount)

        const airdropAddr = await this.getAddressInfo(`H3nHqmqsamhY9LLm87GKLuXfke6gg8QmM`) as IWalletAddress
        const icoAddr = await this.getAddressInfo(`H3ynYLh9SkRCTnH59ZdU9YzrzzPVL5R1K`) as IWalletAddress
        const corpAddr = await this.getAddressInfo(`H8coFUhRwbY9wKhi6GGXQ2PzooqdE52c`) as IWalletAddress
        const teamAddr = await this.getAddressInfo(`H3r7mH8PVCjJF2CUj8JYu8L4umkayCC1e`) as IWalletAddress
        const bountyAddr = await this.getAddressInfo(`H278osmYQoWP8nnrvNypWB5YfDNk6Fuqb`) as IWalletAddress
        const developAddr = await this.getAddressInfo(`H4C2pYMHygAtSungDKmZuHhfYzjkiAdY5`) as IWalletAddress

        let circulatingSupply = strictSub(totalAmount, hyconfromString(airdropAddr.balance))
        circulatingSupply = strictSub(circulatingSupply, hyconfromString(icoAddr.balance))
        circulatingSupply = strictSub(circulatingSupply, hyconfromString(corpAddr.balance))
        circulatingSupply = strictSub(circulatingSupply, hyconfromString(teamAddr.balance))
        circulatingSupply = strictSub(circulatingSupply, hyconfromString(bountyAddr.balance))
        circulatingSupply = strictSub(circulatingSupply, hyconfromString(developAddr.balance))

        return { totalSupply: hycontoString(totalAmount), circulatingSupply: hycontoString(circulatingSupply) }
    }

    public checkPasswordBitbox(): Promise<boolean | number> {
        try {
            const bitbox = Bitbox.getBitbox()
            const isSetted = bitbox.checkPasswordSetting()
            bitbox.close()
            return Promise.resolve(isSetted)
        } catch (e) {
            return e
        }
    }

    public async checkWalletBitbox(password: string): Promise<boolean | number | { error: number, remain_attemp: string }> {
        try {
            const bitbox = Bitbox.getBitbox()
            const isSetted = await bitbox.checkWalletSetting(password)
            bitbox.close()
            return Promise.resolve(isSetted)
        } catch (e) {
            return e
        }
    }

    public async getBitboxWallet(password: string, startIndex: number, count: number): Promise<IHyconWallet[] | number> {
        try {
            const bitbox = Bitbox.getBitbox()
            const addresses = await bitbox.getAddress(password, startIndex, count)
            bitbox.close()
            const wallets: IHyconWallet[] = []
            for (const address of addresses) {
                const account = await this.consensus.getAccount(address)
                const pendings = this.txPool.getOutPendingAddress(address)
                let pendingAmount = Long.fromNumber(0)
                for (const pending of pendings) {
                    pendingAmount = strictAdd(pendingAmount, strictAdd(pending.amount, pending.fee))
                }
                wallets.push({
                    address: address.toString(),
                    balance: account ? hycontoString(account.balance) : "0",
                    pendingAmount: hycontoString(pendingAmount),
                })
            }
            return wallets
        } catch (e) {
            return e
        }
    }

    public async sendTxWithBitbox(tx: { from: string, password: string, address: string, amount: string, minerFee: string, nonce?: number }, index: number, queueTx?: Function): Promise<{ res: boolean, case?: (number | { error: number, remain_attemp: string }) }> {
        let checkFrom = false
        try {
            const fromAddress = new Address(tx.from)
            checkFrom = true
            const { address, nonce } = await this.prepareSendTx(fromAddress, tx.address, tx.amount, tx.minerFee, tx.nonce)

            const bitbox = Bitbox.getBitbox()
            const htip = this.consensus.getHtip()
            const htipHeight = htip !== undefined ? htip.height : 0
            const signedTx = await bitbox.sign(htipHeight, fromAddress, index, tx.password, address, hyconfromString(tx.amount), nonce, hyconfromString(tx.minerFee))
            bitbox.close()
            if (queueTx) { queueTx(signedTx) } else { return Promise.reject(false) }
            return { res: true }
        } catch (e) {
            if (!checkFrom) { return { res: false, case: 1 } }
            logger.error(`sendTxWithBitbox : ${e}`)
            return { res: false, case: e }
        }
    }

    public setBitboxPassword(password: string): Promise<boolean | number> {
        try {
            const bitbox = Bitbox.getBitbox()
            bitbox.createPassword(password)
            const result = bitbox.checkPasswordSetting()
            bitbox.close()
            return Promise.resolve(result)
        } catch (e) {
            logger.error(`Error setBitboxPassword : ${e}`)
            return e
        }
    }

    public async createBitboxWallet(name: string, password: string): Promise<boolean | number> {
        try {
            const bitbox = Bitbox.getBitbox()
            await bitbox.setWallet(name, password)
            const result = await bitbox.checkWalletSetting(password)
            bitbox.close()
            return result
        } catch (e) {
            logger.error(`Error createBitboxWallet : ${e}`)
            return e
        }
    }

    public async updateBitboxPassword(originalPwd: string, newPwd: string): Promise<boolean | number | { error: number, remain_attemp: string }> {
        try {
            const bitbox = Bitbox.getBitbox()
            const result = await bitbox.updatePassword(originalPwd, newPwd)
            bitbox.close()
            return result
        } catch (e) {
            return e
        }
    }

    public async isUncleBlock(blockHash: string): Promise<boolean | IResponseError> {
        try {
            const result = await this.consensus.isUncleBlock(Hash.decode(blockHash))
            return Promise.resolve(result)
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: e.toString(),
            })
        }
    }

    public async getMiningReward(blockHash: string): Promise<string | IResponseError> {
        try {
            const result: DBMined | undefined = await this.consensus.getMinedInfo(blockHash)
            if (result === undefined) { throw new Error("Mined data does not yet exist or is missing information.") }
            return result.feeReward
        } catch (e) {
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "NOT_FOUND",
                message: e.toString(),
            })
        }
    }

    public async getBlocksFromHeight(from: number, count: number): Promise<{ blocks: IBlock[] } | IResponseError> {
        try {
            const fromHeight = from | 0
            const cnt = count | 0
            const blocks = await this.consensus.getBlocksRange(fromHeight, cnt)
            const iblocks: IBlock[] = await this.makeIBlockList(blocks)
            return { blocks: iblocks }
        } catch (e) {
            return Promise.resolve({
                status: 400,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
        }
    }

    private async makeIBlockList(blocks: AnyBlock[]): Promise<IBlock[]> {
        const blockList: IBlock[] = []
        for (const block of blocks) {
            const txs: ITxProp[] = []
            const size = block.encode().byteLength
            for (const tx of block.txs) {
                txs.push(this.makeTxProp(tx, block.header.timeStamp))
            }
            const hash = new Hash(block.header)
            const webBlock = {
                hash: hash.toString(),
                difficulty: block.header.difficulty.toExponential(),
                height: await this.consensus.getBlockHeight(hash),
                size,
                txs,
                timeStamp: Number(block.header.timeStamp),
            }
            if (block.header instanceof BlockHeader) {
                const previousStringHashes = []
                for (const previous of block.header.previousHash) {
                    previousStringHashes.push(previous.toString())
                }
                Object.assign(webBlock, {
                    prevBlock: previousStringHashes,
                    nonce: zeroPad(block.header.nonce.low.toString(16), 8) + zeroPad(block.header.nonce.high.toString(16), 8),
                    miner: block.header.miner.toString(),
                })
            }
            blockList.push(webBlock)
        }
        return blockList
    }

    private async prepareSendTx(fromAddress: Address, toAddress: string, amount: string, minerFee: string, txNonce?: number): Promise<{ address: Address, nonce: number }> {
        let checkAddr = false
        try {
            const address = new Address(toAddress)
            checkAddr = true

            const account = await this.consensus.getAccount(fromAddress)
            let accountBalance = account.balance

            const pendings = this.txPool.getOutPendingAddress(fromAddress)
            let nonce: number = 0
            if (txNonce !== undefined) {
                nonce = Number(txNonce)
            } else if (pendings.length > 0) {
                nonce = pendings[pendings.length - 1].nonce + 1
            } else {
                nonce = account.nonce + 1
            }

            let pendingAmount = hyconfromString("0")
            for (const pendingTx of pendings) {
                if (pendingTx.nonce === nonce) {
                    break
                }
                pendingAmount = strictAdd(pendingAmount, strictAdd(pendingTx.amount, pendingTx.fee))
            }

            accountBalance = strictSub(accountBalance, pendingAmount)
            logger.warn(`Account Balance: ${hycontoString(account.balance)} / Pending Amount : ${hycontoString(pendingAmount)} /  Available : ${hycontoString(accountBalance)}`)
            logger.warn(`TX Amount: ${amount}`)
            logger.warn(`TX Miner Fee: ${minerFee}`)

            const totalSend = strictAdd(hyconfromString(amount), hyconfromString(minerFee))

            logger.warn(`TX Total: ${hycontoString(totalSend)}`)

            if (totalSend.greaterThan(accountBalance)) {
                throw new Error("insufficient wallet balance to send transaction")
            }
            return { address, nonce }
        } catch (e) {
            logger.warn(e)
            if (!checkAddr) { throw 2 }
            throw 3
        }
    }

    private async getBlockInfo(hash: string): Promise<IBlock> {
        const block = await this.consensus.getBlockByHash(Hash.decode(hash))

        const webTxs: ITxProp[] = []
        let totalAmount: Long = Long.UZERO
        let totalFee: Long = Long.UZERO
        for (const tx of block.txs) {
            webTxs.push(this.makeTxProp(tx, block.header.timeStamp))
            totalAmount = strictAdd(totalAmount, tx.amount)

            if (tx instanceof SignedTx) { totalFee = strictAdd(totalFee, tx.fee) }
        }

        const webBlock = {
            hash,
            amount: hycontoString(totalAmount),
            difficulty: block.header.difficulty.toExponential(),
            fee: hycontoString(totalFee),
            length: block.txs.length,
            volume: hycontoString(strictAdd(totalAmount, totalFee)),
            stateRoot: block.header.stateRoot.toString(),
            merkleRoot: block.header.merkleRoot.toString(),
            txs: webTxs,
            height: await this.consensus.getBlockHeight(Hash.decode(hash)),
            timeStamp: Number(block.header.timeStamp),
        }
        if (block.header instanceof BlockHeader) {
            Object.assign(webBlock, {
                prevBlock: block.header.previousHash.toString(),
                nonce: zeroPad(block.header.nonce.low.toString(16), 8) + zeroPad(block.header.nonce.high.toString(16), 8),
                miner: block.header.miner.toString(),
            })

            const buffer = Buffer.allocUnsafe(72)
            buffer.fill(block.header.preHash(), 0, 64)
            buffer.writeUInt32LE(block.header.nonce.getLowBitsUnsigned(), 64)
            buffer.writeUInt32LE(block.header.nonce.getHighBitsUnsigned(), 68)
            const result = await Hash.hashCryptonight(buffer)

            Object.assign(webBlock, {
                resultHash: Buffer.from(result.reverse().buffer).toString("hex"),
            })
        }

        return Promise.resolve(webBlock)
    }

    private async getBlockInfoByTxCount(hash: string, txCount: number): Promise<IBlock> {
        const hyconBlockHeader = await this.consensus.getHeaderByHash(Hash.decode(hash))
        const data = await this.consensus.getTxsInBlock(hash, txCount)

        const webTxs: ITxProp[] = []
        for (const hyconTx of data.txs) {
            webTxs.push(this.makeTxPropFromDBTx(hyconTx))
        }

        const webBlock = {
            hash,
            amount: data.amount,
            difficulty: hyconBlockHeader.difficulty.toExponential(),
            fee: data.fee,
            length: data.length,
            volume: hycontoString(strictAdd(hyconfromString(data.amount), hyconfromString(data.fee))),
            stateRoot: hyconBlockHeader.stateRoot.toString(),
            merkleRoot: hyconBlockHeader.merkleRoot.toString(),
            txs: webTxs,
            height: await this.consensus.getBlockHeight(Hash.decode(hash)),
            timeStamp: Number(hyconBlockHeader.timeStamp),

        }
        if (hyconBlockHeader instanceof BlockHeader) {
            Object.assign(webBlock, {
                prevBlock: hyconBlockHeader.previousHash.toString(),
                nonce: zeroPad(hyconBlockHeader.nonce.low.toString(16), 8) + zeroPad(hyconBlockHeader.nonce.high.toString(16), 8),
                miner: hyconBlockHeader.miner.toString(),
            })

            const buffer = Buffer.allocUnsafe(72)
            buffer.fill(hyconBlockHeader.preHash(), 0, 64)
            buffer.writeUInt32LE(hyconBlockHeader.nonce.getLowBitsUnsigned(), 64)
            buffer.writeUInt32LE(hyconBlockHeader.nonce.getHighBitsUnsigned(), 68)
            const result = await Hash.hashCryptonight(buffer)

            Object.assign(webBlock, {
                resultHash: Buffer.from(result.reverse().buffer).toString("hex"),
            })
        }

        return Promise.resolve(webBlock)
    }

    private makeTxProp(stx: SignedTx | GenesisSignedTx, receiveTime?: number): ITxProp {
        const tx: ITxProp = {
            hash: new Hash(stx).toString(),
            amount: hycontoString(stx.amount),
            to: stx.to !== undefined ? stx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
            signature: stx.signature.toString("hex"),
            estimated: hycontoString(stx.amount),
            receiveTime: receiveTime !== undefined ? receiveTime : undefined,
        }
        if (stx instanceof SignedTx) {
            Object.assign(tx, {
                fee: hycontoString(stx.fee),
                from: stx.from.toString(),
                estimated: hycontoString(strictAdd(stx.amount, stx.fee)),
                nonce: stx.nonce,
            })
        }
        return tx
    }

    private makeTxPropFromDBTx(tx: DBTx, confirmation?: number): ITxProp {
        return {
            hash: tx.txhash,
            amount: tx.amount,
            fee: tx.fee,
            from: tx.from,
            to: tx.to,
            blockHash: tx.blockhash,
            estimated: hycontoString(strictAdd(hyconfromString(tx.amount), hyconfromString(tx.fee))),
            receiveTime: tx.blocktime,
            nonce: tx.nonce,
            confirmation: confirmation !== undefined ? confirmation : undefined,
        }
    }
}
