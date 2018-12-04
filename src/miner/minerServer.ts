import { getLogger } from "log4js"
import { Address } from "../common/address"
import { Block } from "../common/block"
import { BlockHeader } from "../common/blockHeader"
import { TxPool } from "../common/txPool"
import { Consensus } from "../consensus/consensus"
import { DBBlock } from "../consensus/database/dbblock"
import { WorldState } from "../consensus/database/worldState"
import { IUncleCandidate } from "../consensus/uncleManager"
import { userOptions } from "../main"
import { Network } from "../network/network"
import { Hash } from "../util/hash"
import { CpuMiner } from "./cpuMiner"
import { StratumServer } from "./stratumServer"

const logger = getLogger("Miner")

export class MinerServer {
    private txpool: TxPool
    private consensus: Consensus
    private network: Network
    private stratumServer: StratumServer
    private cpuMiner: CpuMiner
    private intervalId: NodeJS.Timer
    private worldState: WorldState

    public constructor(txpool: TxPool, worldState: WorldState, consensus: Consensus, network: Network, cpuMiners: number, stratumPort: number) {
        this.txpool = txpool
        this.worldState = worldState
        this.consensus = consensus
        this.network = network
        if (stratumPort !== undefined) {
            this.stratumServer = new StratumServer(this, stratumPort)
        }
        this.cpuMiner = new CpuMiner(this, cpuMiners)
        this.consensus.on("candidate",
            (previousDBBlock: DBBlock, previousHash: Hash, difficulty: number, minerReward: number, uncleCandidates?: IUncleCandidate[]) =>
                this.candidate(previousDBBlock, previousHash, difficulty, minerReward, uncleCandidates),
        )
    }

    public async submitBlock(block: Block) {
        this.stop()
        this.network.broadcastBlocks([block])
        await this.consensus.putBlock(block)
    }
    public stop(): void {
        this.cpuMiner.stop()
        if (this.stratumServer !== undefined) {
            this.stratumServer.stop()
        }
    }

    public getMinerInfo(): { hashRate: number, address: string, cpuCount: number } {
        return { hashRate: this.cpuMiner.hashRate(), address: userOptions.minerAddress, cpuCount: this.cpuMiner.minerCount }
    }

    public async setMinerCount(count: number) {
        this.cpuMiner.minerCount = count
        if (this.cpuMiner.minerCount > 0) {
            userOptions.cpuMiners = count
            await userOptions.setMiner()
        }
    }

    private candidate(previousDBBlock: DBBlock, previousHash: Hash, difficulty: number, minerReward: number, uncleCandidates: IUncleCandidate[] = []): void {
        if (userOptions.cpuMiners > 0 && (userOptions.minerAddress === undefined || userOptions.minerAddress === "")) {
            logger.info("Can't mine without miner address")
            return
        }

        if (!userOptions.bootstrap && ((Date.now() - previousDBBlock.header.timeStamp) > 86400000)) {
            logger.debug("Last block is more than a day old, waiting for synchronization prior to mining.")
            return
        }

        const height = previousDBBlock.height + 1
        const miner: Address = new Address(userOptions.minerAddress)
        const target = Consensus.getTarget(difficulty, height)
        logger.debug(`New Candidate Block Difficulty: 0x${previousDBBlock.nextDifficulty.toExponential()} Target: ${target.toString("hex")}`)
        clearInterval(this.intervalId)

        const previousHashes = [previousHash]
        for (const uncle of uncleCandidates) {
            previousHashes.push(uncle.hash)
        }
        if (previousHashes.length > 1) {
            logger.debug(`Mining next block with ${previousHashes.length - 1} uncle(s)`)
        }
        this.createCandidate(previousDBBlock, difficulty, target, previousHashes, miner, minerReward, uncleCandidates)
        this.intervalId = setInterval(() => this.createCandidate(previousDBBlock, difficulty, target, previousHashes, miner, minerReward, uncleCandidates), 2000)
    }

    private async createCandidate(previousDBBlock: DBBlock, difficulty: number, target: Buffer, previousHash: Hash[], miner: Address, minerReward: number, uncleCandidates?: IUncleCandidate[]) {
        const height = previousDBBlock.height + 1
        const timeStamp = Math.max(Date.now(), previousDBBlock.header.timeStamp + 50)
        const { stateTransition: { currentStateRoot }, validTxs, invalidTxs } = await this.worldState.next(previousDBBlock.header.stateRoot, miner, minerReward, undefined, height, uncleCandidates)
        this.txpool.removeTxs(invalidTxs)
        const block = new Block({
            header: new BlockHeader({
                difficulty,
                merkleRoot: Block.calculateMerkleRoot(validTxs),
                miner,
                nonce: -1,
                previousHash,
                stateRoot: currentStateRoot,
                timeStamp,
            }),
            txs: validTxs,
        })

        const prehash = block.header.preHash()
        this.cpuMiner.putWork(block, target, prehash)
        if (this.stratumServer !== undefined) { this.stratumServer.putWork(block, target, prehash, this.cpuMiner.minerCount) }
    }
}
