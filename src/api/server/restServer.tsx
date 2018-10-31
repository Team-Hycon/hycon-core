import { getLogger } from "log4js"
import * as Long from "long"
import opn = require("opn")
import { Address } from "../../common/address"
import { AsyncLock } from "../../common/asyncLock"
import { BlockHeader } from "../../common/blockHeader"
import { ITxPool } from "../../common/itxPool"
import { PrivateKey } from "../../common/privateKey"
import { SignedTx } from "../../common/txSigned"
import { DBTx } from "../../consensus/database/dbtx"
import { IConsensus } from "../../consensus/iconsensus"
import { globalOptions } from "../../main"
import { setMiner } from "../../main"
import { MinerServer } from "../../miner/minerServer"
import { INetwork } from "../../network/inetwork"
import { Hash } from "../../util/hash"
import { Bitbox } from "../../wallet/bitbox"
import { Ledger } from "../../wallet/ledger"
import { Wallet } from "../../wallet/wallet"
import { IBlock, ICreateWallet, IHyconWallet, IMinedInfo, IMiner, IPeer, IResponseError, IRest, ITxProp, IWalletAddress } from "../client/rest"
import { hyconfromString, hycontoString, zeroPad } from "../client/stringUtil"
const logger = getLogger("RestServer")

// tslint:disable:object-literal-sort-keys
// tslint:disable:ban-types
// tslint:disable:no-bitwise
export class RestServer implements IRest {
    private consensus: IConsensus
    private txPool: ITxPool
    private network: INetwork
    private miner: MinerServer

    private txNonceLock: AsyncLock

    constructor(consensus: IConsensus, network: INetwork, txPool: ITxPool, miner: MinerServer) {
        this.consensus = consensus
        this.network = network
        this.txPool = txPool
        this.miner = miner
        this.txNonceLock = new AsyncLock()
    }

    public loadingListener(callback: (loading: boolean) => void): void {
        callback(false)
    }
    public setLoading(loading: boolean): void { }

    public createNewWallet(meta: ICreateWallet): Promise<IHyconWallet | IResponseError> {
        try {
            if (meta.privateKey === undefined) {
                if (meta.mnemonic === undefined) {
                    meta.mnemonic = Wallet.getRandomMnemonic(meta.language)
                }
                const wallet = Wallet.generateKeyWithMnemonic(meta.mnemonic, meta.language, meta.passphrase)

                return Promise.resolve({
                    mnemonic: meta.mnemonic,
                    privateKey: wallet.privKey.toHexString(),
                    address: wallet.pubKey.address().toString(),
                })
            } else {
                const privateKey = new PrivateKey(Buffer.from(meta.privateKey, "hex"))
                return Promise.resolve({
                    privateKey: privateKey.toHexString(),
                    address: privateKey.publicKey().address().toString(),
                })
            }
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
            const mapHashTx: Map<Hash, SignedTx> = new Map<Hash, SignedTx>()
            await Wallet.walletInit()
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
                // if (result.txList.tx instanceof SignedTx && result.txList.tx.nonce >= nonce) {
                webTx = {
                    hash: result.txhash,
                    amount: result.amount,
                    fee: result.fee,
                    from: result.from,
                    to: result.to,
                    estimated: hycontoString(hyconfromString(result.amount).add(hyconfromString(result.fee))),
                    receiveTime: result.blocktime,
                }
                webTxs.push(webTx)
            }
            // unsigned Txs are unlisted

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
                const account = await this.consensus.getAccount(new Address(wallet.pubKey.address()))
                const pendingTxs = this.txPool.getTxsOfAddress(address)
                let nonce = tx.nonce
                if (nonce === undefined) {
                    nonce = account.nonce + 1
                    for (const pendingTx of pendingTxs) {
                        if (nonce <= pendingTx.nonce) {
                            nonce = pendingTx.nonce + 1
                        }
                    }
                }
                const total = hyconfromString(tx.amount).add(hyconfromString(tx.fee))
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

    public async outgoingTx(tx: { signature: string, from: string, to: string, amount: string, fee: string, nonce: number, recovery: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        try {
            const fromAddress = new Address(tx.from)

            const address = {
                from: fromAddress,
                to: new Address(tx.to),
                amount: hyconfromString(tx.amount),
                fee: hyconfromString(tx.fee),
                nonce: tx.nonce,
            }
            let signedTx = new SignedTx(address, Buffer.from(tx.signature, "hex"), tx.recovery | 0)
            if (!signedTx.verify()) {
                tx.recovery = undefined
                tx.signature = undefined
                signedTx = new SignedTx(address, Buffer.from(tx.signature, "hex"), tx.recovery ^ 1)
                if (!signedTx.verify()) {
                    throw new Error("transaction information or signature is incorrect")
                }
            }

            const pendings = this.txPool.getTxsOfAddress(fromAddress)
            let pendingAmount = hyconfromString("0")
            for (const pendingTx of pendings) {
                if (pendingTx.nonce === tx.nonce) {
                    break
                }
                pendingAmount = pendingAmount.add(pendingTx.amount).add(pendingTx.fee)
            }
            const account = await this.consensus.getAccount(fromAddress)
            const total = hyconfromString(tx.amount).add(hyconfromString(tx.fee)).add(pendingAmount)
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
            return Promise.resolve({
                status: 404,
                timestamp: Date.now(),
                error: "INVALID_PARAMETER",
                message: e.toString(),
            })
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
            const addressOfWallet = new Address(address)
            const n = 10
            const account = await this.consensus.getAccount(addressOfWallet)
            const pendings = this.txPool.getTxsOfAddress(addressOfWallet)
            const results = await this.consensus.getLastTxs(addressOfWallet, n)
            const minedinfo = await this.consensus.getMinedBlocks(addressOfWallet)
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
            let pendingAmount = hyconfromString("0")
            if (pendings !== undefined) {
                for (const tx of pendings) {
                    pendTxs.push({
                        hash: new Hash(tx).toString(),
                        amount: hycontoString(tx.amount),
                        fee: hycontoString(tx.fee),
                        from: tx.from.toString(),
                        to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        signature: tx.signature.toString("hex"),
                        estimated: hycontoString(tx.amount.add(tx.fee)),
                        nonce: tx.nonce,
                    })
                    pendingAmount = pendingAmount.add(tx.amount).add(tx.fee)
                }
            }
            for (const result of results) {
                let webTx: ITxProp
                webTx = {
                    hash: result.txhash,
                    amount: result.amount,
                    fee: result.fee,
                    from: result.from,
                    to: result.to !== undefined ? result.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                    estimated: hycontoString(hyconfromString(result.amount).add(hyconfromString(result.fee))),
                    receiveTime: result.blocktime,
                    nonce: result.nonce,
                }
                webTxs.push(webTx)
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
                status: 404,
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

    public async getBlock(hash: string): Promise<IBlock | IResponseError> {
        try {
            // const dbBlock = await this.db.getDBBlock(Hash.decode(hash))
            const hyconBlockHeader = await this.consensus.getHeaderByHash(Hash.decode(hash))
            const data: { txs: DBTx[], amount: string, fee: string, length: number } = await this.consensus.getTxsInBlock(hash)
            const webTxs: ITxProp[] = []
            for (const hyconTx of data.txs) {
                let webTx: ITxProp
                webTx = {
                    hash: hyconTx.txhash,
                    amount: hyconTx.amount,
                    fee: hyconTx.fee,
                    from: hyconTx.from,
                    to: hyconTx.to,
                    estimated: hycontoString(hyconfromString(hyconTx.amount).add(hyconfromString(hyconTx.fee))),
                    receiveTime: hyconTx.blocktime,
                    nonce: hyconTx.nonce,
                }
                webTxs.push(webTx)
            }

            const webBlock = {
                hash,
                amount: data.amount,
                difficulty: hyconBlockHeader.difficulty.toExponential(),
                fee: data.fee,
                length: data.length,
                volume: hycontoString(hyconfromString(data.amount).add(hyconfromString(data.fee))),
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
        const blockList: IBlock[] = []
        let pageCount: number = 0
        try {
            const blockTip = await this.consensus.getBlocksTip()
            let indexCount = 20
            let startIndex = blockTip.height - (indexCount * (Number(index) + 1)) + 1
            pageCount = Math.ceil(blockTip.height / 20)
            if (startIndex < 0) {
                indexCount += startIndex
                startIndex = 0
            }
            const dbblocks = await this.consensus.getBlocksRange(startIndex, indexCount)

            for (const dbblock of dbblocks) {
                const txs: ITxProp[] = []
                const size = dbblock.encode().byteLength
                for (const tx of dbblock.txs) {
                    if (tx instanceof SignedTx) {
                        txs.push({
                            amount: hycontoString(tx.amount),
                            hash: new Hash(tx).toString(),
                            fee: hycontoString(tx.fee),
                            from: tx.from.toString(),
                            to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                            estimated: hycontoString(tx.amount.add(tx.fee)),
                        })
                    } else {
                        txs.push({
                            amount: hycontoString(tx.amount),
                            hash: new Hash(tx).toString(),
                            to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                            estimated: hycontoString(tx.amount),
                        })
                    }
                }
                const hash = new Hash(dbblock.header)
                const webBlock = {
                    hash: hash.toString(),
                    difficulty: dbblock.header.difficulty.toExponential(),
                    height: await this.consensus.getBlockHeight(hash),
                    size,
                    txs,
                    timeStamp: Number(dbblock.header.timeStamp),
                }
                if (dbblock.header instanceof BlockHeader) {
                    Object.assign(webBlock, {
                        prevBlock: dbblock.header.previousHash,
                        nonce: zeroPad(dbblock.header.nonce.low.toString(16), 8) + zeroPad(dbblock.header.nonce.high.toString(16), 8),
                        miner: dbblock.header.miner.toString(),
                    })
                }
                blockList.push(webBlock)
            }
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
            logger.error(`Fail to getTopTipHeight : ${e}`)
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
                if (hyconTx instanceof SignedTx) {
                    txs.push({
                        amount: hycontoString(hyconTx.amount),
                        hash: new Hash(hyconTx).toString(),
                        fee: hycontoString(hyconTx.fee),
                        from: hyconTx.from.toString(),
                        to: hyconTx.to !== undefined ? hyconTx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        estimated: hycontoString(hyconTx.amount.add(hyconTx.fee)),
                        receiveTime: blockResult.header.timeStamp,
                    })
                } else {
                    txs.push({
                        amount: hycontoString(hyconTx.amount),
                        hash: new Hash(hyconTx).toString(),
                        to: hyconTx.to !== undefined ? hyconTx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        estimated: hycontoString(hyconTx.amount),
                        receiveTime: blockResult.header.timeStamp,
                    })
                }
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
            const hyconBlockTx = getTxResult.tx
            const tx: ITxProp = {
                hash: hyconBlockTx.txhash,
                amount: hyconBlockTx.amount,
                fee: hyconBlockTx.fee,
                from: hyconBlockTx.from,
                to: hyconBlockTx.to,
                blockHash: hyconBlockTx.blockhash,
                nonce: hyconBlockTx.nonce,
                receiveTime: hyconBlockTx.blocktime,
                estimated: hycontoString(hyconfromString(hyconBlockTx.amount).add(hyconfromString(hyconBlockTx.fee))),
                confirmation: getTxResult.confirmation,
            }
            return tx
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
            const addrOfWallet = new Address(addressString)
            const n = 10
            const account = await this.consensus.getAccount(addrOfWallet)
            const results = await this.consensus.getLastTxs(addrOfWallet, n)
            const minedinfo = await this.consensus.getMinedBlocks(addrOfWallet)
            const pendings = this.txPool.getTxsOfAddress(addrOfWallet)
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
            let pendingAmount = hyconfromString("0")
            if (pendings !== undefined) {
                logger.debug(`getTxsOfAddress result  = ${pendings.length}`)
                for (const tx of pendings) {
                    pendTxs.push({
                        hash: new Hash(tx).toString(),
                        amount: hycontoString(tx.amount),
                        fee: hycontoString(tx.fee),
                        from: tx.from.toString(),
                        to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        signature: tx.signature.toString("hex"),
                        estimated: hycontoString(tx.amount.add(tx.fee)),
                        nonce: tx.nonce,
                    })
                    pendingAmount = pendingAmount.add(tx.amount).add(tx.fee)
                }
            }
            for (const result of results) {
                let webTx: ITxProp
                webTx = {
                    hash: result.txhash,
                    amount: result.amount,
                    fee: result.fee,
                    from: result.from,
                    to: result.to,
                    estimated: hycontoString(hyconfromString(result.amount).add(hyconfromString(result.fee))),
                    receiveTime: result.blocktime,
                    nonce: result.nonce,
                }
                webTxs.push(webTx)
            }
            const hyconWallet: IHyconWallet = {
                name,
                address: addrOfWallet.toString(),
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
                const pendings = this.txPool.getTxsOfAddress(address)
                let pendingAmount = Long.fromNumber(0)
                for (const pending of pendings) {
                    pendingAmount = pendingAmount.add(pending.amount).add(pending.fee)
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
                    const pendings = this.txPool.getTxsOfAddress(address)
                    let pendingAmount = Long.fromNumber(0, true)
                    for (const pending of pendings) {
                        pendingAmount = pendingAmount.add(pending.amount).add(pending.fee)
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
            txList.push({
                hash: new Hash(tx).toString(),
                amount: hycontoString(tx.amount),
                fee: hycontoString(tx.fee),
                from: tx.from.toString(),
                to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                signature: tx.signature.toString("hex"),
                estimated: hycontoString(tx.amount.add(tx.fee)),
            })
        }
        return Promise.resolve({ txs: txList, length: pageCount, totalCount: txPoolTxs.length, totalAmount: hycontoString(txPoolTxs.totalAmount), totalFee: hycontoString(txPoolTxs.totalFee) })
    }

    public async getPeerList(): Promise<IPeer[]> {
        const peerList: IPeer[] = []
        const peers = await this.network.getPeerDb()
        // tslint:disable-next-line:prefer-const
        let result: any
        for (const peer of peers) {
            // try {
            //     result = await ipLocation(peer.host)
            // } catch (e) {
            //     logger.info(`Peer Geoinfo error: ${e}`)
            // }
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
                location: result ? result.region_name : undefined,
                latitude: result ? result.latitude : undefined,
                longitude: result ? result.longitude : undefined,
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
            let webTx: ITxProp
            webTx = {
                hash: result.txhash,
                amount: result.amount,
                fee: result.fee,
                from: result.from,
                to: result.to,
                estimated: hycontoString(hyconfromString(result.amount).add(hyconfromString(result.fee))),
                receiveTime: result.blocktime,
                nonce: result.nonce,
            }
            webTxs.push(webTx)
        }
        return webTxs
    }

    public async getNextTxsInBlock(blockHash: string, txHash: string, index: number): Promise<ITxProp[]> {
        const cntPerPage: number = 10
        const results = await this.consensus.getNextTxsInBlock(blockHash, txHash, index, cntPerPage)
        const webTxs: ITxProp[] = []
        for (const result of results) {
            let webTx: ITxProp
            webTx = {
                hash: result.txhash,
                amount: result.amount,
                fee: result.fee,
                from: result.from,
                to: result.to,
                estimated: hycontoString(hyconfromString(result.amount).add(hyconfromString(result.fee))),
                receiveTime: result.blocktime,
                nonce: result.nonce,
            }
            webTxs.push(webTx)
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
            await setMiner(address)
            return true
        } catch (e) { return false }
    }

    public async startGPU(): Promise<boolean> {
        try {
            switch (globalOptions.os) {
                case "mac":
                    await opn(`./xmrig-opencl`, { wait: false })
                    break
                case "win":
                    await opn(`./xmrig-opencl.exe`, { wait: false })
                    break
                case "linux":
                    await opn(`./xmrig-opencl`, { wait: false })
                    break
                default:
                    logger.warn(`You can not run GPU Miner because the os is not set in the config file.`)
                    return false
            }
            return true
        } catch (e) {
            logger.warn(`Fail to start GPU binary file. Make sure that the binary file exists.`)
            return false
        }
    }

    public async setMinerCount(count: number): Promise<void> {
        this.miner.setMinerCount(Number(count))
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
                const pendings = this.txPool.getTxsOfAddress(address)
                let pendingAmount = Long.fromNumber(0)
                for (const pending of pendings) {
                    pendingAmount = pendingAmount.add(pending.amount).add(pending.fee)
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
            const signedTx = await Ledger.sign(address, hyconfromString(amount), nonce, hyconfromString(fee), index)

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

    public async generateHDWallet(Hwallet: IHyconWallet): Promise<string> {
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
                return Promise.reject("Information is missing.")
            }
        } catch (e) {
            throw e
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
        const genesis = await this.consensus.getBlockByHash(Hash.decode(`G4qXusbRyXmf62c8Tsha7iZoyLsVGfka7ynkvb3Esd1d`))
        let totalAmount: Long = hyconfromString(`0`)
        for (const tx of genesis.txs) {
            totalAmount = totalAmount.add(tx.amount)
        }

        const burnAmount = await this.consensus.getBurnAmount()
        totalAmount = totalAmount.sub(burnAmount.amount)

        const blockTip = await this.consensus.getBlocksTip()
        totalAmount = totalAmount.add(hyconfromString((blockTip.height * 240).toString()))

        const airdropAddr = await this.getAddressInfo(`H3nHqmqsamhY9LLm87GKLuXfke6gg8QmM`) as IWalletAddress
        const icoAddr = await this.getAddressInfo(`H3ynYLh9SkRCTnH59ZdU9YzrzzPVL5R1K`) as IWalletAddress
        const corpAddr = await this.getAddressInfo(`H8coFUhRwbY9wKhi6GGXQ2PzooqdE52c`) as IWalletAddress
        const teamAddr = await this.getAddressInfo(`H3r7mH8PVCjJF2CUj8JYu8L4umkayCC1e`) as IWalletAddress
        const bountyAddr = await this.getAddressInfo(`H278osmYQoWP8nnrvNypWB5YfDNk6Fuqb`) as IWalletAddress
        const developAddr = await this.getAddressInfo(`H4C2pYMHygAtSungDKmZuHhfYzjkiAdY5`) as IWalletAddress

        const circulatingSupply = totalAmount.sub(hyconfromString(airdropAddr.balance)).sub(hyconfromString(icoAddr.balance)).sub(hyconfromString(corpAddr.balance)).sub(hyconfromString(teamAddr.balance)).sub(hyconfromString(bountyAddr.balance)).sub(hyconfromString(developAddr.balance))

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
                const pendings = this.txPool.getTxsOfAddress(address)
                let pendingAmount = Long.fromNumber(0)
                for (const pending of pendings) {
                    pendingAmount = pendingAmount.add(pending.amount).add(pending.fee)
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
            const signedTx = await bitbox.sign(fromAddress, index, tx.password, address, hyconfromString(tx.amount), nonce, hyconfromString(tx.minerFee))
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
            return e
        }
    }

    public async getMiningReward(minerAddress: string, blockHash: string): Promise<string | IResponseError> {
        try {
            const result = await this.consensus.getMinedBlocks(new Address(minerAddress), 1, undefined, blockHash)
            return result.length > 0 ? result[0].feeReward : undefined
        } catch (e) {
            return e
        }
    }

    private async prepareSendTx(fromAddress: Address, toAddress: string, amount: string, minerFee: string, txNonce?: number): Promise<{ address: Address, nonce: number }> {
        let checkAddr = false
        try {
            const address = new Address(toAddress)
            checkAddr = true

            const account = await this.consensus.getAccount(fromAddress)
            let accountBalance = account.balance

            const pendings = this.txPool.getTxsOfAddress(fromAddress)
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
                pendingAmount = pendingAmount.add(pendingTx.amount).add(pendingTx.fee)
            }

            accountBalance = accountBalance.sub(pendingAmount)
            logger.warn(`Account Balance: ${hycontoString(account.balance)} / Pending Amount : ${hycontoString(pendingAmount)} /  Available : ${hycontoString(accountBalance)}`)
            logger.warn(`TX Amount: ${amount}`)
            logger.warn(`TX Miner Fee: ${minerFee}`)

            const totalSend = hyconfromString(amount).add(hyconfromString(minerFee))

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
}
