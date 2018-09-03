import { Button, Dialog, DialogTitle, Grid, Icon, IconButton } from "@material-ui/core"
import * as React from "react"
import { Link, Redirect } from "react-router-dom"
import { IRest, ITxProp, IWalletAddress } from "./rest"
interface ITxLineProps {
    rest: IRest
    tx: ITxProp
    address?: string
    index?: string
    name?: string
    walletType?: string
}
interface ITxLineView {
    rest: IRest
    tx: ITxProp
    redirect?: boolean
    redirectWithHardwareWallet?: boolean
    redirectWithHDWallet?: boolean
    address?: string
    index?: string
    name?: string
    dialogPending?: boolean
    walletType?: string
}

export class TxLine extends React.Component<ITxLineProps, ITxLineView> {
    constructor(props: ITxLineProps) {
        super(props)
        this.state = { address: props.address, tx: props.tx, rest: props.rest, name: props.name, redirect: false, index: props.index, redirectWithHardwareWallet: false, redirectWithHDWallet: false, walletType: props.walletType }
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to={`/transaction/${this.state.name}/${this.state.tx.nonce}`} />
        }
        if (this.state.redirectWithHardwareWallet) {
            return <Redirect to={`/maketransactionAddress/${this.state.walletType}/${this.state.address}/${this.state.index}/${this.state.tx.nonce}`} />
        }
        if (this.state.redirectWithHDWallet) {
            return <Redirect to={`/maketransactionHDWallet/hdwallet/${this.state.name}/${this.state.address}/${this.state.index}/${this.state.tx.nonce}`} />
        }
        const date = new Date(this.state.tx.receiveTime)
        return (
            <div>
                <table className="table_margined">
                    <thead>
                        <tr>
                            <th colSpan={4} className="tableBorder_Header">
                                {this.state.tx.receiveTime
                                    ? (
                                        <div>
                                            <Link to={`/tx/${this.state.tx.hash}`}><span className="coloredText">{this.state.tx.hash}</span></Link>
                                            <span className="timeStampArea">Nonce : {this.state.tx.nonce ? this.state.tx.nonce : "-"} / Date : {date.toString()}</span>
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <span className="coloredText" style={{ color: "black" }}>{this.state.tx.hash}
                                                <IconButton style={{ width: "16px", height: "16px", marginBottom: "5px", marginLeft: "5px", display: `${this.state.name !== undefined || this.state.index !== undefined ? ("inline") : ("none")}` }} onClick={() => { this.changePendingTx() }}>
                                                    <Icon style={{ fontSize: "17px" }}>edit</Icon>
                                                </IconButton>
                                            </span>
                                            <span className="timeStampArea textRed"> Nonce : {this.state.tx.nonce} / Pending </span>
                                        </div>
                                    )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="coloredText tableDivision txAddrTd">
                                {this.state.tx.from
                                    ? (<a href={`/address/${this.state.tx.from}`}>{this.state.tx.from}</a>)
                                    : (<span className="NoFrom">No Inputs(Newly Generated Coins)</span>)}
                            </td>
                            <td>
                                <i className="material-icons">forward</i>
                            </td>
                            <td className="coloredText tableDivision txAddrTd">
                                {this.state.tx.to
                                    ? (<a href={`/address/${this.state.tx.to}`}>{this.state.tx.to}</a>)
                                    : (<span className="CantDecode">Unable to decode output address</span>)}
                            </td>
                            <td className="tableDivision amountTd">
                                {this.state.tx.amount + " HYCON"}<br />
                                {this.state.tx.fee ? (<span className="fee-font">Fee : {this.state.tx.fee} HYCON</span>) : null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Dialog open={this.state.dialogPending} onClose={() => { this.setState({ dialogPending: false }) }} style={{ width: "100%", height: "100%" }}>
                    <DialogTitle id="simple-dialog-title" style={{ textAlign: "center" }}>Attention</DialogTitle>
                    <div style={{ margin: "1em 3em" }}>
                        <div>&nbsp;The transaction in progress will be modified. Successfully modifying the transaction requires setting a higher transaction fee than the previous transaction fee. Your transaction will not change if a block containing the previous transaction is published before the modified transaction is broadcasted in the network.<br />
                            <br />&nbsp;Have you read the above and do you want to proceed?<br />
                        </div>
                        <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ marginTop: "5%" }}>
                            <Button variant="outlined" onClick={() => { this.transfer() }} >I Agree</Button>
                        </Grid>
                    </div>
                </Dialog >
            </div >
        )
    }
    private changePendingTx() {
        this.setState({ dialogPending: true })
    }

    private transfer() {
        if (this.state.walletType === undefined) {
            return
        }
        switch (this.state.walletType) {
            case "local":
                this.setState({ redirect: true })
                break
            case "hdwallet":
                this.setState({ redirectWithHDWallet: true })
                break
            default:
                this.setState({ redirectWithHardwareWallet: true })
                break

        }
    }
}
