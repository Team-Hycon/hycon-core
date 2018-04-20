import Long = require("long")
import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { BlockLine } from "./blockLine"
import { IBlock, IRest } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"

interface IBlockListView {
    rest: IRest
    blocks: IBlock[]
}
export class BlockList extends React.Component<any, any> {
    public intervalId: any // NodeJS.Timer
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = { blocks: [], rest: props.rest, length: 0, index: 0 }
    }
    public componentWillUnmount() {
        this.mounted = false
        window.clearTimeout(this.intervalId)
    }

    public componentDidMount() {
        this.getRecentBlockList(this.state.index)
        this.intervalId = setInterval(() => {
            this.getRecentBlockList(this.state.index)
        }, 10000)
    }

    public getRecentBlockList(index: number) {
        this.state.rest.getBlockList(index).then((result: { blocks: IBlock[], length: number }) => {
            for (const block of result.blocks) {
                let sum = Long.fromInt(0)
                for (const tx of block.txs) {
                    sum = sum.add(hyconfromString(tx.amount))
                }
                block.txSummary = hycontoString(sum)
            }
            this.setState({
                blocks: update(
                    this.state.blocks, {
                        $splice: [[0, this.state.blocks.length]],
                    },
                ),
            })
            this.setState({
                blocks: update(
                    this.state.blocks, {
                        $push: result.blocks,
                    },
                ),
                index: update(
                    this.state.index, {
                        $set: index,
                    },
                ),
                length: update(
                    this.state.length, {
                        $set: result.length,
                    },
                ),
            })
        })
    }

    public render() {
        let blockIndex = 0
        if (this.state.blocks.length === 0) {
            return < div ></div >
        }
        return (
            <div>
                <div className="contentTitle">
                    LATEST BLOCKS
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
                </div>

                <div>
                    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Height</th>
                                <th className="mdl-data-table__cell--non-numeric">Age</th>
                                <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Transactions</th>
                                <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Total Sent</th>
                                <th className="mdl-data-table__cell--non-numeric">Relayed By</th>
                                <th className="mdl-data-table__cell--numeric">Size(kB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.blocks.reverse().map((block: IBlock) => {
                                return <BlockLine key={blockIndex++} block={block} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    private handlePageClick = (data: any) => {
        this.getRecentBlockList(data.selected)
    }
}
