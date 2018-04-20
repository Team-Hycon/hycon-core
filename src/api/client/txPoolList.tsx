import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { IRest, ITxProp } from "./rest"
import { TxLine } from "./txLine"
import { TxPoolLine } from "./txPoolLine"
interface ITxListView {
    rest: IRest
    txs: ITxProp[]
}
export class TxPoolList extends React.Component<any, any> {
    public intervalId: any // NodeJS.Timer
    public mounted: boolean = false

    constructor(props: ITxListView) {
        super(props)
        this.state = { txs: [], rest: props.rest, length: 0, index: 0, totalCount: 0, totalFee: "0", totalAmount: "0" }
    }

    public componentWillUnmount() {
        this.mounted = false
        clearInterval(this.intervalId)
    }

    public componentDidMount() {
        this.mounted = true
        this.getPendingTxs(this.state.index)
        this.intervalId = setInterval(() => {
            this.getPendingTxs(this.state.index)
        }, 10000)
    }

    public getPendingTxs(index: number) {
        this.state.rest.setLoading(true)
        this.state.rest.getPendingTxs(index).then((result: { txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }) => {
            this.setState({
                txs: update(this.state.txs, { $splice: [[0, this.state.txs.length]] }),
            })
            this.setState({
                index: update(this.state.index, { $set: index }),
                length: update(this.state.length, { $set: result.length }),
                totalAmount: update(this.state.totalAmount, { $set: result.totalAmount }),
                totalCount: update(this.state.totalCount, { $set: result.totalCount }),
                totalFee: update(this.state.totalFee, { $set: result.totalFee }),
                txs: update(this.state.txs, { $push: result.txs }),
            })
            this.state.rest.setLoading(false)
        })
    }

    public render() {
        let txIndex = 0
        return (
            <div>
                <div className="contentTitle">Transactions</div>
                <table className="table_margined blockTable">
                    <thead>
                        <tr>
                            <th colSpan={2} className="tableBorder_Header tableHeader_floatLeft" >
                                Summary
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Total count</td>
                            <td>{this.state.totalCount}</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Total Amount</td>
                            <td>{this.state.totalAmount} HYCON</td>
                        </tr>
                        <tr>
                            <td className="tdSubTitle subTitle_width20">Total Fee</td>
                            <td>{this.state.totalFee} HYCON</td>
                        </tr>
                    </tbody>
                </table>
                {this.state.txs.length !== 0 ?
                    (<div>
                        <span className="seeMoreLink">
                            <ReactPaginate previousLabel={"PREV"}
                                nextLabel={"NEXT"}
                                breakLabel={<a>...</a>}
                                breakClassName={"break-me"}
                                pageCount={this.state.length}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={9}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                initialPage={this.state.index}
                                disableInitialCallback={true}
                            />
                        </span>

                        <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                            <thead>
                                <tr>
                                    <th className="mdl-data-table__cell--non-numeric">Hash</th>
                                    <th className="mdl-data-table__cell--non-numeric">From</th>
                                    <th className="mdl-data-table__cell--non-numeric">To</th>
                                    <th className="mdl-data-table__cell--non-numeric">Amount</th>
                                    <th className="mdl-data-table__cell--non-numeric">Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.txs.map((tx: ITxProp) => {
                                    return <TxPoolLine key={txIndex++} tx={tx} />
                                })}
                            </tbody>
                        </table>
                    </div>)
                    :
                    (<div></div>)
                }

            </div>
        )
    }
    private handlePageClick = (data: any) => {
        this.getPendingTxs(data.selected)
    }
}
