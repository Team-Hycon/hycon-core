import * as express from "express"
import { getLogger } from "log4js"
import { SignedTx } from "../../common/txSigned"
import { userOptions } from "../../main"
import { RestManager } from "../../rest/restManager"
import { IRestRouter } from "../interface/iRestRouter"
import { RestV1Service } from "./restV1Service"
const logger = getLogger("RestV1Router")
// tslint:disable:object-literal-sort-keys
export class RestV1Router implements IRestRouter {
    public rest: RestV1Service
    public readonly version: string = "v1"
    public readonly rootPath: string = ""

    public hyconServer: RestManager

    private router: express.Router

    constructor(rest: RestV1Service, hyconServer: RestManager) {
        this.rest = rest
        this.hyconServer = hyconServer
        this.router = express.Router()
        this.routeRest()
    }

    public getRouter() {
        return this.router
    }

    public routeRest() {
        if (userOptions.public_rest !== true) {
            // Private, only available on local
            this.router.get("/wallet/", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getWalletList())
            })
            this.router.post("/wallet", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.createNewWallet({
                    privateKey: req.body.privateKey,
                    mnemonic: req.body.mnemonic,
                    language: req.body.language,
                    passphrase: req.body.passphrase,
                }))
            })

            this.router.get("/wallet/:idx", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getWalletList(req.params.idx))
            })

            this.router.get("/wallet/:address/balance", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getWalletBalance(req.params.address))
            })
            this.router.put("/wallet/:address/callback", async (req: express.Request, res: express.Response) => {
                res.json(await this.hyconServer.createSubscription({
                    address: req.params.address,
                    url: req.body.url,
                    from: req.body.from,
                    to: req.body.to,
                }))
            })
            this.router.delete("/wallet/:address/callback/:id", async (req: express.Request, res: express.Response) => {
                res.json(await this.hyconServer.deleteSubscription(req.params.address, req.params.id))
            })
            this.router.get("/wallet/:address/txs/:nonce?", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getWalletTransactions(req.params.address, req.params.nonce))
            })

            this.router.get("/wallet/detail/:name", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getWalletDetail(req.params.name))
            })
            this.router.post("/recoverWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.recoverWallet({
                        name: req.body.name,
                        password: req.body.password,
                        passphrase: req.body.passphrase,
                        hint: req.body.hint,
                        mnemonic: req.body.mnemonic,
                        language: req.body.language,
                    }),
                )
            })
            this.router.post("/signedtx", async (req: express.Request, res: express.Response) => {
                logger.debug("Route triggered")
                res.json(
                    await this.rest.outgoingSignedTx({
                        privateKey: req.body.privateKey,
                        to: req.body.to,
                        amount: req.body.amount,
                        fee: req.body.fee,
                        nonce: req.body.nonce,
                    }, async (tx: SignedTx) => {
                        const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                        this.hyconServer.broadcastTxs(newTxs)
                    }),
                )
            })

            this.router.get("/deleteWallet/:name", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.deleteWallet(req.params.name))
            })
            this.router.post("/generateWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.generateWallet({
                        name: req.body.name,
                        password: req.body.password,
                        passphrase: req.body.passphrase,
                        hint: req.body.hint,
                        mnemonic: req.body.mnemonic,
                        language: req.body.language,
                    }),
                )
            })

            this.router.get("/getAllAccounts", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getAllAccounts(req.body.name, req.body.password, req.body.startIndex))
            })
            this.router.get("/getMnemonic/:lang", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getMnemonic(req.params.lang))
            })

            this.router.get("/getMiner", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getMiner())
            })

            this.router.get("/setMiner/:address", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.setMiner(req.params.address))
            })

            this.router.get("/setMinerCount/:count", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.setMinerCount(req.params.count))
            })

            this.router.get("/favorites", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getFavoriteList())
            })
            this.router.get("/favorites/add/:alias/:address", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.addFavorite(req.params.alias, req.params.address))
            })
            this.router.get("/favorites/delete/:alias", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.deleteFavorite(req.params.alias))
            })

            this.router.post("/addWalletFile", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.addWalletFile(req.body.name, req.body.password, req.body.key))
            })

            this.router.get("/hint/:name", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getHint(req.params.name))
            })

            this.router.get("/dupleName/:name", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.checkDupleName(req.params.name))
            })

            this.router.get("/peerList", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getPeerList())
            })

            this.router.get("/peerConnected/:index", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.getPeerConnected(req.params.index))
            })

            this.router.post("/transaction", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.sendTx({
                        name: req.body.name,
                        password: req.body.password,
                        address: req.body.address,
                        amount: req.body.amount,
                        minerFee: req.body.minerFee,
                        nonce: req.body.nonce,
                    }, async (tx: SignedTx) => {
                        const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                        this.hyconServer.broadcastTxs(newTxs)
                    }),
                )
            })

            this.router.post("/sendTxWithHDWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.sendTxWithHDWallet({
                        name: req.body.name,
                        password: req.body.password,
                        address: req.body.address,
                        amount: req.body.amount,
                        minerFee: req.body.minerFee,
                        nonce: req.body.nonce,
                    }, req.body.index,
                        async (tx: SignedTx) => {
                            const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                            this.hyconServer.broadcastTxs(newTxs)
                        }),
                )
            })

            this.router.post("/getHDWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.getHDWallet(req.body.name, req.body.password, req.body.index, req.body.count),
                )
            })

            this.router.post("/generateHDWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.generateHDWallet({
                        name: req.body.name,
                        password: req.body.password,
                        passphrase: req.body.passphrase,
                        hint: req.body.hint,
                        mnemonic: req.body.mnemonic,
                        language: req.body.language,
                    }),
                )
            })

            this.router.post("/recoverHDWallet", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.recoverHDWallet({
                        name: req.body.name,
                        password: req.body.password,
                        passphrase: req.body.passphrase,
                        hint: req.body.hint,
                        mnemonic: req.body.mnemonic,
                        language: req.body.language,
                    }),
                )
            })

            this.router.post("/HDwallet", async (req: express.Request, res: express.Response) => {
                res.json(await this.rest.createNewHDWallet({
                    rootKey: req.body.rootKey,
                    mnemonic: req.body.mnemonic,
                    language: req.body.language,
                    passphrase: req.body.passphrase,
                    index: req.body.index,
                }))
            })
            this.router.post("/getHDWalletFromRootKey", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.getHDWalletFromRootKey(req.body.rootKey, req.body.index, req.body.count),
                )
            })
            this.router.post("/sendTxWithHDWalletRootKey", async (req: express.Request, res: express.Response) => {
                res.json(
                    await this.rest.sendTxWithHDWalletRootKey({
                        address: req.body.tx.address,
                        amount: req.body.tx.amount,
                        minerFee: req.body.tx.minerFee,
                        nonce: req.body.tx.nonce,
                    }, req.body.rootKey, req.body.index,
                        async (tx: SignedTx) => {
                            const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                            this.hyconServer.broadcastTxs(newTxs)
                        }),
                )
            })
        }

        // Public, always available
        this.router.post("/tx", async (req: express.Request, res: express.Response) => {
            res.json(
                await this.rest.outgoingTx({
                    signature: req.body.signature,
                    from: req.body.from,
                    to: req.body.to,
                    amount: req.body.amount,
                    fee: req.body.fee,
                    nonce: req.body.nonce,
                    recovery: req.body.recovery,
                    transitionSignature: req.body.transitionSignature,
                    transitionRecovery: req.body.transitionRecovery,
                }, async (tx: SignedTx) => {
                    const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                    this.hyconServer.broadcastTxs(newTxs)
                }),
            )
        })
        this.router.get("/block/:hash/:txcount?", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getBlock(req.params.hash, req.params.txcount))
        })
        this.router.get("/block/height/:height", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getBlockAtHeight(req.params.height))
        })
        this.router.get("/blockList/:index", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getBlockList(req.params.index))
        })
        this.router.get("/toptipHeight/", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getTopTipHeight())
        })
        this.router.get("/getHTipHeight/", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getHTipHeight())
        })
        this.router.get("/address/:address", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getAddressInfo(req.params.address))
        })
        this.router.get("/language", async (req: express.Request, res: express.Response) => {
            res.json("error TS2339: Property 'getLanguage' does not exist on type 'RestServer'.")
            // res.json(await this.rest.getLanguage())
        })
        this.router.get("/tx/:hash", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getTx(req.params.hash))
        })
        this.router.get("/txList/:index", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getPendingTxs(req.params.index))
        })
        this.router.get("/nextTxs/:address/:txHash/:index", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getNextTxs(req.params.address, req.params.txHash, req.params.index))
        })
        this.router.get("/nextTxsInBlock/:blockhash/:txHash/:index", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getNextTxsInBlock(req.params.blockhash, req.params.txHash, req.params.index))
        })
        this.router.get("/getMinedInfo/:address/:blockHash/:index", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getMinedBlocks(req.params.address, req.params.blockHash, req.params.index))
        })
        this.router.get("/getLedgerWallet/:startIndex/:count", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getLedgerWallet(req.params.startIndex, req.params.count))
        })
        this.router.post("/sendTxWithLedger", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.sendTxWithLedger(
                req.body.index,
                req.body.from,
                req.body.to,
                req.body.amount,
                req.body.fee,
                req.body.txNonce,
                async (tx: SignedTx) => {
                    const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                    this.hyconServer.broadcastTxs(newTxs)
                }))
        })
        this.router.get("/possibilityLedger", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.possibilityLedger())
        })
        this.router.get("/getMarketCap", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getMarketCap())
        })
        this.router.get("/checkPasswordBitbox", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.checkPasswordBitbox())
        })
        this.router.post("/checkWalletBitbox", async (req: express.Request, res: express.Response) => {
            res.json(
                await this.rest.checkWalletBitbox(req.body.password),
            )
        })
        this.router.post("/getBitboxWallet", async (req: express.Request, res: express.Response) => {
            res.json(
                await this.rest.getBitboxWallet(req.body.password, req.body.startIndex, req.body.count),
            )
        })
        this.router.post("/sendTxWithBitbox", async (req: express.Request, res: express.Response) => {
            res.json(
                await this.rest.sendTxWithBitbox({
                    from: req.body.from,
                    password: req.body.password,
                    address: req.body.address,
                    amount: req.body.amount,
                    minerFee: req.body.minerFee,
                    nonce: req.body.nonce,
                }, req.body.index,
                    async (tx: SignedTx) => {
                        const newTxs = await this.hyconServer.txQueue.putTxs([tx])
                        this.hyconServer.broadcastTxs(newTxs)
                    }),
            )
        })
        this.router.post("/setBitboxPassword", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.setBitboxPassword(req.body.password))
        })
        this.router.post("/createBitboxWallet", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.createBitboxWallet(req.body.name, req.body.password))
        })
        this.router.post("/updateBitboxPassword", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.updateBitboxPassword(req.body.originalPwd, req.body.newPwd))
        })
        this.router.get("/isUncleBlock/:blockHash", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.isUncleBlock(req.params.blockHash))
        })
        this.router.get("/getMiningReward/:blockHash", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getMiningReward(req.params.blockHash))
        })
        this.router.get("/getBlocksFromHeight/:from/:count", async (req: express.Request, res: express.Response) => {
            res.json(await this.rest.getBlocksFromHeight(req.params.from, req.params.count))
        })
    }
}
