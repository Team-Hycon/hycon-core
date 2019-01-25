import * as express from "express"
import { IRestRouter } from "../interface/iRestRouter"
import { NetworkModel } from "../model/networkModel"
import { Responser } from "./responser"

export class NetworkRouter implements IRestRouter {
    public readonly version: string = "v3"
    public readonly rootPath: string = "network"

    private readonly networkModel: NetworkModel
    private readonly router: express.Router

    constructor(networkModel: NetworkModel) {
        this.networkModel = networkModel
        this.router = express.Router()
        this.routeRest()
    }
    public getRouter() {
        return this.router
    }

    public routeRest() {
        this.router.get([`/marketcap`], async (req: express.Request, res: express.Response) => {
            const marketCap = await this.networkModel.getMarketCap()
            Responser.checkAndRespondJSON(res, marketCap)
        })

        this.router.get([`/`, `/:hostOrCount`], async (req: express.Request, res: express.Response) => {
            const hostOrCount = req.query.count || req.query.host || req.params.hostOrCount
            Responser.checkAndRespondJSON(res, await this.networkModel.getPeerInfo(hostOrCount))
        })

    }
}
