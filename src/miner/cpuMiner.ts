import { getLogger } from "log4js"
import Long = require("long")
import { Block } from "../common/block"
import { DifficultyAdjuster } from "../consensus/difficultyAdjuster"
import { Hash } from "../util/hash"
import { MinerServer } from "./minerServer"
const logger = getLogger("CpuMiner")

interface IAsyncCpuMiner {
    nonce: Promise<Long>
    hashrate: () => number
    stop: () => Promise<void | number>
}

export class CpuMiner {
    public static mine(preHash: Uint8Array, difficulty: number, prefix: number, startNonce: number = 0, maxNonce: number = 0xFFFFFFFF): IAsyncCpuMiner {
        let calculate = true
        const hashrate = 0
        let currentNonce = startNonce
        const startTime = Date.now()
        let endTime: number
        const nonce = new Promise<Long>(async (resolve, reject) => {
            try {
                const buffer = Buffer.allocUnsafe(72)
                buffer.fill(preHash, 0, 64)
                buffer.writeUInt32LE(prefix, 64)
                const target = DifficultyAdjuster.getTarget(difficulty, 32)

                while (currentNonce < maxNonce && calculate) {
                    buffer.writeUInt32LE(currentNonce, 68)
                    if (DifficultyAdjuster.acceptable(await Hash.hashCryptonight(buffer), target)) {
                        const low = buffer.readInt32LE(64)
                        const high = buffer.readInt32LE(68)
                        resolve(Long.fromBits(low, high, true))
                        return
                    }
                    currentNonce++
                }
                reject(currentNonce)
            } catch (e) {
                reject(new Error(`CPU Miner failed: ${e}`))
            } finally {
                endTime = Date.now()
            }
        })

        return {
            hashrate: () => 1000 * (currentNonce - startNonce) / ((endTime ? endTime : Date.now()) - startTime),
            nonce,
            stop: async () => {
                calculate = false
                try {
                    await nonce
                    return currentNonce
                } catch (e) {
                    if (typeof e === "number" && e < 0xFFFFFFFF) {
                        return e
                    }
                }
            },
        }
    }

    public minerCount: number
    private miners: IAsyncCpuMiner[]
    private minerServer: MinerServer

    constructor(minerServer: MinerServer, minerCount: number = 0) {
        logger.debug(`CPU Miner`)
        this.minerServer = minerServer
        this.minerCount = minerCount
        this.miners = []
        setInterval(() => logger.info(`CPU Hashrate: ${this.hashRate()} H/s / CPU Count : ${this.minerCount}`), 10000)
    }

    public hashRate() {
        if (this.miners === undefined || this.miners.length === 0) {
            return 0
        }
        return Math.round(this.miners.map((m) => m.hashrate()).reduce((a, b) => a + b))
    }

    public stop() {
        const promises: Array<Promise<number | void>> = []
        for (const miner of this.miners) {
            promises.push(miner.stop())
        }
        return Promise.all(promises)
    }

    public putWork(block: Block, prehash: Uint8Array, difficulty: number) {
        this.stop()
        this.miners = []
        const hash = new Hash(block.header)
        for (let i = 0; i < this.minerCount; i++) {
            const miner = CpuMiner.mine(prehash, difficulty, i)
            miner.nonce.then((nonce) => {
                const minedBlock = new Block(block)
                minedBlock.header.nonce = nonce
                this.minerServer.submitBlock(minedBlock)
            }).catch(() => { })
            this.miners.push(miner)
        }
    }
}
