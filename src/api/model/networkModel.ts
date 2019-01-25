
import { hycontoString, strictAdd, strictSub } from "@glosfer/hyconjs-util"
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../../common/address"
import { Consensus } from "../../consensus/consensus"
import { DBBlock } from "../../consensus/database/dbblock"
import { PeerDatabase } from "../../network/peerDatabase"
import { PeerModel } from "../../network/peerModel"
import { IResponseError } from "../interface/iRestResponse"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("NetworkModel")

export class NetworkModel {

    private consensus: Consensus
    private peerDatabase: PeerDatabase

    constructor(consensus: Consensus, peerDatabase: PeerDatabase) {
        this.consensus = consensus
        this.peerDatabase = peerDatabase
    }

    public async getPeerInfo(hostOrCount: any) {
        if (hostOrCount === undefined) {
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `should provide count or host as query param or path parameter ${hostOrCount}`)
        }

        let peers: PeerModel | PeerModel[] | IResponseError
        if (isNaN(hostOrCount)) {
            peers = await this.peerDatabase.get(String(hostOrCount))
        } else {
            const count = Number(hostOrCount)
            if (count <= 0) { return Responser.invalidParam() }
            peers = await this.peerDatabase.getPeers(count)
        }

        if (peers === undefined) {
            return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `${hostOrCount} Not Found`)
        }
        return peers
    }

    public async getMarketCap() {
        let totalAmount = Long.UZERO
        try {
            const dbBlock: DBBlock = this.consensus.getBtip()
            if (dbBlock === undefined) {
                return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `Tip information is undefined in consensus.`)
            }
            totalAmount = dbBlock.totalSupply
            const burnAmount = await this.consensus.getBurnAmount()
            totalAmount = strictSub(totalAmount, burnAmount.amount)
        } catch (e) {
            logger.warn(`FAILED to process getMarketCap() ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Internal Server Error occurs ${e}`)
        }
        const nonMarketCoins = await this.getNonMarketCoins()
        if ("error" in nonMarketCoins) {
            return nonMarketCoins
        }
        const circulatingSupply = strictSub(totalAmount, nonMarketCoins)
        return { totalSupply: hycontoString(totalAmount), circulatingSupply: hycontoString(circulatingSupply) }
    }

    private async getNonMarketCoins() {
        try {
            let coins = Long.UZERO
            const airdropAddr = await this.consensus.getAccount(new Address("H3nHqmqsamhY9LLm87GKLuXfke6gg8QmM"))
            const icoAddr = await this.consensus.getAccount(new Address("H3ynYLh9SkRCTnH59ZdU9YzrzzPVL5R1K"))
            const corpAddr = await this.consensus.getAccount(new Address("H8coFUhRwbY9wKhi6GGXQ2PzooqdE52c"))
            const teamAddr = await this.consensus.getAccount(new Address("H3r7mH8PVCjJF2CUj8JYu8L4umkayCC1e"))
            const bountyAddr = await this.consensus.getAccount(new Address("H278osmYQoWP8nnrvNypWB5YfDNk6Fuqb"))
            const developAddr = await this.consensus.getAccount(new Address("H4C2pYMHygAtSungDKmZuHhfYzjkiAdY5"))
            if (airdropAddr === undefined || icoAddr === undefined || corpAddr === undefined || teamAddr === undefined || bountyAddr === undefined || developAddr === undefined) {
                return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Failed to look up the account required to calculate circulation suppy.`)
            }
            coins = strictAdd(coins, airdropAddr.balance)
            coins = strictAdd(coins, icoAddr.balance)
            coins = strictAdd(coins, corpAddr.balance)
            coins = strictAdd(coins, teamAddr.balance)
            coins = strictAdd(coins, bountyAddr.balance)
            coins = strictAdd(coins, developAddr.balance)
            return coins
        } catch (e) {
            logger.warn(`FAILED getNonmarketCoins ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Internal Server Error occurs during getNonMarketCoins ${e}`)
        }
    }
}
