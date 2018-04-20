export class DBMined {
    public blockhash: string
    public miner: string
    public feeReward: string
    public blocktime: number
    constructor(blockhash: string, feeReward: string, blocktime: number, miner: string) {
        this.blockhash = blockhash
        this.feeReward = feeReward
        this.blocktime = blocktime
        this.miner = miner
    }
}
