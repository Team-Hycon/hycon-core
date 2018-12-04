import Hycon from "@glosfer/hw-app-hycon"
import Transport from "@ledgerhq/hw-transport-node-hid"
import { getLogger } from "log4js"
import Long = require("long")
import { Address } from "../common/address"
import { Tx } from "../common/tx"
import { SignedTx } from "../common/txSigned"
import { userOptions } from "../main"
import proto = require("../serialization/proto")
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

    public static async sign(htipHeight: number, to: Address, amount: Long, nonce: number, fee: Long, index: number = 0): Promise<SignedTx> {
        try {
            const transport = await Transport.create()
            const hycon = new Hycon(transport)
            const from = await Ledger._getAddress(hycon, index)
            const tx = new Tx({ from, to, amount, fee, nonce })
            let encoding
            // 1544154600000 = Friday, December 7, 2018 12:50:00 PM GMT+09:00
            // Switch to the new method a little earlier than the fork
            if (htipHeight < userOptions.jabiruHeight - 30 && Date.now() <= 1544154600000) {
                encoding = proto.Tx.encode({ from, to, amount, fee, nonce }).finish()
            } else {
                encoding = proto.Tx.encode({ from, to, amount, fee, nonce, networkid: userOptions.networkid }).finish()
            }
            const rawTxHex = bytesToHex(encoding)
            const signed = await hycon.signTransaction(`44'/1397'/0'/0/${index}`, rawTxHex)
            const sig = new Uint8Array(hexToBytes(signed.signature))
            logger.info(`Signed transaction with Ledger / From : ${from.toString()} / raw TxHex : ${rawTxHex} / Signature : ${signed.signature}`)
            const stx = new SignedTx(tx, sig, signed.recovery)
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
