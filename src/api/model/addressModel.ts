import { getLogger } from "log4js"
import { Address } from "../../common/address"
import { TxPool } from "../../common/txPool"
import { Consensus } from "../../consensus/consensus"
import { Account } from "../../consensus/database/account"
import { AddressDTO } from "../dto/addressDTO"
import { TxDTO } from "../dto/txDTO"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("AddressModel")

export class AddressModel {
    private consensus: Consensus
    private txPool: TxPool
    constructor(consensus: Consensus, txPool: TxPool) {
        this.consensus = consensus
        this.txPool = txPool
    }

    public async getAddress(targetAddress: string) {
        try {
            if (targetAddress === undefined) { return Responser.missingParameter() }
            const address: Address = new Address(targetAddress)
            const account: Account = await this.consensus.getAccount(address)
            const { pendings, pendingAmount } = this.txPool.getAllPendingAddress(address)
            const txdtos: TxDTO[] = []
            for (const stx of pendings) {
                txdtos.push(TxDTO.txToDTO(stx))
            }
            return AddressDTO.addressToDTO(targetAddress, account, txdtos)
        } catch (e) {
            logger.warn(`Failed to getAddress : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, e.toString())
        }
    }
}
