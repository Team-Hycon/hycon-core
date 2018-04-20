import { randomBytes } from "crypto"
import { } from "jasmine"
import { configure } from "log4js"
import * as Long from "long"
import { Account } from "../src/consensus/database/account"
import * as proto from "../src/serialization/proto"

configure({
    appenders: {
        console: { type: "log4js-protractor-appender" },
    },
    categories: {
        default: { appenders: ["console"], level: "debug" },
    },
})
describe("Account test", () => {
    let account: Account
    let protoAccount: proto.IAccount

    beforeEach(() => {
        protoAccount = {
            balance: 10000, nonce: 0,
        }
    })

    it("constructor() : call set method when account parameter not undefined", () => {
        const setSpy = spyOn(Account.prototype, "set")
        account = new Account(protoAccount)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set() : method should set property using parameter.", () => {
        account = new Account()
        account.set(protoAccount)
        expect(account.balance).not.toBeUndefined()
        expect(account.nonce).not.toBeUndefined()
    })

    it("set() : method should throw error when balance is undefined", () => {
        account = new Account()
        function result() {
            return account.set({ nonce: 0 })
        }
        expect(result).toThrowError("Balance is missing")
    })

    it("set() : method should throw error when nonce is undefined", () => {
        account = new Account()
        function result() {
            return account.set({ balance: 1000 })
        }
        expect(result).toThrowError("Nonce is missing")
    })

    it("decode(data) : should decode Uint89Array data and return new Account object", () => {
        const setSpy = spyOn(Account.prototype, "set")
        const decodeSpy = spyOn(proto.Account, "decode").and.returnValue({ balance: 1000, nonce: 0 })
        const acct = Account.decode(randomBytes(32))
        expect(decodeSpy).toHaveBeenCalledBefore(setSpy)
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.Account, "encode").and.returnValue(encoder)
        account = new Account()
        account.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
