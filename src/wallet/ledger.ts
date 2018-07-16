import Hycon from "@glosfer/hw-app-hycon"
import Transport from "@ledgerhq/hw-transport-node-hid"
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../common/address"
import { Tx } from "../common/tx"
import { SignedTx } from "../common/txSigned"
const logger = getLogger("Consensus")
function hexToBytes(hex: string) {
    const bytes = []
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16))
    }
    return bytes
}
function bytesToHex(bytes: Uint8Array) {
    const hex = []
    for (const byte of bytes) {
        // tslint:disable:no-bitwise
        hex.push((byte >>> 4).toString(16))
        hex.push((byte & 0xF).toString(16))
    }
    return hex.join("")
}

export class Ledger {
    public static async getAddresses(start: number, count: number): Promise<Address[]> {
        const transport = await Transport.create()
        const hycon = new Hycon(transport)
        const addresses = []
        const startIndex = Number(start)
        for (let index = startIndex; index < startIndex + Number(count); index++) {
            addresses.push(await Ledger._getAddress(hycon, index))
        }
        await transport.close()
        return addresses
    }

    public static async sign(to: Address, amount: Long, nonce: number, fee: Long, index: number = 0): Promise<SignedTx> {
        try {
            const transport = await Transport.create()
            const hycon = new Hycon(transport)
            const from = await Ledger._getAddress(hycon, index)
            const tx = new Tx({ from, to, amount, fee, nonce })
            const rawTxHex = bytesToHex(tx.encode())
            const signed = await hycon.signTransaction(`44'/1397'/0'/0/${index}`, rawTxHex)
            const sig = new Uint8Array(hexToBytes(signed.signature))
            logger.info(`Signed transaction with Ledger / From : ${from.toString()} / raw TxHex : ${rawTxHex} / Signature : ${signed.signature}`)
            const stx = new SignedTx(new Tx({ from, to, amount, fee, nonce }), sig, signed.recovery)
            await transport.close()
            return stx
        } catch (e) {
            logger.error(`Fail to sign with Ledger : ${e}`)
            throw e
        }
    }

    private static async _getAddress(hycon: Hycon, index: number = 0): Promise<Address> {
        return new Promise<Address>(async (resolved, rejected) => {
            hycon.getAddress(`44'/1397'/0'/0/${index}`)
                .then((result: any) => {
                    resolved(new Address(result.stringAddress))
                }).catch((e: Error) => {
                    rejected(e)
                })
        })
    }
}
