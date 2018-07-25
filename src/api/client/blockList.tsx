import { Icon, IconButton, InputAdornment, TextField } from "@material-ui/core"
import Long = require("long")
import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Redirect } from "react-router-dom"
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
        this.state = {
            blocks: [],
            index: 0,
            length: 0,
            redirect: false,
            rest: props.rest,
            searchWord: undefined,
        }
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
        if (this.state.redirect) {
            return <Redirect to={`/block/${this.state.blockHash}`} />
        }
        return (
            <div>
                <div className="contentTitle">Latest Blocks</div>
                <TextField label="Search" placeholder="Block Hash"
                    onChange={(data) => this.handleBlockHash(data)}
                    onKeyPress={(event) => { if (event.key === "Enter") { this.searchBlock(event) } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={(event) => { this.searchBlock(event) }}><Icon>search</Icon></IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <div>
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
    private handleBlockHash(data: any) {
        this.setState({ blockHash: data.target.value })
    }
    private searchBlock(event: any) {
        if (this.state.blockHash === undefined) {
            event.preventDefault()
        } else if (!/^[a-zA-Z0-9]+$/.test(this.state.blockHash)) {
            event.preventDefault()
            if (alert(`Please enter a valid block hash consisting of numbers and English`)) { window.location.reload() }
        } else {
            this.setState({ redirect: true })
        }
    }
}
