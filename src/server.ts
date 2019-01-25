import { getLogger } from "log4js"
import { HttpServer } from "./api/server"
import { TxPool } from "./common/txPool"
import { Consensus } from "./consensus/consensus"
import { WorldState } from "./consensus/database/worldState"
import { userOptions } from "./main"
import { MinerServer } from "./miner/minerServer"
import { Network } from "./network/network"
import { RestManager } from "./rest/restManager"
import { Wallet } from "./wallet/wallet"

const logger = getLogger("Server")

export class Server {
    public static subsid = 0
    public static triedSync: boolean = false
    public subscription: Map<number, any> | undefined

    public readonly consensus: Consensus
    public readonly network: Network
    public readonly miner: MinerServer

    public readonly txPool: TxPool
    public readonly rest: RestManager
    public worldState: WorldState
    public httpServer: HttpServer
    constructor() {
        const prefix = userOptions.prefix
        const postfix = userOptions.postfix
        this.txPool = new TxPool(this)
        this.worldState = new WorldState(prefix + "worldstate" + postfix, this.txPool)
        this.consensus = new Consensus(this.txPool, this.worldState, prefix + "blockdb" + postfix, prefix + "rawblock" + postfix, prefix + "txDB" + postfix, prefix + "minedDB" + postfix)
        this.network = new Network(this.txPool, this.consensus, userOptions.port, prefix + "peerdb" + postfix, userOptions.networkid)
        this.miner = new MinerServer(this.txPool, this.worldState, this.consensus, this.network, userOptions.cpuMiners, userOptions.str_port)
        this.rest = new RestManager(this)
    }
    public async run() {
        await this.consensus.init()
        logger.info("Starting server...")
        logger.debug(`API flag is ${userOptions.api}`)
        if (userOptions.api !== false) {
            logger.info(`API Port ${userOptions.api_port}`)
            this.httpServer = new HttpServer(this.rest, userOptions.api_port)
        }
        await this.network.start()
        await Wallet.walletInit()
        if (userOptions.peer) {
            for (const peer of userOptions.peer) {
                const [ip, port] = peer.split(":")
                logger.info(`Connecting to ${ip}:${port}`)
                // add peer and record the database
                this.network.addPeer(ip, Number(port)).catch((e) => logger.error(`Failed to connect to client: ${e}`))
            }
        }
    }
}
