import * as BitBox from "@glosfer/bitbox-app-hycon"
import HDKey = require("hdkey")
import { Address } from "../common/address"
import { PublicKey } from "../common/publicKey"
import { Tx } from "../common/tx"
import { SignedTx } from "../common/txSigned"
import { Hash } from "../util/hash"
// tslint:disable-next-line:no-var-requires
const { hid } = require("@glosfer/bitbox-nodejs")
export enum BitboxError {
    NOTFOUND_DEVICE = 20,
    NOTFOUND_PASSWORD = 21,
    NOTFOUND_WALLET = 22,
    INVALID_PASSWORD = 23,
    PASSWORD_EXISTENCE = 24,
    WALLET_EXISTENCE = 25,
    RESET_WALLET = 26,
    INVALID_ADDRESS = 27,
    FAIL_SIGN = 28,
    MANY_LOGIN_ATTEMP = 29,
    FAIL_GETADDRESS = 30,
    FAIL_SETWALLET = 31,
    FAIL_CHECKWALLET = 32,
    FAIL_CREATEPASSWORD = 33,
    FAIL_CHECKPASSWORD = 34,
    FAIL_SET_WALLETNAME = 35,
}

export class Bitbox {
    public static getBitbox(): Bitbox {
        try {
            const hidInfo = hid.getDeviceInfo()
            if (!hidInfo) { throw BitboxError.NOTFOUND_DEVICE }
            const bitbox = new BitBox.BitBox(hidInfo.path)
            return new Bitbox(bitbox)
        } catch (e) {
            if (typeof (e) === "number") { throw e }
            throw BitboxError.NOTFOUND_DEVICE
        }
    }
    private bitbox: BitBox.BitBox

    constructor(bitbox: BitBox.BitBox) {
        this.bitbox = bitbox
    }

    public checkPasswordSetting(): boolean {
        try {
            const response = this.bitbox.ping()
            if (!this.bitbox.initialize) {
                if (response.error && response.error.code === 113) { this.close(); throw BitboxError.MANY_LOGIN_ATTEMP }
                return false
            }
            return true
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            throw BitboxError.FAIL_CHECKPASSWORD
        }
    }
    public createPassword(password: string) {
        try {
            const isSetted = this.checkPasswordSetting()
            if (isSetted) { this.close(); throw BitboxError.PASSWORD_EXISTENCE }
            this.bitbox.createPassword(password)
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            throw BitboxError.FAIL_CREATEPASSWORD
        }
    }
    public async checkWalletSetting(password: string): Promise<boolean> {
        try {
            const isSetted = this.checkPasswordSetting()
            if (!isSetted) { this.close(); throw BitboxError.NOTFOUND_PASSWORD }
            this.bitbox.setPassword(password)

            const status: BitBox.IResponseStatus = await this.bitbox.deviceInfo().catch((e: any) => {
                this.close()
                if (e.error.code === 101) { throw BitboxError.RESET_WALLET }
                if (e.error.code === 113) { throw BitboxError.MANY_LOGIN_ATTEMP }
                const remainAttemp = e.error.message.match(/\d/g).join("")
                if (remainAttemp === "0") { throw BitboxError.RESET_WALLET }
                throw { error: BitboxError.INVALID_PASSWORD, remain_attemp: remainAttemp }
            })

            if (status && !status.device.seeded) {
                return false
            }
            return true
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            if (e.remain_attemp) { throw e }
            throw BitboxError.FAIL_CHECKWALLET
        }
    }
    public async setWallet(name: string, password: string) {
        try {
            const isSetted = await this.checkWalletSetting(password)
            if (isSetted) { this.close(); throw BitboxError.WALLET_EXISTENCE }
            await this.bitbox.deleteAllWallets()
            const walletInfo: BitBox.IResponseSeed = await this.bitbox.createWallet(name)
            if (!walletInfo.seed) { this.close(); throw BitboxError.FAIL_SETWALLET }
            const nameInfo: BitBox.IResponseName = await this.bitbox.setName(name)
            if (!nameInfo.name) { this.close(); throw BitboxError.FAIL_SET_WALLETNAME }
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            throw BitboxError.FAIL_SETWALLET
        }
    }
    public async getAddress(password: string, index: number = 0, count: number = 10): Promise<Address[]> {
        try {
            const isSetted = await this.checkWalletSetting(password)
            if (!isSetted) { this.close(); throw BitboxError.NOTFOUND_WALLET }
            const addresses: Address[] = []
            for (let i = index; i < index + count; i++) {
                addresses.push((await this.getPublicKeyFromXPub(i)).address())
            }
            return addresses
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            if (e.remain_attemp) { throw e }
            throw BitboxError.FAIL_GETADDRESS
        }
    }

    public async sign(from: Address, index: number, password: string, to: Address, amount: Long, nonce: number, fee: Long): Promise<SignedTx> {
        try {
            const isSetted = await this.checkWalletSetting(password)
            if (!isSetted) { this.close(); throw BitboxError.NOTFOUND_WALLET }
            const publicKey = await this.getPublicKeyFromXPub(index)
            const address = publicKey.address()
            if (!address.equals(from)) { this.close(); throw BitboxError.INVALID_ADDRESS }
            const tx = new Tx({ from, to, amount, fee, nonce })
            const txHash = new Hash(tx)
            const response: BitBox.IResponseSign = await this.bitbox.sign(`m/44'/1397'/0'/0/${index}`, txHash.toHex())
            if (!response.sign) { this.close(); throw BitboxError.FAIL_SIGN }
            const sign = Buffer.from(response.sign[0].sig, "hex")
            const recovery = Number(response.sign[0].recid)
            const signTx = new SignedTx(tx, sign, recovery)
            return signTx
        } catch (e) {
            this.close()
            if (typeof (e) === "number") { throw e }
            if (e.remain_attemp) { throw e }
            throw BitboxError.FAIL_SIGN
        }
    }

    public close() {
        this.bitbox.close()
    }

    public reset() {
        this.bitbox.reset()
    }

    private async getPublicKeyFromXPub(index: number): Promise<PublicKey> {
        try {
            const path = `m/44'/1397'/0'/0/${index}`
            const xpub: BitBox.IResponseGetXPub = await this.bitbox.getXPub(path)
            const hdkey = HDKey.fromExtendedKey(xpub.xpub)
            const pubk = hdkey.publicKey
            return new PublicKey(pubk)
        } catch (e) {
            this.close()
            throw e
        }
    }
}
