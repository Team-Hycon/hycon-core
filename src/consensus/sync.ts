import { getLogger } from "log4js"
import { RobustPromises } from "../common/robustPromises"
import { INetwork } from "../network/inetwork"
import { IPeer } from "../network/ipeer"
import { Hash } from "../util/hash"
import { IConsensus } from "./iconsensus"
const logger = getLogger("Sync")

export enum BlockStatus {
    Rejected = -1,
    Nothing = 0,
    Header = 1,
    Block = 2,
    MainChain = 3,
}

export interface ITip {
    hash: Hash,
    height: number,
    totalwork: number
}

export interface ICandidatePeer {
    peer: IPeer
    tip: {
        hash: Hash;
        height: number;
        totalwork: number;
    }
}

export class Sync {
    private go: boolean
    private consensus: IConsensus
    private network: INetwork
    constructor(consensus: IConsensus, network: INetwork) {
        this.consensus = consensus
        this.network = network
        this.go = false
    }

    public start(delay: number = 1000) {
        this.go = true
        setImmediate(() => this.headerSync(delay))
        setImmediate(() => this.blockSync(delay))
    }

    public stop(delay: number = 1000) {
        this.go = false
    }
    private async headerSync(delay: number = 1000) {
        try {
            const promise = new RobustPromises<ICandidatePeer>()
            for (const peer of await this.network.getPeers()) {
                promise.add(peer.getBTip().then((tip) => ({ peer, tip })).catch((e) => logger.debug(e)))
            }
            const filter = (peer: ICandidatePeer) => peer !== undefined && peer.tip !== undefined && peer.tip.totalwork > this.consensus.getHtip().totalWork
            const { peer, tip } = await promise.race(filter)
            await peer.headerSync(tip)
        } catch (e) {
            logger.debug(e)
        }
        if (this.go) {
            setTimeout(() => this.headerSync().catch((e) => logger.fatal(`??? ${e}`)), delay)
        }
    }
    private async blockSync(delay: number = 1000) {
        try {
            const promise = new RobustPromises<ICandidatePeer>()
            for (const peer of await this.network.getPeers()) {
                promise.add(peer.getBTip().then((tip) => ({ peer, tip })).catch((e) => logger.debug(e)))
            }
            const filter = (peer: ICandidatePeer) => peer !== undefined && peer.tip !== undefined && peer.tip.totalwork > this.consensus.getBtip().totalWork
            const { peer, tip } = await promise.race(filter)
            if (peer.getVersion() > 5) {
                await peer.txSync(tip)
            } else {
                await peer.blockSync(tip)
            }
        } catch (e) {
            logger.debug(e)
        }
        if (this.go) {
            setTimeout(() => this.blockSync().catch((e) => logger.fatal(`??? ${e}`)), delay)
        }
    }
}
