import { getLogger } from "log4js"
import * as Long from "long"
import opn = require("opn")
import { Address } from "../../common/address"
import { BlockHeader } from "../../common/blockHeader"
import { ITxPool } from "../../common/itxPool"
import { Tx } from "../../common/tx"
import { SignedTx } from "../../common/txSigned"
import { IConsensus } from "../../consensus/iconsensus"
import { globalOptions } from "../../main"
import { setMiner } from "../../main"
import { MinerServer } from "../../miner/minerServer"
import { INetwork } from "../../network/inetwork"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { Wallet } from "../../wallet/wallet"
import { IBlock, IHyconWallet, IMinedInfo, IMiner, IPeer, IResponseError, IRest, ITxProp, IUser, IWalletAddress } from "../client/rest"
import { hyconfromString, hycontoString, zeroPad } from "../client/stringUtil"
const logger = getLogger("RestServer")

// tslint:disable-next-line:no-var-requires
const ipLocation = require("ip-location")
// tslint:disable-next-line:no-var-requires
const googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyAp-2W8_T6dZjq71yOhxW1kRkbY6E1iyuk",
})

// tslint:disable:object-literal-sort-keys
// tslint:disable:ban-types
// tslint:disable:no-bitwise
export class RestServer implements IRest {
    private consensus: IConsensus
    private txPool: ITxPool
    private network: INetwork
    private miner: MinerServer

    constructor(consensus: IConsensus, network: INetwork, txPool: ITxPool, miner: MinerServer) {
        this.consensus = consensus
        this.network = network
        this.txPool = txPool
        this.miner = miner
    }

    public loadingListener(callback: (loading: boolean) => void): void {
        callback(false)
    }
    public setLoading(loading: boolean): void { }

    public async createNewWallet(meta: IHyconWallet): Promise<IHyconWallet | IResponseError> {
        try {
            let wallet: Wallet
            await Wallet.walletInit()
            if (meta.mnemonic === undefined) {
                meta.mnemonic = Wallet.getRandomMnemonic(meta.language)
            }
            wallet = Wallet.generateKeyWithMnemonic(meta.mnemonic, meta.language, meta.passphrase)

            return Promise.resolve({
                mnemonic: meta.mnemonic,
                privateKey: wallet.privKey.toHexString(),
                address: wallet.pubKey.address().toString(),
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
        try {
            const address = new Address(tx.to)
            const wallet = new Wallet(Buffer.from(tx.privateKey, "hex"))
            const account = await this.consensus.getAccount(new Address(wallet.pubKey.address()))
            const nonce = tx.nonce === undefined ? account.nonce + 1 : tx.nonce
            const total = hyconfromString(tx.amount).add(hyconfromString(tx.fee))
            logger.debug(`Total HYC: ${hycontoString(total)}`)
            logger.debug(`Account Balance: ${hycontoString(account.balance)}`)
            logger.debug(`Boolean: ${account.balance.lessThan(total)}`)
            if (account.balance.lessThan(total)) {
                throw new Error("insufficient wallet balance to send transaction")
            }
            const signedTx = wallet.send(address, hyconfromString(tx.amount.toString()), nonce, hyconfromString(tx.fee.toString()))
            if (queueTx) {
                queueTx(signedTx)
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

    public async outgoingTx(tx: { signature: string, from: string, to: string, amount: string, fee: string, nonce: number, recovery: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        try {
            const address = {
                from: new Address(tx.from),
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
            const account = await this.consensus.getAccount(new Address(tx.from))
            const total = hyconfromString(tx.amount).add(hyconfromString(tx.fee))
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

    public async getAddressInfo(address: string): Promise<IWalletAddress> {
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
            let pendingAmount = hyconfromString("0")
            if (pendings !== undefined) {
                for (const tx of pendings) {
                    webTxs.push({
                        hash: new Hash(tx).toString(),
                        amount: hycontoString(tx.amount),
                        fee: hycontoString(tx.fee),
                        from: tx.from.toString(),
                        to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        signature: tx.signature.toString("hex"),
                        estimated: hycontoString(tx.amount.add(tx.fee)),
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
                }
                webTxs.push(webTx)
            }
            return Promise.resolve<IWalletAddress>({
                hash: address,
                balance: account ? hycontoString(account.balance) : "0.0",
                nonce: account.nonce,
                txs: webTxs,
                minedBlocks,
                pendingAmount: hycontoString(pendingAmount),
            })
        } catch (e) {
            logger.warn(`${e}`)
            throw e
        }
    }

    public async getAllAccounts(name: string): Promise<{ represent: number, accounts: Array<{ address: string, balance: string }> } | boolean> {
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
            return Promise.resolve({ represent: 0, accounts: result }) // TODO: Remove repressent
        } catch (e) {
            return Promise.resolve(false)
        }
    }

    public async getBlock(hash: string): Promise<IBlock | IResponseError> {
        try {
            // const dbBlock = await this.db.getDBBlock(Hash.decode(hash))
            const hyconBlock = await this.consensus.getBlockByHash(Hash.decode(hash))
            const txs: ITxProp[] = []
            for (const hyconTx of hyconBlock.txs) {
                if (hyconTx instanceof SignedTx) {
                    txs.push({
                        amount: hycontoString(hyconTx.amount),
                        hash: new Hash(hyconTx).toString(),
                        fee: hycontoString(hyconTx.fee),
                        from: hyconTx.from.toString(),
                        to: hyconTx.to !== undefined ? hyconTx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        estimated: hycontoString(hyconTx.amount.add(hyconTx.fee)),
                        receiveTime: hyconBlock.header.timeStamp,
                    })
                } else {
                    txs.push({
                        amount: hycontoString(hyconTx.amount),
                        hash: new Hash(hyconTx).toString(),
                        to: hyconTx.to !== undefined ? hyconTx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        estimated: hycontoString(hyconTx.amount),
                        receiveTime: hyconBlock.header.timeStamp,
                    })
                }
            }

            const webBlock = {
                hash,
                difficulty: hyconBlock.header.difficulty.toExponential(),
                stateRoot: hyconBlock.header.stateRoot.toString(),
                merkleRoot: hyconBlock.header.merkleRoot.toString(),
                txs,
                height: await this.consensus.getBlockHeight(Hash.decode(hash)),
                timeStamp: Number(hyconBlock.header.timeStamp),

            }
            if (hyconBlock.header instanceof BlockHeader) {
                Object.assign(webBlock, {
                    prevBlock: hyconBlock.header.previousHash.toString(),
                    nonce: zeroPad(hyconBlock.header.nonce.low.toString(16), 8) + zeroPad(hyconBlock.header.nonce.high.toString(16), 8),
                    miner: hyconBlock.header.miner.toString(),
                })

                const buffer = Buffer.allocUnsafe(72)
                buffer.fill(hyconBlock.header.preHash(), 0, 64)
                buffer.writeUInt32LE(hyconBlock.header.nonce.getLowBitsUnsigned(), 64)
                buffer.writeUInt32LE(hyconBlock.header.nonce.getHighBitsUnsigned(), 68)
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
        const mapHashTx: Map<Hash, SignedTx> = new Map<Hash, SignedTx>()
        try {
            await Wallet.walletInit()
            const addrOfWallet = new Address(await Wallet.getAddress(name))
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
            let pendingAmount = hyconfromString("0")
            if (pendings !== undefined) {
                logger.debug(`getTxsOfAddress result  = ${pendings.length}`)
                for (const tx of pendings) {
                    webTxs.push({
                        hash: new Hash(tx).toString(),
                        amount: hycontoString(tx.amount),
                        fee: hycontoString(tx.fee),
                        from: tx.from.toString(),
                        to: tx.to !== undefined ? tx.to.toString() : "🔥Gimme fuel, gimme fire🔥",
                        signature: tx.signature.toString("hex"),
                        estimated: hycontoString(tx.amount.add(tx.fee)),
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
                }
                webTxs.push(webTx)
            }
            const hyconWallet: IHyconWallet = {
                name,
                address: addrOfWallet.toString(),
                balance: account ? hycontoString(account.balance) : "0",
                txs: webTxs,
                minedBlocks,
                pendingAmount: hycontoString(pendingAmount),
            }
            return Promise.resolve(hyconWallet)
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
                const address = new Address(wallet.address)
                const name = wallet.name
                const account = await this.consensus.getAccount(address)
                const tmpHwallet: IHyconWallet = {
                    address: address.toString(),
                    name,
                    balance: account ? hycontoString(account.balance) : "0",
                }
                walletList.push(tmpHwallet)
            }
            return Promise.resolve({ walletList, length: walletListResult.length })
        } catch (e) {
            return Promise.reject("Error get wallet list : " + e)
        }
    }

    public async recoverWallet(Hwallet: IHyconWallet): Promise<string | boolean> {
        await Wallet.walletInit()
        if (Hwallet.name !== undefined && Hwallet.mnemonic !== undefined && Hwallet.language !== undefined) {
            const isValid = Wallet.validateMnemonic(Hwallet.mnemonic, Hwallet.language)
            if (isValid) {
                try {
                    let password = Hwallet.password
                    let passphrase = Hwallet.passphrase
                    let hint = Hwallet.hint
                    if (Hwallet.password === undefined) { password = "" }
                    if (Hwallet.passphrase === undefined) { passphrase = "" }
                    if (Hwallet.hint === undefined) { hint = "" }
                    const addressString = await Wallet.recoverWallet({ name: Hwallet.name, passphrase, mnemonic: Hwallet.mnemonic, language: Hwallet.language, hint }, password)
                    return Promise.resolve(addressString)
                } catch (e) {
                    return Promise.resolve(false)
                }
            } else {
                return Promise.resolve(false)
            }
        } else {
            return Promise.resolve(false)
        }
    }

    public async sendTx(tx: { name: string, password: string, address: string, amount: number, minerFee: number, nonce?: number }, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        tx.password === undefined ? tx.password = "" : tx.password = tx.password
        let checkPass = false
        let checkAddr = false
        try {
            await Wallet.walletInit()
            const wallet = await Wallet.loadKeys(tx.name, tx.password)
            checkPass = true

            const walletAddress = wallet.pubKey.address()
            const address = new Address(tx.address)
            checkAddr = true

            const account = await this.consensus.getAccount(walletAddress)
            let accountBalance = account.balance

            const addressTxs = this.txPool.getTxsOfAddress(walletAddress)
            let nonce: number
            if (addressTxs.length > 0 && tx.nonce === undefined) {
                nonce = addressTxs[addressTxs.length - 1].nonce + 1
            } else if (tx.nonce !== undefined) {
                nonce = Number(tx.nonce)
            } else {
                nonce = account.nonce + 1
            }
            const totalAmount = Long.fromNumber(0, true)
            for (const addrTx of addressTxs) {
                totalAmount.add(addrTx.amount).add(addrTx.fee)
            }

            accountBalance = accountBalance.sub(totalAmount)

            logger.warn(`Account Balance: ${account.balance} / Pending Amount : ${totalAmount} /  Available : ${account.balance.sub(totalAmount)}`)
            logger.warn(`TX Amount: ${tx.amount}`)
            logger.warn(`TX Miner Fee: ${tx.minerFee}`)

            const amt = hyconfromString(tx.amount.toString()).add(hyconfromString(tx.minerFee.toString()))

            logger.warn(`TX Total: ${hycontoString(amt)}`)
            if (amt.greaterThan(accountBalance)) {
                throw new Error("insufficient wallet balance to send transaction")
            }

            const signedTx = wallet.send(address, hyconfromString(tx.amount.toString()), nonce, hyconfromString(tx.minerFee.toString()))
            if (queueTx) { queueTx(signedTx) } else { return Promise.reject(false) }
            return Promise.resolve({ res: true })
        } catch (e) {
            logger.warn(e)
            if (!checkPass) { return Promise.resolve({ res: false, case: 1 }) }
            if (!checkAddr) { return Promise.resolve({ res: false, case: 2 }) }
            return Promise.resolve({ res: false, case: 3 })
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
        const peers: proto.IPeer[] = await this.network.getPeerDb()
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
        return peerList
    }

    public getPeerConnected(index: number): Promise<{ peersInPage: IPeer[], pages: number }> {
        const peerList: IPeer[] = []
        const peers: proto.IPeer[] = this.network.getConnection()
        for (const peer of peers) {
            const temp: IPeer = {
                host: peer.host,
                port: peer.port,
                currentQueue: peer.currentQueue,
                active: peer.active,
            }
            peerList.push(temp)
        }
        const start = index * 20
        const end = start + 20
        const peersInPage = peerList.slice(start, end)
        const pages = Math.ceil(peerList.length / 20)
        return Promise.resolve({ peersInPage, pages })
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
        const minedInfo = await this.consensus.getMinedBlocks(new Address(address), cntPerPage, index, Hash.decode(blockHash))
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
        let networkHashRate = 0
        if (currentDiff !== 0) {
            networkHashRate = 1 / (currentDiff * 30 * Math.LN2)
        }
        return { cpuHashRate: minerInfo.hashRate, networkHashRate: Math.round(networkHashRate), currentMinerAddress: minerInfo.address, cpuCount: minerInfo.cpuCount }
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
        } else {
            return false
        }
    }
}
