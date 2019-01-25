import * as express from "express"
import { IRestRouter } from "../interface/iRestRouter"
import { TransactionModel } from "../model/transactionModel"
import { Responser } from "./responser"

// tslint:disable:object-literal-sort-keys
export class TransactionRouter implements IRestRouter {
    public readonly version: string = "v3"
    public readonly rootPath: string = "tx"

    private readonly transactionModel: TransactionModel
    private readonly router: express.Router

    constructor(transactionModel: TransactionModel) {
        this.transactionModel = transactionModel
        this.router = express.Router()
        this.routeRest()
    }
    public getRouter() {
        return this.router
    }

    public routeRest() {
        // Handle transaction request with query parameter
        this.router.get([`/pending`, `/pending/:address`], async (req: express.Request, res: express.Response) => {
            const address = req.query.address || req.params.address
            const response = await this.transactionModel.getPendingTxs(address, req.query.count)
            Responser.checkAndRespondJSON(res, response)
        })

        this.router.get([``, `/:hashOrAddress`], async (req: express.Request, res: express.Response) => {
            const hashOrAddress = req.query.hash || req.query.address || req.params.hashOrAddress
            const response = await this.transactionModel.getTx(hashOrAddress, req.query.count)
            Responser.checkAndRespondJSON(res, response)
        })

        this.router.post([``], async (req: express.Request, res: express.Response) => {
            const response = await this.transactionModel.outgoingTx(
                req.body.from,
                req.body.to,
                req.body.amount,
                req.body.fee,
                req.body.signature,
                req.body.recovery,
                req.body.nonce,
            )
            Responser.checkAndRespondJSON(res, response)
        })

    }
}
