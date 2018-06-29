import { DBMined } from "../src/consensus/database/dbMined"

describe("DBMined", () => {
    it("constructor() : should set property using parameters", () => {
        const dbMined = new DBMined("blockHash", "123.123", 1528786237654, "minerAddress")
        expect(dbMined.blockhash).toBe("blockHash")
        expect(dbMined.feeReward).toBe("123.123")
        expect(dbMined.blocktime).toBe(1528786237654)
        expect(dbMined.miner).toBe("minerAddress")
    })
})
