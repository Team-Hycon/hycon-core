import { DBTx } from "../src/consensus/database/dbtx"

describe("DBTx", () => {
    it("constructor() : should set property using parameters", () => {
        const dbtx = new DBTx("txHash", "blockHash", "toAddress", "fromAddress", "123", "0.001", 1528786237654)
        expect(dbtx.txhash).toBe("txHash")
        expect(dbtx.blockhash).toBe("blockHash")
        expect(dbtx.to).toBe("toAddress")
        expect(dbtx.from).toBe("fromAddress")
        expect(dbtx.amount).toBe("123")
        expect(dbtx.fee).toBe("0.001")
        expect(dbtx.blocktime).toBe(1528786237654)
    })
})
