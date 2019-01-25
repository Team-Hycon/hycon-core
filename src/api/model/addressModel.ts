import { getLogger } from "log4js"
import { Address } from "../../common/address"
import { Consensus } from "../../consensus/consensus"
import { Account } from "../../consensus/database/account"
import { AddressDTO } from "../dto/addressDTO"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("AddressModel")

export class AddressModel {
    private consensus: Consensus
    constructor(consensus: Consensus) {
        this.consensus = consensus
    }

    public async getAddress(targetAddress: string) {
        try {
            if (targetAddress === undefined) { return Responser.missingParameter() }
            const account: Account = await this.consensus.getAccount(new Address(targetAddress))
            return AddressDTO.addressToDTO(targetAddress, account)
        } catch (e) {
            logger.warn(`Failed to getAddress : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, e.toString())
        }
    }
}
