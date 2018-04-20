import commandLineArgs = require("command-line-args")
import { getLogger } from "log4js"
import Long = require("long")
import { IResponseError } from "./api/client/rest"
import { HttpServer } from "./api/server/server"
import { Address } from "./common/address"
import { ITxPool } from "./common/itxPool"
import { TxPool } from "./common/txPool"
import { SignedTx } from "./common/txSigned"
import { Database } from "./consensus/database/database"
import { TxDatabase } from "./consensus/database/txDatabase"
import { WorldState } from "./consensus/database/worldState"
import { IConsensus } from "./consensus/iconsensus"
import { IMiner } from "./miner/iminer"
import { MinerServer } from "./miner/minerServer"
import { StratumServer } from "./miner/stratumServer"
import { RabbitNetwork } from "./network/rabbit/rabbitNetwork" // for speed
import { RestManager } from "./rest/restManager"
import * as proto from "./serialization/proto"
import { Block, INetwork, Tx } from "./serialization/proto"
import { Server } from "./server"
import { hyconfromString, hycontoString } from "./util/commonUtil"
import { TestWalletMnemonics } from "./util/genWallet"
import { Hash } from "./util/hash"
import { Wallet } from "./wallet/wallet"
import { WalletManager } from "./wallet/walletManager"

function randomInt(min, max) { return min + Math.floor((max - min) * Math.random()) }
// tslint:disable-next-line:no-var-requires
const assert = require("assert")

const logger = getLogger("TestServer")

/*
test functions
*/
export class TestServer {

    public static walletNumber = 12
    public server: Server
    private txs: Tx[] = []
    private index: number = 1
    private wallets: Wallet[] = []
    private txPool: ITxPool
    private consensus: IConsensus = undefined // the core
    private txdb: TxDatabase

    private nonceTable: Map<string, number>
    constructor(server: Server) {
        this.server = server
        this.txPool = server.txPool
        this.nonceTable = new Map<string, number>()
        this.consensus = server.consensus
        assert(this.txPool)
        this.makeWallet()
    }

    public async showWallets() {
        for (let i = 0; i < TestServer.walletNumber; i++) {
            const w = this.wallets[i]
            const account = await this.server.consensus.getAccount(w.pubKey.address())
            assert(account)
            // assert(account.balance.compare(0) === 1)
            logger.debug(`Wallet${i} Public=${w.pubKey.address().toString()} Balance=${hycontoString(account.balance)}`)
            assert(w)
        }
    }

    public async makeWallet() {
        for (const { mnemonic } of TestWalletMnemonics) {
            this.wallets.push(Wallet.generate({ mnemonic, language: "english" }))
        }
        await this.showWallets()
        logger.debug(`done`)

        setInterval(() => {
            this.makeTx()
        }, 10000)
    }
    private async makeTx() {
        const amt = hyconfromString("12345")
        const fee = hyconfromString("10")

        const n = 100
        const lastWalletIndex = this.wallets.length - 1
        const txList: SignedTx[] = []
        for (let i = 0; i < n; i++) {
            // get nonce, increase 1
            const toWallet = this.wallets[randomInt(0, this.wallets.length - 1)]
            assert(toWallet)
            const toAddr = toWallet.pubKey.address()
            const fromWallet = this.wallets[randomInt(0, this.wallets.length - 1)]
            assert(fromWallet)
            const fromAddr = fromWallet.pubKey.address()
            const fromAddrString = fromAddr.toString()

            if (fromAddr.equals(toAddr)) {
                continue
            }
            let nonce
            if (this.nonceTable.has(fromAddrString)) {
                nonce = this.nonceTable.get(fromAddrString) + 1
            } else {
                nonce = await this.server.consensus.getNonce(fromAddr) + 1
            }

            // record
            this.nonceTable.set(fromAddrString, nonce)
            const a = amt.add(randomInt(0, 10) * Math.pow(10, 9)).add(randomInt(0, 10) * Math.pow(10, 9)).add(randomInt(0, 10) * Math.pow(10, 9))
            const b = fee.add(randomInt(0, 10) * Math.pow(10, 9)).add(randomInt(0, 10) * Math.pow(10, 9))
            const tx = fromWallet.send(toAddr, a, nonce, b)
            // logger.debug(`TX ${txList.length} Nonce=${nonce} Amount=${hycontoString(tx.amount)} Fee=${hycontoString(tx.fee)} From=${fromAddr.toString()} To = ${toAddr.toString()}`)
            txList.push(tx)
        }

        logger.debug(`Put TxList Size=${txList.length}`)
        const added = await this.txPool.putTxs(txList)
        // broadcast txs to hycon nework
        const encoded: Uint8Array = proto.Network.encode({ putTx: { txs: txList } }).finish()
        this.server.network.broadcast(new Buffer(encoded), null)
    }

    // TODO : Block, hash, SignedTx import, and testMakeBlock(db, consensus) remove
    // tslint:disable-next-line:member-ordering
    public async testConsensus() {
        const txs1 = this.txPool.updateTxs([], 8)
        let count = 0
        for (const tx of txs1) {
            logger.error(`Tx${count++} : ${new Hash(tx)}`)
        }
        const block1 = await this.server.consensus.testMakeBlock(txs1.slice(0, 5)) // 0, 1, 2, 3, 4
        const block1Hash = new Hash(block1.header)
        logger.error(`########################   Make block1:${block1Hash}`)
        for (const tx of block1.txs) {
            logger.error(`Tx : ${new Hash(tx)}`)
        }
        const block2 = await this.server.consensus.testMakeBlock(txs1.slice(2, 4)) // 2, 3
        const block2Hash = new Hash(block2.header)
        logger.error(`########################   Make block2:${block2Hash}`)
        for (const tx of block2.txs) {
            logger.error(`Tx : ${new Hash(tx)}`)
        }
        const block3 = await this.server.consensus.testMakeBlock(txs1.slice(0, 5)) // 0, 1, 2, 3, 4
        const block3Hash = new Hash(block3.header)
        logger.error(`########################   Make block3:${block3Hash}`)
        for (const tx of block3.txs) {
            logger.error(`Tx : ${new Hash(tx)}`)
        }

        setTimeout(async () => {
            const bblk1LastTxs = await this.server.consensus.getLastTxs(block1.txs[0].to)
            logger.error(`########################   Before Save Block1 Get Last Tx of tx[0].to`)
            for (const txList of bblk1LastTxs) {
                logger.error(`Tx Hash : ${new Hash(txList.txList.tx)}`)
            }
            logger.error(`########################   Save block1 : ${new Hash(block1.header)}`)
            await this.server.consensus.putBlock(block1)
            const bTip1 = this.server.consensus.getBlocksTip()
            const hTip1 = this.server.consensus.getHeaderTip()
            logger.error(`########################   Block1Tip : ${bTip1.hash}(${bTip1.height}) / Header1Tip : ${hTip1.hash}(${hTip1.height})`)
            const tipHash1 = await this.server.consensus.getHash(bTip1.height)
            logger.error(`########################   Get Hash using Tip Height : ${tipHash1}`)
            logger.error(`########################   After Save Block1 Get Last Tx of tx[0].to`)
            const ablk1LastTxs = await this.server.consensus.getLastTxs(block1.txs[0].to)
            for (const txList of ablk1LastTxs) {
                logger.error(`Tx Hash : ${new Hash(txList.txList.tx)}`)
            }

            logger.error(`########################   Save block2 : ${new Hash(block2.header)}`)
            await this.server.consensus.putBlock(block2)
            const bTip2 = this.server.consensus.getBlocksTip()
            const hTip2 = this.server.consensus.getHeaderTip()
            logger.error(`########################   Block2Tip : ${bTip2.hash}(${bTip2.height}) / Header2Tip : ${hTip2.hash}(${hTip2.height})`)
            const tipHash2 = await this.server.consensus.getHash(bTip2.height)
            logger.error(`########################   Get Hash using Tip Height : ${tipHash2}`)

            logger.error(`########################   Save block3 : ${new Hash(block3.header)}`)
            await this.server.consensus.putBlock(block3)
            const bTip3 = this.server.consensus.getBlocksTip()
            const hTip3 = this.server.consensus.getHeaderTip()
            logger.error(`########################   Block3Tip : ${bTip3.hash}(${bTip3.height}) / Header2Tip : ${hTip3.hash}(${hTip3.height})`)
            const tipHash3 = await this.server.consensus.getHash(bTip3.height)
            logger.error(`########################   Get Hash using Tip Height : ${tipHash3}`)

            // Block4(block2)
            setTimeout(async () => {
                const block4 = await this.server.consensus.testMakeBlock(this.txPool.updateTxs([], 2), block2)
                const block4Hash = new Hash(block4.header)
                logger.error(`########################   Make block4:${block4Hash}`)
                for (const tx of block4.txs) {
                    logger.error(`Tx : ${new Hash(tx)}`)
                }
                logger.error(`########################   Save block4 : ${new Hash(block4.header)}`)
                await this.server.consensus.putBlock(block4)
                // const bTip4 = this.server.consensus.getBlocksTip()
                // const hTip4 = this.server.consensus.getHeaderTip()
                // logger.error(`########################   Block4Tip : ${bTip4.hash}(${bTip4.height}) / Header4Tip : ${hTip4.hash}(${hTip4.height})`)
                // const tipHash4 = await this.server.consensus.getHash(bTip4.height)
                // logger.error(`########################   Get Hash using Tip Height : ${tipHash4}`)

                // // Block5(block3)
                // setTimeout(async () => {
                //     const block5 = await this.server.consensus.testMakeBlock(this.txPool.updateTxs([], 3), block3)
                //     const block5Hash = new Hash(block5.header)
                //     logger.error(`########################   Make block5:${block5Hash}`)
                //     logger.error(`########################   Save block5`)
                //     for (const tx of block5.txs) {
                //         logger.error(`Tx : ${new Hash(tx)}`)
                //     }
                //     await this.server.consensus.putBlock(block5)
                //     const bTip5 = this.server.consensus.getBlocksTip()
                //     const hTip5 = this.server.consensus.getHeaderTip()
                //     logger.error(`########################   Block5Tip : ${bTip5.hash}(${bTip5.height}) / Header5Tip : ${hTip5.hash}(${hTip5.height})`)
                //     const tipHash5 = await this.server.consensus.getHash(bTip5.height)
                //     logger.error(`########################   Get Hash using Tip Height : ${tipHash5}`)

                //     // Block6(block5)
                //     const block6 = await this.server.consensus.testMakeBlock(this.txPool.updateTxs([], 3), block5)
                //     const block6Hash = new Hash(block6.header)
                //     logger.error(`########################   Make block6:${block6Hash}`)
                //     logger.error(`########################   Save block6`)
                //     for (const tx of block6.txs) {
                //         logger.error(`Tx : ${new Hash(tx)}`)
                //     }
                //     await this.server.consensus.putBlock(block6)
                //     const bTip6 = this.server.consensus.getBlocksTip()
                //     const hTip6 = this.server.consensus.getHeaderTip()
                //     logger.error(`########################   Block6Tip : ${bTip6.hash}(${bTip6.height}) / Header5Tip : ${hTip6.hash}(${hTip6.height})`)
                //     const tipHash6 = await this.server.consensus.getHash(bTip6.height)
                //     logger.error(`########################   Get Hash using Tip Height : ${tipHash6}`)
                // }, 1000)

            }, 1000)

        }, 2000)
    }
}
