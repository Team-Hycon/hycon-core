import { hycontoString } from "@glosfer/hyconjs-util"
import { Account } from "../../consensus/database/account"
export class AddressDTO {
    public static addressToDTO(address: string, account: Account) {
        const addressDTO = new AddressDTO()
        addressDTO.address = address
        if (account !== undefined) {
            addressDTO.balance = hycontoString(account.balance)
            addressDTO.nonce = account.nonce
        }
        return addressDTO
    }

    public address: string
    public balance: string
    public nonce: number

    constructor() {
        this.balance = "0"
        this.nonce = 0
    }

}
