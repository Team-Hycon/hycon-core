
import { getLogger } from "log4js"
import { Address } from "../../common/address"
import { Consensus } from "../../consensus/consensus"
import { Wallet } from "../../wallet/wallet"
import { IWalletRequestBody, WalletDTO } from "../dto/walletDTO"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("WalletModel")

export class WalletModel {

    private consensus: Consensus

    constructor(consensus: Consensus) {
        this.consensus = consensus
    }

    public async getWalletList() {
        try {
            const wallets = await Wallet.walletList()
            const walletDTOs = []
            for (const wallet of wallets.walletList) {
                const targetAccount = await this._getTargetAccount(wallet)
                const walletDTO = WalletDTO.walletToDTO(wallet.name, wallet.address, targetAccount)
                walletDTOs.push(walletDTO)
            }
            return walletDTOs
        } catch (e) {
            logger.warn(`Failed getWalletList: Internal server error ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Failed getWalletList: Internal_Server_Error ${e}`)
        }
    }

    public async getWallet(nameOrAddress: string) {
        try {
            const targetWallet = await this._getWallet(nameOrAddress)
            if ("error" in targetWallet) {
                return targetWallet
            }
            const targetAccount = await this._getTargetAccount(targetWallet)

            return WalletDTO.walletToDTO(targetWallet.name, targetWallet.address, targetAccount)
        } catch (e) {
            logger.warn("FAILED getWallet :", e)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Failed to get wallet ${nameOrAddress} ${e}`)
        }
    }

    public async deleteWallet(nameOrAddress: string) {
        try {
            const targetWallet = await this._getWallet(nameOrAddress)
            if ("error" in targetWallet) {
                return targetWallet
            }

            const result = { success: false }
            if (await Wallet.delete(targetWallet.name)) {
                result.success = true
            }
            return result
        } catch (e) {
            logger.warn(`FAILED deleteWallet : ${e.stack} `)
            return Responser.makeJsonError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, `Failed to delete ${nameOrAddress}  ${e}`)
        }
    }

    public async getRandomeMnemonic(language: string = "english") {
        language = language.toLowerCase()
        return WalletDTO.mnemonicToDTO(Wallet.getRandomMnemonic(language))
    }

    public async createWallet(walletInput: IWalletRequestBody) {
        this.setDefaultInput(walletInput)

        try {
            let walletInfo
            let publicAddress
            if (walletInput.HD) {
                walletInfo = Wallet.generateHDWalletWithMnemonic(walletInput.mnemonic, walletInput.language, walletInput.passphrase)
                publicAddress = new Address(walletInfo.getAddressOfHDWallet(walletInput.index))
            } else {
                walletInfo = Wallet.generateKeyWithMnemonic(walletInput.mnemonic, walletInput.language, walletInput.passphrase)
                publicAddress = walletInfo.pubKey.address()
            }
            await walletInfo.save(walletInput.name, walletInput.password)
            const account = await this.consensus.getAccount(publicAddress)
            return WalletDTO.walletToDTO(walletInput.name, publicAddress.toString(), account, walletInput.mnemonic, walletInput.index)
        } catch (e) {
            logger.warn(`Failed to createWallet : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `Failed to createWallet. ${JSON.stringify(walletInput)} ${e}`)
        }
    }

    public async checkAndGetHDWallet(walletInput: IWalletRequestBody) {
        try {
            if (walletInput.name && await Wallet.checkDupleName(walletInput.name)) {
                if (walletInput.index !== undefined && walletInput.password !== undefined) {
                    const wallets = await Wallet.loadHDKeys(walletInput.name, walletInput.password, walletInput.index, 1)
                    const address = wallets[0].pubKey.address()
                    const account = await this.consensus.getAccount(address)
                    return WalletDTO.walletToDTO(walletInput.name, address.toString(), account, undefined, walletInput.index)
                }
                return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `${walletInput.name} is duplicated name`)
            }
        } catch (e) {
            logger.warn(`FAILED to getHDWallet ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `Wallet ${walletInput.name} is exist and it is not a HD wallet. ${JSON.stringify(walletInput)} ${e}`)
        }
    }

    private setDefaultInput(walletInput: IWalletRequestBody) {
        if (walletInput.mnemonic === undefined) {
            walletInput.mnemonic = Wallet.getRandomMnemonic(walletInput.language)
        }
        if (walletInput.password === undefined) {
            walletInput.password = ""
        }
        if (walletInput.HD && walletInput.index === undefined) {
            walletInput.index = 0
        }
        if (walletInput.name) {
            walletInput.name = String(walletInput.name)
        }
    }

    private async _getTargetAccount(targetWallet: { name: string, address: string }) {
        if (targetWallet.address) {
            return await this.consensus.getAccount(new Address(targetWallet.address))
        } else {
            targetWallet.address = "HD Wallet (use post method with {name, password, index})"
        }
    }

    private async _getWallet(nameOrAddress: string) {
        if (nameOrAddress === undefined) {
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `Parameter should be defined`)
        }

        try {
            const result = await Wallet.walletList()
            const walletInfos = result.walletList
            for (const walletInfo of walletInfos) {
                if (walletInfo.name === nameOrAddress || walletInfo.address === nameOrAddress) {
                    return walletInfo
                }
            }
        } catch (e) {
            logger.warn(`FAILED _getWallet : ${e.stack}`)
            throw e
        }
        return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, ` ${nameOrAddress} not found`)
    }
}
