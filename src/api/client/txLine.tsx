import * as React from "react"
import { Link } from "react-router-dom"
import { IRest, ITxProp, IWalletAddress } from "./rest"
interface ITxLineProps {
    rest: IRest
    tx: ITxProp
    address?: IWalletAddress
}
interface ITxLineView {
    rest: IRest
    tx: ITxProp
    address?: IWalletAddress
}
export class TxLine extends React.Component<ITxLineProps, ITxLineView> {
    constructor(props: ITxLineProps) {
        super(props)
        this.state = { tx: props.tx, rest: props.rest, address: props.address ? props.address : undefined }
    }
    public render() {
        const date = new Date(this.state.tx.receiveTime)
        return (
            <table className="table_margined">
                <thead>
                    <tr>
                        <th colSpan={4} className="tableBorder_Header">
                            {this.state.tx.receiveTime ? (
                                <div>
                                    <Link to={`/tx/${this.state.tx.hash}`}>
                                        <span className="coloredText">{this.state.tx.hash}</span>
                                    </Link>
                                    <span className="timeStampArea">
                                        {date.toString()}
                                    </span>

                                </div>
                            ) : (
                                    <div>
                                        <span>{this.state.tx.hash}</span>
                                        <span className="timeStampArea textRed"> Pending </span>
                                    </div>
                                )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="coloredText tableDivision txAddrTd">
                            {this.state.tx.from ? (
                                <a href={`/address/${this.state.tx.from}`}>
                                    {this.state.tx.from}
                                </a>
                            ) : (
                                    <span className="NoFrom">No Inputs(Newly Generated Coins)</span>
                                )}
                        </td>
                        <td>
                            <i className="material-icons">forward</i>
                        </td>
                        <td className="coloredText tableDivision txAddrTd">
                            {this.state.tx.to ? (
                                <a href={`/address/${this.state.tx.to}`}>
                                    {this.state.tx.to}
                                </a>
                            ) : (
                                    <span className="CantDecode">
                                        Unable to decode output address
                </span>
                                )}
                        </td>
                        <td className="tableDivision amountTd">
                            {this.state.tx.amount + " HYCON"}<br />
                            {this.state.tx.fee ? (<span className="fee-font">Fee : {this.state.tx.fee} HYCON</span>) : ""}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
