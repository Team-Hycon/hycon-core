import * as Base58 from "base-58"
import { getLogger } from "log4js"
import * as proto from "../serialization/proto"
import { Hash } from "../util/hash"

const logger = getLogger("Address")

function checkSum(arr: Uint8Array): string {
    // Consensus Critical
    const hash = Hash.hash(arr)
    let str = Base58.encode(hash)
    str = str.slice(0, 4)
    return str
}

function toUint8Array(address: (string | Uint8Array | Buffer)): Uint8Array {
    // Consensus Critical
    if (typeof address === "string") {
        if (address.charAt(0) !== "H") {
            throw new Error(`Address is invalid. Expected address to start with 'H'`)
        }
        const check = address.slice(-4)
        address = address.slice(1, -4)
        const out: Uint8Array = Base58.decode(address)
        const expectedChecksum = checkSum(out)
        if (expectedChecksum !== check) {
            throw new Error(`Address hash invalid checksum '${check}' epected '${expectedChecksum}'`)
        }
        return out
    }
    return address
}

export class Address extends Uint8Array {
    public static isAddress(address: string): boolean {
        try {
            toUint8Array(address)
            return true
        } catch (e) {
            return false
        }
    }

    constructor(address: string | number | Uint8Array | Buffer) {
        // Consensus Critical
        typeof address === "number" ? super(address) : super(toUint8Array(address))
        // Need to allow for super constructor for number due to extension of Uint8Array
    }

    public toString(): string {
        try {
            return "H" + Base58.encode(this) + checkSum(this)
        } catch (e) {
            logger.error(e)
        }
    }

    public equals(address: Address): boolean {
        // Consensus Critical
        if (address === undefined || this.length !== address.length) { return false }
        for (let i = 0; i < address.length; i++) {
            if (this[i] !== address[i]) {
                return false
            }
        }
        return true
    }
}
