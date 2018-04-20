export class DBTx {
    public txhash: string
    public blockhash: string
    public to: string
    public from: string
    public amount: string
    public fee: string
    public blocktime: number
    constructor(txhash: string, blockhash: string, to: string, from: string, amount: string, fee: string, blocktime: number) {
        this.txhash = txhash
        this.blockhash = blockhash
        this.to = to
        this.from = from
        this.amount = amount
        this.fee = fee
        this.blocktime = blocktime
    }
}
