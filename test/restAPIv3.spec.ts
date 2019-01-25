process.env.NODE_ENV = "test"
import * as chai from "chai"
import chaiHttp = require("chai-http")
import spies = require("chai-spies")

chai.use(chaiHttp)
chai.use(spies)

import { hyconfromString, hycontoString } from "@glosfer/hyconjs-util"
import { randomBytes } from "crypto"
import Long = require("long")
import { HttpServer } from "../src/api/server"
import { Address } from "../src/common/address"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import { PrivateKey } from "../src/common/privateKey"
import { SignedTx } from "../src/common/txSigned"
import { Account } from "../src/consensus/database/account"
import { DBBlock } from "../src/consensus/database/dbblock"
import { DBTx } from "../src/consensus/database/dbtx"
import { Hash } from "../src/util/hash"
import { Wallet } from "../src/wallet/wallet"
import { testAsync } from "./async"

// tslint:disable:object-literal-sort-keys

const header = new BlockHeader({
    difficulty: 1.7026925092089584e-8,
    merkleRoot: Hash.decode("xyw95Bsby3s4mt6f4FmFDnFVpQBAeJxBFNGzu2cX4dM"),
    miner: new Address("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2"),
    nonce: Long.fromString("16909517390901936566", true),
    previousHash: [Hash.decode("B1pRj4eTMgW6jRpxseY7wXefuC3u5jYVUz5DLbbnFbnS")],
    stateRoot: Hash.decode("7x7xFJCno8vvcQqQpgPt2UAnWgLEXaMnbGyjpfd26qi2"),
    timeStamp: 1547435608003,
})
const tip = new DBBlock({ header, height: 587388, tEMA: 1, pEMA: 1, nextDifficulty: 1, totalWork: 1, totalSupply: hyconfromString("2982528778.23089756") })
const block = new Block({ header, txs: [] })

let functionCallCheck: string[] = []

const from = new Address("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
const to = new Address("H2EBExNn9xLpoZYZSfarHCvhufP1y63mw")
const amount = hyconfromString("0.000000001")
const fee = hyconfromString("0.000000001")
const signature = "5df6b14da7aa1331c45c45dc1f6a23c7fa99d9ff50aab3c972b49acc12c9cf552391f3855f59d25f2f4e353470ebf51a9a904e4ceae456158137c17ea61a179f"
const recovery = 0
const nonce = 130

const stx = new SignedTx({ amount, fee, from, nonce, recovery, signature: Buffer.from(signature, "hex"), to })
const hash = new Hash(stx)
const hashString = hash.toString()
const dbtx = new DBTx(hashString, "AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi", stx.to.toString(), stx.from.toString(), hycontoString(stx.amount), hycontoString(stx.fee), 1547435608003, stx.nonce)

const consensus = {
    getBlockHeight: () => 587388,
    getBlocksRange: (height: number, count: number) => {
        const result: Block[] = []
        for (let i = 0; i < count; i++) { result.push(block) }
        return result
    },
    getBlocksTip: () => {
        return {
            hash: "AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi",
            height: 587388,
            totalWork: 191213460587293.25,
        }
    },
    getBtip: () => tip,
    getHtip: () => tip,
    getMinedBlocks: (address: Address) => {
        return [{
            blockhash: "EDfjnncsPH2zktzBHp6ahkWZ51UGimZJvDVFmexB3oTH",
            feeReward: "120",
            blocktime: 1547435608003,
            miner: address.toString(),
        }]
    },
    getAccount: (address: Address) => {
        const returnAccount = new Account({ balance: hyconfromString("1000"), nonce: 129 })
        const addressString = address.toString()
        switch (addressString) {
            case "H3nHqmqsamhY9LLm87GKLuXfke6gg8QmM":
                returnAccount.balance = hyconfromString("196726271.678923263")
                break
            case "H3ynYLh9SkRCTnH59ZdU9YzrzzPVL5R1K":
                returnAccount.balance = hyconfromString("45228247.83775889")
                break
            case "H8coFUhRwbY9wKhi6GGXQ2PzooqdE52c":
                returnAccount.balance = hyconfromString("99999999.999999999")
                break
            case "H3r7mH8PVCjJF2CUj8JYu8L4umkayCC1e":
                returnAccount.balance = hyconfromString("99999999.999999999")
                break
            case "H278osmYQoWP8nnrvNypWB5YfDNk6Fuqb":
                returnAccount.balance = hyconfromString("208288908.607466758")
                break
            case "H4C2pYMHygAtSungDKmZuHhfYzjkiAdY5":
                returnAccount.balance = hyconfromString("176403978.973999909")
                break
        }
        return returnAccount
    },
    getLastTxs: (address: Address, count: number = 10) => {
        const result: DBTx[] = []
        const addressString = address.toString()
        if (addressString === "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" || addressString === "H2EBExNn9xLpoZYZSfarHCvhufP1y63mw") {
            for (let i = 0; i < count; i++) {
                result.push(dbtx)
            }
        }
        return result
    },
    getTx: (hashParam: Hash) => {
        if (hashParam.toString() === hashString) {
            return { tx: dbtx, confirmation: 10 }
        }
        return undefined
    },
    getBurnAmount: () => {
        return { amount: hyconfromString("1") }
    },
}
const txPool = {
    putTxs: () => { functionCallCheck.push("putTxs") },
    getTxs: (count: number = 10) => { // for testing, set default count value
        const result: SignedTx[] = []
        for (let i = 0; i < count; i++) {
            result.push(stx)
        }
        return result
    },
    getAllPendingAddress: (address: Address, count: number = 10) => {
        const result: SignedTx[] = []
        const addressString = address.toString()
        if (addressString === "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" || addressString === "H2EBExNn9xLpoZYZSfarHCvhufP1y63mw") {
            for (let i = 0; i < count; i++) {
                result.push(stx)
            }
        }
        return { pendings: result }
    },
    getOutPendingAddress: (address: Address, count: number = 10) => {
        const result: SignedTx[] = []
        const addressString = address.toString()
        if (addressString === "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3") {
            for (let i = 0; i < count; i++) {
                result.push(stx)
            }
        }
        return result
    },
}
const peerDatabse = {
    get: (host: string) => {
        if (host === "192.168.100.100") {
            const peer = { host, port: 8148, successOutCount: 13, successInCount: 0, lastSeen: 1547531361653, failCount: 4, lastAttempt: 1547531360650, active: 2 }
            return [peer]
        }
        return undefined
    },
    getPeers: (count: number) => {
        const result = []
        const peer = { host: "192.168.100.100", port: 8148, successOutCount: 13, successInCount: 0, lastSeen: 1547531361653, failCount: 4, lastAttempt: 1547531360650, active: 2 }
        for (let i = 0; i < count; i++) {
            result.push(peer)
        }
        return result
    },
}
const network = { getPeerDatabase: () => peerDatabse }
const server: any = {
    consensus,
    network,
    txPool,
}
const restManager: any = {
    consensus,
    network,
    server,
    txQueue: txPool,
    broadcastTxs: () => { functionCallCheck.push("broadcastTxs") },
}

const httpServer: HttpServer = new HttpServer(restManager, 2443)
describe("REST API V3 Route test(rootPath : block)", () => {
    // api/v3/block/tip
    it("/api/v3/block/tip => Get block tip through API Route", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/tip")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.blockTip).not.toBeUndefined()
                expect(res.body.headerTip).not.toBeUndefined()
                expect(res.body.blockTip.height).toBe(587388)
                expect(res.body.headerTip.height).toBe(587388)
                expect(res.body.error).toBeUndefined()
            })
    })))

    // api/v3/block/mined
    it("/api/v3/block/mined => Get mined information through API Route (query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/mined")
            .query({ address: "H4592ZGLK7GkotC51MoWssVpTog8E8GhC" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.hash).toBe("EDfjnncsPH2zktzBHp6ahkWZ51UGimZJvDVFmexB3oTH")
                expect(res.body.reward).toBe("120")
                expect(res.body.timestamp).toBe(1547435608003)
                expect(res.body.miner).toBe("H4592ZGLK7GkotC51MoWssVpTog8E8GhC")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block/mined => If address is undefined, return ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/mined")
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/block/mined => If count is invalid, return ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/mined")
            .query({ address: "H4592ZGLK7GkotC51MoWssVpTog8E8GhC", count: "invalidCount" })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/block/mined => If count is invalid, return ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/mined")
            .query({ address: "H4592ZGLK7GkotC51MoWssVpTog8E8GhC", count: 0 })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/block/mined => Get mined information through API Route (url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/mined/H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.hash).toBe("EDfjnncsPH2zktzBHp6ahkWZ51UGimZJvDVFmexB3oTH")
                expect(res.body.reward).toBe("120")
                expect(res.body.timestamp).toBe(1547435608003)
                expect(res.body.miner).toBe("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
                expect(res.body.error).toBeUndefined()
            })
    })))

    // api/v3/block
    it("/api/v3/block => Get block information through API Route (with query hash param and without range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .query({ hash: "AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBeUndefined()
                expect(res.body.hash).toBe("AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
                expect(res.body.difficulty).toBe("1.7026925092089584e-8")
                expect(res.body.merkleRoot).toBe("xyw95Bsby3s4mt6f4FmFDnFVpQBAeJxBFNGzu2cX4dM")
                expect(res.body.stateRoot).toBe("7x7xFJCno8vvcQqQpgPt2UAnWgLEXaMnbGyjpfd26qi2")
                expect(res.body.txs.length).toBe(0)
                expect(res.body.nonce).toBe("16909517390901936566")
                expect(res.body.miner).toBe("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
                expect(res.body.uncleHash.length).toBe(0)
                expect(res.body.previousHash).toBe("B1pRj4eTMgW6jRpxseY7wXefuC3u5jYVUz5DLbbnFbnS")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get blocks information through API Route (with query hash param and with negative range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .query({ hash: "AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi", range: -2 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(2)
                expect(res.body[0].height).toBe(587387)
                expect(res.body[1].height).toBe(587388)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get blocks information through API Route (with query hash param and with pisitive range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .query({ hash: "AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi", range: 2 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(2)
                expect(res.body[0].height).toBe(587388)
                expect(res.body[1].height).toBe(587389)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => If range is invalid, return ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .query({ range: "invalidRange" })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/block => Get block information through API Route (with url hash param and without range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBeUndefined()
                expect(res.body.hash).toBe("AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
                expect(res.body.difficulty).toBe("1.7026925092089584e-8")
                expect(res.body.merkleRoot).toBe("xyw95Bsby3s4mt6f4FmFDnFVpQBAeJxBFNGzu2cX4dM")
                expect(res.body.stateRoot).toBe("7x7xFJCno8vvcQqQpgPt2UAnWgLEXaMnbGyjpfd26qi2")
                expect(res.body.txs.length).toBe(0)
                expect(res.body.nonce).toBe("16909517390901936566")
                expect(res.body.miner).toBe("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
                expect(res.body.uncleHash.length).toBe(0)
                expect(res.body.previousHash).toBe("B1pRj4eTMgW6jRpxseY7wXefuC3u5jYVUz5DLbbnFbnS")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get blocks information through API Route (with url hash param and with negative range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
            .query({ range: -2 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(2)
                expect(res.body[0].height).toBe(587387)
                expect(res.body[1].height).toBe(587388)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get blocks information through API Route (with url hash param and with pisitive range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block/AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
            .query({ range: 2 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(2)
                expect(res.body[0].height).toBe(587388)
                expect(res.body[1].height).toBe(587389)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get block information through API Route (with query height param and without range)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .query({ height: 587388 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBeUndefined()
                expect(res.body.hash).toBe("AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
                expect(res.body.difficulty).toBe("1.7026925092089584e-8")
                expect(res.body.merkleRoot).toBe("xyw95Bsby3s4mt6f4FmFDnFVpQBAeJxBFNGzu2cX4dM")
                expect(res.body.stateRoot).toBe("7x7xFJCno8vvcQqQpgPt2UAnWgLEXaMnbGyjpfd26qi2")
                expect(res.body.txs.length).toBe(0)
                expect(res.body.nonce).toBe("16909517390901936566")
                expect(res.body.miner).toBe("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
                expect(res.body.uncleHash.length).toBe(0)
                expect(res.body.previousHash).toBe("B1pRj4eTMgW6jRpxseY7wXefuC3u5jYVUz5DLbbnFbnS")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/block => Get block information through API Route (If there is no param, logic operate with tip)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/block")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBeUndefined()
                expect(res.body.hash).toBe("AsbMs7onot2aY1nxS3ceFKA2Qq3gCxXRmuMs1AuQnFNi")
                expect(res.body.difficulty).toBe("1.7026925092089584e-8")
                expect(res.body.merkleRoot).toBe("xyw95Bsby3s4mt6f4FmFDnFVpQBAeJxBFNGzu2cX4dM")
                expect(res.body.stateRoot).toBe("7x7xFJCno8vvcQqQpgPt2UAnWgLEXaMnbGyjpfd26qi2")
                expect(res.body.txs.length).toBe(0)
                expect(res.body.nonce).toBe("16909517390901936566")
                expect(res.body.miner).toBe("H4GbJYvfozUdXz9WkPDG3QLomv16D2MA2")
                expect(res.body.uncleHash.length).toBe(0)
                expect(res.body.previousHash).toBe("B1pRj4eTMgW6jRpxseY7wXefuC3u5jYVUz5DLbbnFbnS")
                expect(res.body.error).toBeUndefined()
            })
    })))
})

describe("REST API V3 Route test(rootPath : tx)", () => {
    beforeEach(() => { functionCallCheck = [] })

    // api/v3/tx/pending
    it("/api/v3/tx/pending => Get pending transactions information through API Route (without query parameter)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.count).toBe(10)
                expect(res.body.address).toBeUndefined()
                expect(res.body.totalPending).toBe("0.00000002")
                expect(res.body.pendingTxs.length).toBe(10)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (only query param with address)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.totalPending).toBe("0.00000002")
                expect(res.body.count).toBe(10)
                expect(res.body.pendingTxs.length).toBe(10)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (only url param with address)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.totalPending).toBe("0.00000002")
                expect(res.body.count).toBe(10)
                expect(res.body.pendingTxs.length).toBe(10)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (only query param with count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .query({ count: 3 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.count).toBe(3)
                expect(res.body.address).toBeUndefined()
                expect(res.body.totalPending).toBe("0.000000006")
                expect(res.body.pendingTxs.length).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (with query params that address and count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3", count: 5 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.totalPending).toBe("0.00000001")
                expect(res.body.count).toBe(5)
                expect(res.body.pendingTxs.length).toBe(5)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (with url address param and qeury param count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .query({ count: 5 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.totalPending).toBe("0.00000001")
                expect(res.body.count).toBe(5)
                expect(res.body.pendingTxs.length).toBe(5)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => Get pending transactions information through API Route (with address that not exsit pending txs info in txPool)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .query({ address: "H2XvDF9iT1VV9YztwED1fXnMnugCSGbSB" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H2XvDF9iT1VV9YztwED1fXnMnugCSGbSB")
                expect(res.body.totalPending).toBe("0")
                expect(res.body.count).toBe(0)
                expect(res.body.pendingTxs.length).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx/pending => If count is invalid, return 400", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/pending")
            .query({ count: "invalid count" })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    // api/v3/tx
    it("/api/v3/tx => If there is no param, return 400", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/tx => If count if invalid, return 400", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3", count: "invalid count" })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/tx => If count if invalid, return 400", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3", count: 0 })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transaction information through API Route (with hash query parameter)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ hash: hashString })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.amount).toBe(dbtx.amount)
                expect(res.body.blockhash).toBe(dbtx.blockhash)
                expect(res.body.blocktime).toBe(dbtx.blocktime)
                expect(res.body.confirmation).toBe(10)
                expect(res.body.fee).toBe(dbtx.fee)
                expect(res.body.from).toBe(dbtx.from)
                expect(res.body.nonce).toBe(dbtx.nonce)
                expect(res.body.to).toBe(dbtx.to)
                expect(res.body.txhash).toBe(dbtx.txhash)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transaction information through API Route (with hash url parameter)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get(`/api/v3/tx/${hashString}`)
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.amount).toBe(dbtx.amount)
                expect(res.body.blockhash).toBe(dbtx.blockhash)
                expect(res.body.blocktime).toBe(dbtx.blocktime)
                expect(res.body.confirmation).toBe(10)
                expect(res.body.fee).toBe(dbtx.fee)
                expect(res.body.from).toBe(dbtx.from)
                expect(res.body.nonce).toBe(dbtx.nonce)
                expect(res.body.to).toBe(dbtx.to)
                expect(res.body.txhash).toBe(dbtx.txhash)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transactions information through API Route (with address url parameter without count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(10)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transactions information through API Route (with address query parameter without count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(10)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transactions information through API Route (with address query parameter and count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3", count: 3 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transactions information through API Route (with address url parameter and count)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .query({ count: 3 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => Get transactions information through API Route (with address that not exist tx info)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ address: "HVVozvVQL3pwswaqHDUg7CEQXQ9TFSiD" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => If tx is not exsit in DB, return 404 NOT_FOUND", (testAsync(async () => {
        const testTx = new SignedTx({
            amount: hyconfromString("1"),
            fee: hyconfromString("1"),
            from: new Address(randomBytes(20)),
            nonce: 22,
            recovery: 1,
            signature: randomBytes(32),
            to: new Address(randomBytes(20)),
        })
        chai.request(httpServer.app)
            .get("/api/v3/tx")
            .query({ hash: new Hash(testTx).toString() })
            .end((err, res) => {
                expect(res.status).toBe(404)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    // api/v3/tx
    it("/api/v3/tx => Make outgoing tx through API router", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/tx")
            .send({ from: dbtx.from, to: dbtx.to, amount: dbtx.amount, fee: dbtx.fee, signature, recovery, nonce })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(functionCallCheck.length).toBe(2)
                // If figure out how to check toHavebeenCalled spyFunction with this, edit this part.
                expect(functionCallCheck[0]).toBe("putTxs")
                expect(functionCallCheck[1]).toBe("broadcastTxs")
                expect(res.body.txhash).toBe("7jvkN2j9UmeNpbPJS6ZGgW9j5KBh5KbDUx1X6e5edqCo")
                expect(res.body.txhash).not.toBeUndefined()
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/tx => If missing param, return 400 ResponseError (from missing case)", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/tx")
            .send({ to: dbtx.to, amount: dbtx.amount, fee: dbtx.fee, signature, recovery, nonce })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/tx => If failed to verify signedTx, return 400 ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/tx")
            .send({
                from: dbtx.from,
                to: "H34mj6QWiJhhQiaXQYjx51bhBKNqM9SMA",
                amount: dbtx.amount,
                fee: dbtx.fee,
                signature,
                recovery,
                nonce,
            })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/tx => If amount is invalid, return 400 ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/tx")
            .send({
                from: "HP45dPG9C32cF937bHVVVd4CZjMxC1GJ",
                to: "H2EBExNn9xLpoZYZSfarHCvhufP1y63mw",
                amount: hyconfromString("10000"),
                fee: hyconfromString("0.0001"),
                signature: "bfd5eb5abe544ba801a5752cc292dd2003f95e12d2ea44da2c53f7179513410e2cc862f7b43799d8e5900d39673ad66c177fb65df7129272b4fd154e934fd21b",
                recovery: 0,
                nonce: 1,
            })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))
})

describe("REST API V3 Route test(rootPath : network)", () => {
    // api/v3/network/marketcap
    it("/api/v3/network/marketcap => Get marketcap information through API Route", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/network/marketcap")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.totalSupply).toBe("2982528777.23089756")
                expect(res.body.circulatingSupply).toBe("2155881370.132748742")
                expect(res.body.error).toBeUndefined()
            })
    })))

    // api/v3/network
    it("/api/v3/network => Get peer information through API Route (with host query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/network")
            .query({ host: "192.168.100.100" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(1)
                expect(res.body[0].host).toBe("192.168.100.100")
                expect(res.body[0].port).toBe(8148)
                expect(res.body[0].successOutCount).toBe(13)
                expect(res.body[0].successInCount).toBe(0)
                expect(res.body[0].lastSeen).toBe(1547531361653)
                expect(res.body[0].failCount).toBe(4)
                expect(res.body[0].lastAttempt).toBe(1547531360650)
                expect(res.body[0].active).toBe(2)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/network => Get peer information through API Route (with host url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/network/192.168.100.100")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(1)
                expect(res.body[0].host).toBe("192.168.100.100")
                expect(res.body[0].port).toBe(8148)
                expect(res.body[0].successOutCount).toBe(13)
                expect(res.body[0].successInCount).toBe(0)
                expect(res.body[0].lastSeen).toBe(1547531361653)
                expect(res.body[0].failCount).toBe(4)
                expect(res.body[0].lastAttempt).toBe(1547531360650)
                expect(res.body[0].active).toBe(2)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/network => Get peer information through API Route (with count query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/network")
            .query({ count: 3 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/network => Get peer information through API Route (with count url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/network/3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))
})

describe("REST API V3 Route test(rootPath : address)", () => {
    // api/v3/address
    it("/api/v3/address => Get address information through API Route (with address query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/address")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/address => Get address information through API Route (with address url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/address/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))
})

describe("REST API V3 Route test(rootPath : wallet)", () => {
    const englishMnemonic = "turkey olive wealth parade cradle blood wage wealth actor regret measure forward"
    const koreanMnemonic = "본성 유행 안과 사립 나머지 도자기 자극 제삿날 버튼 불이익 아시아 교복"
    beforeAll(() => {
        chai.spy.on(Wallet, "walletList", () => {
            const list: Array<{ name: string, address: string }> = []
            list.push({ name: "test_1", address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            list.push({ name: "test_2", address: "H4592ZGLK7GkotC51MoWssVpTog8E8GhC" })
            list.push({ name: "test_3", address: "H2EBExNn9xLpoZYZSfarHCvhufP1y63mw" })
            list.push({ name: "hdWallet", address: "" })
            return { walletList: list, lenght: list.length }
        })

        chai.spy.on(Wallet, "delete", () => true)

        chai.spy.on(Wallet, "getRandomMnemonic", (language: string = "english") => {
            if (language === "english") {
                return englishMnemonic
            } else if (language === "korean") {
                return koreanMnemonic
            }
        })
        chai.spy.on(Wallet, "checkDupleName", (name: string) => {
            if (name === "test_1" || name === "test_2" || name === "test_3" || name === "hdWallet") { return true }
            return false
        })
        chai.spy.on(Wallet.prototype, "save", () => { })

        // For HDwallet
        chai.spy.on(Wallet, "generateHDWalletWithMnemonic", () => new Wallet("Extended private key"))
        chai.spy.on(Wallet.prototype, "getAddressOfHDWallet", (index: number) => {
            if (index === 0) { return new Address("H2eeTD3GtD61kmpBHuQHYKZcWFNE68iBQ") }
            return new Address("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
        })
    })
    // api/v3/wallet/list
    it("/api/v3/wallet => Get wallet list through API Route", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet/list")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.length).toBe(4)
                expect(res.body[0].name).toBe("test_1")
                expect(res.body[0].address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body[0].balance).toBe("1000")
                expect(res.body[0].nonce).toBe(129)
                expect(res.body[1].name).toBe("test_2")
                expect(res.body[1].address).toBe("H4592ZGLK7GkotC51MoWssVpTog8E8GhC")
                expect(res.body[1].balance).toBe("1000")
                expect(res.body[1].nonce).toBe(129)
                expect(res.body[2].name).toBe("test_3")
                expect(res.body[2].address).toBe("H2EBExNn9xLpoZYZSfarHCvhufP1y63mw")
                expect(res.body[2].balance).toBe("1000")
                expect(res.body[2].nonce).toBe(129)
                expect(res.body[3].name).toBe("hdWallet")
                expect(res.body[3].address).toBe("HD Wallet (use post method with {name, password, index})")
                expect(res.body[3].balance).toBe("0")
                expect(res.body[3].nonce).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    // api/v3/wallet
    it("/api/v3/wallet => Get wallet through API Route (with name query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet")
            .query({ name: "test_1" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("test_1")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Get wallet through API Route (with address query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("test_1")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Get wallet through API Route (with name url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet/test_1")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("test_1")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Get wallet through API Route (with address url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("test_1")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => If there is no param, return 400 ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .get("/api/v3/wallet")
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Delete wallet through API Rout (with name query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .delete("/api/v3/wallet")
            .query({ name: "test_1" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.success).toBe(true)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Delete wallet through API Rout (with address query param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .delete("/api/v3/wallet")
            .query({ address: "H497fHm8gbPZxaXySKpV17a7beYBF9Ut3" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.success).toBe(true)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Delete wallet through API Rout (with name url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .delete("/api/v3/wallet/test_1")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.success).toBe(true)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => Delete wallet through API Rout (with address url param)", (testAsync(async () => {
        chai.request(httpServer.app)
            .delete("/api/v3/wallet/H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.success).toBe(true)
                expect(res.body.error).toBeUndefined()
            })
    })))

    // api/v3/wallet
    it("/api/v3/wallet => If there is no name in post request body return mnemonic depends on language", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ language: "english" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.mnemonic).toBe("turkey olive wealth parade cradle blood wage wealth actor regret measure forward")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => If there is no name in post request body return mnemonic depends on language", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ language: "korean" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.mnemonic).toBe("본성 유행 안과 사립 나머지 도자기 자극 제삿날 버튼 불이익 아시아 교복")
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => If receive name param that already exsit, return 400 ResponseError", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "test_1" })
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).not.toBeUndefined()
                expect(res.body.message).not.toBeUndefined()
            })
    })))

    it("/api/v3/wallet => If receive index, password and name param that already exsit return load HDwallet info", (testAsync(async () => {
        const privateKey = new PrivateKey(Buffer.from("93faeb83d13ee007d0cfbd18185971918bb688663ac39796127ccfb5a13b2a3e", "hex"))
        const wallet = new Wallet(privateKey)
        chai.spy.on(Wallet, "loadHDKeys", () => [wallet])
        chai.spy.on(wallet.pubKey, "address", () => new Address("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3"))

        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "test_1", password: "password", index: 0 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("test_1")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.index).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => If receive name param that not duplicate one, then create new wallet", (testAsync(async () => {
        const privateKey = new PrivateKey(Buffer.from("93faeb83d13ee007d0cfbd18185971918bb688663ac39796127ccfb5a13b2a3e", "hex"))
        const wallet = new Wallet(privateKey)
        chai.spy.on(Wallet, "generateKeyWithMnemonic", () => wallet)
        chai.spy.on(wallet.pubKey, "address", () => new Address("H2eeTD3GtD61kmpBHuQHYKZcWFNE68iBQ"))
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "newWalletName" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("newWalletName")
                expect(res.body.address).toBe("H2eeTD3GtD61kmpBHuQHYKZcWFNE68iBQ")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.mnemonic).toBe(englishMnemonic)
                expect(res.body.index).toBeUndefined()
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => When create wallet, give HD param, create HD wallet (with default index 0)", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "newWalletName", HD: true })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("newWalletName")
                expect(res.body.address).toBe("H2eeTD3GtD61kmpBHuQHYKZcWFNE68iBQ")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.mnemonic).toBe(englishMnemonic)
                expect(res.body.index).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => When create wallet, give HD param, create HD wallet (with specific index)", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "newWalletName", HD: true, index: 1 })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("newWalletName")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.mnemonic).toBe(englishMnemonic)
                expect(res.body.index).toBe(1)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => When create wallet, give HD param, create HD wallet (with specific mnemonic)", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "newWalletName", HD: true, mnemonic: "cereal virus nature veteran clip enjoy game analyst vote cluster enrich apple" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("newWalletName")
                expect(res.body.address).toBe("H2eeTD3GtD61kmpBHuQHYKZcWFNE68iBQ")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.mnemonic).toBe("cereal virus nature veteran clip enjoy game analyst vote cluster enrich apple")
                expect(res.body.index).toBe(0)
                expect(res.body.error).toBeUndefined()
            })
    })))

    it("/api/v3/wallet => When create wallet, give HD param, create HD wallet (with specific mnemonic and index)", (testAsync(async () => {
        chai.request(httpServer.app)
            .post("/api/v3/wallet")
            .send({ name: "newWalletName", HD: true, index: 3, mnemonic: "cereal virus nature veteran clip enjoy game analyst vote cluster enrich apple" })
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.name).toBe("newWalletName")
                expect(res.body.address).toBe("H497fHm8gbPZxaXySKpV17a7beYBF9Ut3")
                expect(res.body.balance).toBe("1000")
                expect(res.body.nonce).toBe(129)
                expect(res.body.mnemonic).toBe("cereal virus nature veteran clip enjoy game analyst vote cluster enrich apple")
                expect(res.body.index).toBe(3)
                expect(res.body.error).toBeUndefined()
            })
    })))
})
