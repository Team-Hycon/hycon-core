import Long = require("long")
import * as React from "react"
import { NotFound } from "./notFound"
import { IBlock, IResponseError, IRest } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"
import { TxList } from "./txList"
interface IBlockProps {
    rest: IRest
    hash: string
    notFound: boolean
}

interface IBlockViewState {
    rest: IRest
    block?: IBlock
    hash: string
    amount?: string
    fees?: string
    volume?: string
    notFound: boolean
}
export class BlockView extends React.Component<IBlockProps, IBlockViewState> {
    public mounted: boolean = false
    constructor(props: IBlockProps) {
        super(props)
        this.state = {
            hash: props.hash,
            notFound: false,
            rest: props.rest,
        }
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getBlock(this.state.hash).then((data: IBlock & IResponseError) => {
            this.state.rest.setLoading(false)
            if (data.txs) {
                let amount = Long.fromInt(0)
                let fees = Long.fromInt(0)
                for (const tx of data.txs) {
                    amount = amount.add(hyconfromString(tx.amount))
                    if (tx.fee !== undefined) {
                        fees = fees.add(hyconfromString(tx.fee))
                    }
                }
                const volume = amount.add(fees)
                this.state.rest.setLoading(false)
                if (this.mounted) {
                    this.setState({
                        amount: hycontoString(amount),
                        block: data,
                        fees: hycontoString(fees),
                        volume: hycontoString(volume),
                    })
                }
            } else {
                this.setState({ notFound: true })
            }
        }).catch((e: Error) => {
            alert(e)
        })
    }
    public render() {
        if (this.state.notFound) {
            return <NotFound />
        }
        if (!this.state.notFound && this.state.block === undefined) {
            return <div></div>
        }
        const date = new Date(this.state.block.timeStamp)
        return (
            <div>
                <div className="contentTitle">Block #{this.state.block.height}</div>
                <table className="table_margined blockTable">
                    <thead>
                        <tr>
                            <th colSpan={2} className="tableBorder_Header tableHeader_floatLeft">Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Hash</td>
                            <td>{this.state.hash}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Previous Hash</td>
                            <td>
                                <a href={`/block/${this.state.block.prevBlock}`}>
                                    {this.state.block.prevBlock}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Merkle Root</td>
                            <td>{this.state.block.merkleRoot}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">State Root</td>
                            <td>{this.state.block.stateRoot}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Result Hash</td>
                            <td>{this.state.block.resultHash}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Difficulty</td>
                            <td>{this.state.block.difficulty}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Nonce</td>
                            <td>{this.state.block.nonce}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Miner</td>
                            <td>
                                <a href={`/address/${this.state.block.miner}`}>
                                    {this.state.block.miner}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Mined Time</td>
                            <td>{date.toString()}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Num of Txs</td>
                            <td>{this.state.block.txs.length}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Tx Volume</td>
                            <td>{this.state.volume}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Tx Transfer</td>
                            <td>{this.state.amount}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Tx Fees</td>
                            <td>{this.state.fees}</td>
                        </tr>
                    </tbody>
                </table>
                <TxList txs={this.state.block.txs} rest={this.state.rest} />
            </div>
        )
    }
}
