import { Button, Radio } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { CircularProgress } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")
import { Redirect } from "react-router"
import { IHyconWallet } from "./rest"

export class MultipleLedgerView extends React.Component<any, any> {
    public mounted = false

    constructor(props: any) {
        super(props)

        this.state = {
            initialSelectedLedger: props.selectedLedger,
            isLedgerPossibility: props.isLedgerPossibility,
            isLoad: false,
            ledgerAccounts: [],
            ledgerStartIndex: 0,
            redirect: false,
            rest: props.rest,
            selectFunction: props.selectFunction,
            selectedLedger: "",
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.getLedgerAccounts = this.getLedgerAccounts.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        if (this.state.isLedgerPossibility === true || this.state.isLedgerPossibility === "true") {
            if (this.state.initialSelectedLedger === undefined || this.state.initialSelectedLedger === "") {
                this.getLedgerAccounts()
            }
        }
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
    }

    public handleCancel() {
        this.setState({ redirect: true })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to={`/wallet`} />
        }
        if (!this.state.isLoad) {
            return (
                <div style={{ textAlign: "center" }}>
                    <CircularProgress style={{ marginRight: "5px" }} size={50} thickness={2} /> LOADING
                </div>
            )
        }
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ overflow: "scroll", height: "19em", margin: "1%" }}>
                    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp" style={{ width: "100%", border: "0" }}>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric"> </th>
                                <th className="mdl-data-table__cell--non-numeric">Your Address</th>
                                <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.ledgerAccounts.map((account: IHyconWallet, idx: number) => {
                                return (
                                    <tr key={idx}>
                                        <td className="mdl-data-table__cell--non-numeric" style={{ padding: "0 0 0 0" }}>
                                            <Radio
                                                checked={this.state.selectedLedger === String(idx)}
                                                onChange={this.handleInputChange}
                                                value={String(idx)}
                                                name="selectedLedger"
                                            />
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">{account.address}</td>
                                        <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>{account.balance} HYCON</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                    <Button variant="outlined" onClick={this.getLedgerAccounts}>Load More Accounts</Button>
                </Grid>
                <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                    <Button onClick={this.handleCancel}>Cancel</Button>
                    <Button onClick={() => { this.selectFunction() }}>Next</Button>
                </Grid>
            </div>
        )
    }

    private getLedgerAccounts() {
        this.state.rest.getLedgerWallet(this.state.ledgerStartIndex, 10).then((result: IHyconWallet[] | number) => {
            if (this.mounted) {
                if (typeof (result) !== "number") {
                    this.setState({ isLoad: true, ledgerStartIndex: this.state.ledgerStartIndex + result.length })
                    this.setState({ ledgerAccounts: update(this.state.ledgerAccounts, { $push: result }) })
                } else {
                    alert(`Please check connection and launch Hycon app.`)
                    this.setState({ isLoad: true, redirect: true })
                    window.location.reload()
                }
            }
            this.state.rest.setLoading(false)
        })
    }

    private selectFunction() {
        if (this.state.selectedLedger === "") {
            alert(`Please select account to use`)
            return
        }
        this.state.selectFunction(this.state.selectedLedger, this.state.ledgerAccounts[Number(this.state.selectedLedger)])
    }
}
