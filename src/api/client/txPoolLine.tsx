import * as React from "react"
import { Link } from "react-router-dom"
import { IRest, ITxProp } from "./rest"
interface IBlockLineView {
    rest: IRest
    tx: ITxProp
}
export class TxPoolLine extends React.Component<any, any> {
    public mounted: boolean = false
    constructor(props: IBlockLineView) {
        super(props)
        this.state = { rest: props.rest, tx: props.tx }
    }
    public componentWillUnmount() {
        this.mounted = false
    }

    public componentDidMount() {
        this.mounted = true
    }

    public render() {
        return (
            <tr>
                <td className="mdl-data-table__cell--non-numeric">{this.state.tx.hash}</td>
                <td className="mdl-data-table__cell--non-numeric">
                    <Link to={`/address/${this.state.tx.from}`}>
                        {this.state.tx.from}
                    </Link>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <Link to={`/address/${this.state.tx.to}`}>
                        {this.state.tx.to}
                    </Link>
                </td>
                <td className="numericTd">{this.state.tx.amount} HYCON</td>
                <td className="numericTd">{this.state.tx.fee} HYCON</td>
            </tr>
        )
    }
}
