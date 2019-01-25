import { hycontoString } from "@glosfer/hyconjs-util"
import { Account } from "../../consensus/database/account"

export interface IWalletRequestBody {
    name?: string
    mnemonic?: string
    language?: string
    HD?: boolean
    password?: string
    passphrase?: string
    index?: number
}

export class WalletDTO {
    public static walletToDTO(name: string, address: string, account?: Account, mnemonic?: string, index?: number) {
        const walletDTO = new WalletDTO()
        walletDTO.name = name
        walletDTO.address = address

        if (account) {
            walletDTO.balance = hycontoString(account.balance)
            walletDTO.nonce = account.nonce
        } else {
            walletDTO.balance = "0"
            walletDTO.nonce = 0
        }

        walletDTO.mnemonic = mnemonic
        walletDTO.index = index
        return walletDTO
    }

    public static mnemonicToDTO(mnemonic: string) {
        const walletDTO = new WalletDTO()
        walletDTO.mnemonic = mnemonic
        return walletDTO
    }

    public name: string
    public address: string
    public balance: string
    public nonce: number
    public mnemonic?: string
    public index?: number

    constructor() { }

}
