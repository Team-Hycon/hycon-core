import * as express from "express"
import { getLogger } from "log4js"
import { IRestRouter } from "../interface/iRestRouter"
import { BlockModel } from "../model/blockModel"
import { Responser } from "./responser"
const logger = getLogger("BlockRouter")

// tslint:disable:object-literal-sort-keys
export class BlockRouter implements IRestRouter {
    public readonly version: string = "v3"
    public readonly rootPath: string = "block"

    private readonly blockModel: BlockModel
    private readonly router: express.Router

    constructor(blockModel: BlockModel) {
        this.blockModel = blockModel
        this.router = express.Router()
        this.routeRest()
    }
    public getRouter() {
        return this.router
    }

    public routeRest() {
        this.router.get([`/tip`], async (req: express.Request, res: express.Response) => {
            const tips = this.blockModel.getTips()
            Responser.checkAndRespondJSON(res, tips)
        })

        this.router.get([`/mined`, `/mined/:address`], async (req: express.Request, res: express.Response) => {
            const targetAddress = req.query.address || req.params.address
            const minedInfo = await this.blockModel.getMinedInfo(targetAddress, req.query.count)
            Responser.checkAndRespondJSON(res, minedInfo)
        })

        this.router.get([``, `/:hashOrHeight`], async (req: express.Request, res: express.Response) => {
            const hashOrHeight = req.query.hash || req.query.height || req.params.hashOrHeight
            const blocks = await this.blockModel.getBlocks(req.query.range, hashOrHeight)
            Responser.checkAndRespondJSON(res, blocks)
        })
    }
}
