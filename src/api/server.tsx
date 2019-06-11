import * as bodyParser from "body-parser"
import * as timeout from "connect-timeout"
import * as express from "express"
import { getLogger } from "log4js"
const opn = require("opn")
import { matchRoutes } from "react-router-config"
import { userOptions } from "../main"
import { RestManager } from "../rest/restManager"
import { routes } from "./client/app"
import { RestClient } from "./client/restClient"
import { getAPIPath, IRestRouter } from "./interface/iRestRouter"
import { indexRender } from "./legacy/index"
import { RestV1Router } from "./legacy/restV1Router"
import { RestV1Service } from "./legacy/restV1Service"
import { AddressModel } from "./model/addressModel"
import { BlockModel } from "./model/blockModel"
import { NetworkModel } from "./model/networkModel"
import { TransactionModel } from "./model/transactionModel"
import { WalletModel } from "./model/walletModel"
import { AddressRouter } from "./router/addressRouter"
import { BlockRouter } from "./router/blockRouter"
import { NetworkRouter } from "./router/networkRouter"
import { RESPONSE_CODE, Responser } from "./router/responser"
import { TransactionRouter } from "./router/transactionRouter"
import { WalletRouter } from "./router/walletRouter"
const logger = getLogger("APIServer")

// tslint:disable:object-literal-sort-keys
export class HttpServer {
    public app: express.Application
    public restV1Service: RestV1Service
    public hyconServer: RestManager
    private blockModel: BlockModel
    private walletModel: WalletModel
    private transactionModel: TransactionModel
    private networkModel: NetworkModel
    private addressModel: AddressModel

    constructor(hyconServer: RestManager, port: number = 2442) {
        this.hyconServer = hyconServer
        this.restV1Service = new RestV1Service(hyconServer.consensus, hyconServer.network, hyconServer.txQueue, hyconServer.miner)
        this.createModels()

        this.app = express()
        this.app.use(timeout("5s"))
        this.config()
        this.setResponseHeader()

        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => this.reactRoute(req, res, next))
        if (userOptions.public_rest !== true) {
            this.app.use(express.static("data/clientDist"))
            this.app.use(express.static("node_modules"))
        }
        this.routeRest()
        this.app.use(this.timeoutResponse)
        this.app.use(this.notFoundResponse)
        this.app.use(this.invalidJSONResponse)

        if (userOptions.nonLocal || userOptions.public_rest === true) {
            this.app.listen(port, () => this.open(port))
        } else {
            this.app.listen(port, "localhost", () => this.open(port))
        }
        logger.info(">>>>>>> Started RESTful API")
    }

    private setResponseHeader() {
        this.app.all("/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // res.header("Access-Control-Allow-Origin", "localhost")
            if (userOptions.nonLocal || userOptions.public_rest === true) {
                res.header("Access-Control-Allow-Origin", "*")
            } else {
                res.header("Access-Control-Allow-Origin", "https://wallet.hycon.io")
            }
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
            res.header("Access-Control-Allow-Headers", "Content-type, Accept")
            res.header("X-FRAME-OPTIONS", "DENY")
            if (req.method === "OPTIONS") {
                res.status(200).end()
            } else {
                next()
            }
        })
    }

    private reactRoute(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const branches = matchRoutes(routes, req.url)
        if (userOptions.public_rest !== true && branches.length > 0) {
            logger.info("react: " + req.url)
            const context: { url?: string } = {}
            const rest = new RestClient()
            const page = indexRender(rest, req.url, context)
            if (context.url) {
                res.redirect(context.url, 301)
            } else {
                res.send(page)
            }
        } else {
            logger.debug("other: " + req.url)
            next()
        }
    }

    private routeRest() {
        const routers: IRestRouter[] = []
        routers.push(new RestV1Router(this.restV1Service, this.hyconServer))
        routers.push(new TransactionRouter(this.transactionModel))
        routers.push(new BlockRouter(this.blockModel))
        routers.push(new WalletRouter(this.walletModel))
        routers.push(new AddressRouter(this.addressModel))
        routers.push(new NetworkRouter(this.networkModel))
        this.registerRest(routers)
    }

    private config() {
        this.app.use(bodyParser.json())
    }

    private notFoundResponse(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(404)
        res.json({
            status: 404,
            timestamp: Date.now(),
            error: RESPONSE_CODE[404],
            message: "Invalid route : resource not found",
        })
    }

    private invalidJSONResponse(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        if (error.status === 400) {
            res.status(400)
            res.json({
                status: 400,
                timestamp: Date.now(),
                error: RESPONSE_CODE[400],
                message: `Invalid JSON : ${error.message}`,
            })
        }
    }

    private timeoutResponse(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.timedout) {
            next()
        } else {
            logger.error(`requested url ${req.originalUrl} timeout ${req.ips} body ${req.body} params${req.params}`)
            Responser.responseTemporaryUnavailable(res)
        }
    }

    private open(port: number) {
        if (userOptions.noGUI === true || process.env.NODE_ENV === "test") {
            return
        }
        const url = `http://localhost:${port}`
        opn(url).catch(() => {
            logger.warn(`Could not open UI, please visit ${url}`)
        })
    }

    private registerRest(restRouters: IRestRouter[]) {
        for (const restRouter of restRouters) {
            this.app.use(getAPIPath(restRouter), restRouter.getRouter())
            logger.info(`Started RESTful API ${getAPIPath(restRouter)}`)
        }
    }

    private createModels() {
        this.blockModel = new BlockModel(this.hyconServer.consensus)
        this.transactionModel = new TransactionModel(this.hyconServer.consensus, this.hyconServer)
        this.walletModel = new WalletModel(this.hyconServer.consensus)
        this.addressModel = new AddressModel(this.hyconServer.consensus, this.hyconServer.txQueue)
        this.networkModel = new NetworkModel(this.hyconServer.consensus, this.hyconServer.network.getPeerDatabase())
    }
}
