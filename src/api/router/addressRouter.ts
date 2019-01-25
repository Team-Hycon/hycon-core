import * as express from "express"
import { getLogger } from "log4js"
import { IRestRouter } from "../interface/iRestRouter"
import { AddressModel } from "../model/addressModel"
import { Responser } from "./responser"
const logger = getLogger("AddressRouter")

// tslint:disable:object-literal-sort-keys
export class AddressRouter implements IRestRouter {
    public readonly version: string = "v3"
    public readonly rootPath: string = "address"
    private readonly addressModel: AddressModel
    private readonly router: express.Router

    constructor(addressModel: AddressModel) {
        this.router = express.Router()
        this.routeRest()
        this.addressModel = addressModel
    }
    public getRouter() {
        return this.router
    }

    public routeRest() {
        this.router.get([``, `/:address`], async (req: express.Request, res: express.Response) => {
            const targetAddress = req.query.address || req.params.address
            const address = await this.addressModel.getAddress(targetAddress)
            Responser.checkAndRespondJSON(res, address)
        })
    }
}
