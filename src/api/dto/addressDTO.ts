import { hycontoString } from "@glosfer/hyconjs-util"
import { Account } from "../../consensus/database/account"
import { TxDTO } from "./txDTO"
export class AddressDTO {
    public static addressToDTO(address: string, account: Account, txdtos?: TxDTO[]) {
        const addressDTO = new AddressDTO()
        addressDTO.address = address
        if (account !== undefined) {
            addressDTO.balance = hycontoString(account.balance)
            addressDTO.nonce = account.nonce
        }
        if (txdtos !== undefined) { addressDTO.pendings = txdtos }
        return addressDTO
    }

    public address: string
    public balance: string
    public nonce: number

    public pendings?: TxDTO[]

    constructor() {
        this.balance = "0"
        this.nonce = 0
    }

}
