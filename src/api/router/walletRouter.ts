import * as express from "express"
import { getLogger } from "log4js"
import { userOptions } from "../../main"
import { IRestRouter } from "../interface/iRestRouter"
import { WalletModel } from "../model/walletModel"
import { RESPONSE_CODE, Responser } from "./responser"
const logger = getLogger("WalletRouter")

// tslint:disable:object-literal-sort-keys
export class WalletRouter implements IRestRouter {
    public readonly version: string = "v3"
    public readonly rootPath: string = "wallet"

    private readonly walletModel: WalletModel
    private readonly router: express.Router

    constructor(walletModel: WalletModel) {
        this.router = express.Router()
        this.routeRest()
        this.walletModel = walletModel
    }
    public getRouter() {
        return this.router
    }

    public routeRest() {

        if (userOptions.nonLocal || userOptions.public_rest) {
            this.router.get(``, this.denyAccess)
            this.router.delete(``, this.denyAccess)
            this.router.post(``, this.denyAccess)
            this.router.put(``, this.denyAccess)
            return
        }
        this.localRouter()
    }

    private localRouter() {
        this.router.get([`/list`], async (req: express.Request, res: express.Response) => {
            const wallets = await this.walletModel.getWalletList()
            Responser.checkAndRespondJSON(res, wallets)
        })
        this.router.get([``, `/:nameoraddress`], async (req: express.Request, res: express.Response) => {
            const nameoraddress = req.query.name || req.query.address || req.params.nameoraddress
            const wallet = await this.walletModel.getWallet(nameoraddress)
            Responser.checkAndRespondJSON(res, wallet)
        })
        this.router.delete([``, `/:nameoraddress`], async (req: express.Request, res: express.Response) => {
            const nameoraddress = req.query.name || req.query.address || req.params.nameoraddress
            const success = await this.walletModel.deleteWallet(nameoraddress)
            Responser.checkAndRespondJSON(res, success)
        })

        this.router.post([``], async (req: express.Request, res: express.Response) => {
            if (req.body.name === undefined) {
                const mnemonic = await this.walletModel.getRandomeMnemonic(req.body.language)
                Responser.checkAndRespondJSON(res, mnemonic)
                return
            }

            const hdWallet = await this.walletModel.checkAndGetHDWallet(req.body)
            if (hdWallet) {
                Responser.checkAndRespondJSON(res, hdWallet)
                return
            }

            const wallet = await this.walletModel.createWallet(req.body)
            Responser.checkAndRespondJSON(res, wallet)
        })
    }

    private async denyAccess(req: express.Request, res: express.Response) {
        Responser.checkAndRespondJSON(res, Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `You cannot access publically`))
    }
}
