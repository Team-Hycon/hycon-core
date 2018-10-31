import { Menu, MenuItem } from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { IBlock, IResponseError, IRest } from "./rest"
interface IBlockLineView {
    anchorEl: null
    block: IBlock
    dialogUncleList: boolean
    rest: IRest
    age?: IAge
}
interface IAge {
    diffDate: number
    diffHour: number
    diffMin: number
    diffSec: number
}
export class BlockLine extends React.Component<any, any> {
    public mounted: boolean = false
    public intervalId: any // NodeJS.Timer
    constructor(props: IBlockLineView) {
        super(props)
        this.state = {
            anchorEl: null,
            block: props.block,
            dialogUncleList: false,
            rest: props.rest,
            uncles: [],
        }
    }
    public componentWillMount() {
        this.getDiffDate()
    }
    public componentDidMount() {
        this.intervalId = setInterval(() => {
            this.getDiffDate()
        }, 1000)
        this.mounted = true
        this.state.rest.setLoading(true)
        if (this.state.block.prevBlock.length > 1) {
            this.state.rest.getBlock(this.state.block.hash)
                .then((data: IBlock & IResponseError) => {
                    this.state.rest.setLoading(false)
                    if (this.mounted) {
                        this.setState({
                            uncles: data.prevBlock.split(",").slice(1),
                        })
                    }
                })
                .catch((e: Error) => {
                    alert(e)
                })
        }
    }
    public componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    public formatNumber(num: string) {
        const arr = num.split(".")
        let result = ""
        for (let i = 0; i < arr[0].length; i++) {
            if (i % 3 === 0 && i > 0) {
                result =
                    arr[0].substring(arr[0].length - i, arr[0].length - i - 1) +
                    "," +
                    result
            } else {
                result =
                    arr[0].substring(arr[0].length - i, arr[0].length - i - 1) + result
            }
        }
        return arr.length > 1 ? result + "." + arr[1] : result
    }
    public getDiffDate() {
        let diffDateTime = Date.now() - +this.state.block.timeStamp
        const diffDate = (diffDateTime - diffDateTime % 86400000) / 86400000
        diffDateTime -= diffDate * 86400000
        const diffHour = (diffDateTime - diffDateTime % 3600000) / 3600000
        diffDateTime -= diffHour * 3600000
        const diffMin = (diffDateTime - diffDateTime % 60000) / 60000
        diffDateTime -= diffMin * 60000
        const diffSec = (diffDateTime - diffDateTime % 1000) / 1000
        const tmpBlk = this.state.block
        tmpBlk.age = { diffDate, diffHour, diffMin, diffSec }
        this.setState({ block: tmpBlk })
    }
    public render() {
        if (this.state.block.age === undefined) {
            return < div ></div >
        }
        return (
            <tr>
                <td className="mdl-data-table__cell--non-numeric">
                    <Link to={`/block/${this.state.block.hash}`}>
                        {this.state.block.height}
                    </Link>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    {this.state.block.age.diffDate > 0
                        ? this.state.block.age.diffDate + " days "
                        : ""}
                    {this.state.block.age.diffHour > 0
                        ? this.state.block.age.diffHour + " hours "
                        : ""}
                    {this.state.block.age.diffMin > 0
                        ? this.state.block.age.diffMin + " minutes"
                        : ""}
                    {this.state.block.age.diffDate === 0 && this.state.block.age.diffHour === 0 && this.state.block.age.diffMin === 0 ?
                        this.state.block.age.diffSec + " seconds" : ""}
                </td>
                <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>{this.state.block.txs.length}</td>
                <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>
                    {this.state.block.prevBlock.length > 1 ? (this.state.block.prevBlock.length - 1) : 0}
                </td>
                <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>
                    {this.formatNumber(this.state.block.txSummary)} HYCON
                    </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <a href={`/address/${this.state.block.miner}`}>
                        {this.state.block.miner}
                    </a>
                </td>
                <td className="mdl-data-table__cell--numeric">{(this.state.block.size / 1000).toPrecision(3)}</td>
            </tr>
        )
    }

    private showUncles(event: any) {
        this.setState({ anchorEl: event.currentTarget })
    }
    private handleClickEvent(event: any) {
        if (event.currentTarget.length === 0 && !event.currentTarget) {
            this.setState({ anchorEl: null })
        }
    }
}
