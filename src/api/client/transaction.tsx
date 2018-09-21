import { CircularProgress } from "@material-ui/core"
import { Dialog } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Card, TextField } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { AddressBook } from "./addressBook"
import { IHyconWallet } from "./rest"
import { hyconfromString } from "./stringUtil"

export class Transaction extends React.Component<any, any> {
    public mounted = false

    constructor(props: any) {
        super(props)

        this.state = {
            address: "",
            amount: 0,
            dialog: false,
            favorites: [],
            hint: "",
            isHint: false,
            isLoading: false,
            minerFee: 1,
            name: props.name,
            nonce: props.nonce,
            password: "",
            piggyBank: "0",
            rest: props.rest,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest
            .getWalletDetail(this.state.name)
            .then((data: IHyconWallet) => {
                this.state.rest.setLoading(false)
                if (this.mounted) {
                    this.setState({ wallet: data, piggyBank: data.balance })
                }
            })
        this.state.rest
            .getFavoriteList().then((data: Array<{ alias: string, address: string }>) => {
                this.state.rest.setLoading(false)
                if (this.mounted) { this.setState({ favorites: data }) }
            })
    }

    public handlePassword(data: any) {
        this.setState({ password: data.target.value })
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        if (name === "amount") {
            this.setState({ [name]: value })

        } else if (name === "address") {
            this.setState({
                [name]: value,
            })
        } else if (name === "minerFee") {
            this.setState({ [name]: value })
        }
    }

    public async handleSubmit(event: any) {
        const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/

        if (this.state.amount.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            return
        }

        if (this.state.nonce === undefined && hyconfromString(this.state.amount).add(hyconfromString(this.state.minerFee)).greaterThan(hyconfromString(this.state.piggyBank).sub(hyconfromString(this.state.wallet.pendingAmount)))) {
            alert("You can't spend the money you don't have")
            return
        }

        if (hyconfromString(this.state.minerFee).compare(hyconfromString("0")) === 0) {
            alert("Enter a valid miner fee")
            return
        }

        if (this.state.amount <= 0) {
            alert("Enter a valid transaction amount")
            return
        }

        if (this.state.wallet.address === this.state.address) {
            alert("You cannot send HYCON to yourself")
            return
        }

        if (this.state.address === "" || this.state.address === undefined) {
            alert("Enter a to address")
            return
        }

        this.setState({ isLoading: true })
        this.state.rest.sendTx({ name: this.state.name, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString(), nonce: this.state.nonce })
            .then((result: { res: boolean, case?: number }) => {
                this.setState({ isLoading: false })
                if (result.res === true) {
                    alert(`A transaction of ${this.state.amount} HYCON has been submitted to ${this.state.address} with ${this.state.minerFee} HYCON as miner fees.`)
                    this.setState({ redirect: true })
                    return
                }
                if (result.case === 1) {
                    this.setState({ password: "" })
                    alert("Invalid password: You can see a hint about password pressing 'HINT'")
                } else if (result.case === 2) {
                    alert("Invalid address: Please check 'To Address' input")
                } else if (result.case === 3) {
                    alert("Failed to transfer hycon")
                    this.setState({ redirect: true })
                }
            })

        event.preventDefault()
    }

    public handleCancel(event: any) {
        this.setState({ redirect: true })
    }

    public render() {
        if (this.state.redirect) {
            return <Redirect to={`/wallet/detail/${this.state.name}`} />
        }
        if (this.state.wallet === undefined) { return <div></div> }
        return (
            <div style={{ width: "60%", margin: "auto" }}>
                <Card>
                    <CardContent>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ color: "grey" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>send</Icon>Send Transaction</h3><br />
                            <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                                <Button variant="raised" onClick={() => { this.setState({ dialog: true }) }} style={{ backgroundColor: "#f2d260", color: "white", float: "right", margin: "0 10px" }}>
                                    <Icon>bookmark</Icon><span style={{ marginLeft: "5px" }}>Address Book</span>
                                </Button>
                            </Grid>

                            <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"} spacing={24}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField style={{ width: "330px" }} floatingLabelText="From Address" type="text" disabled={true} value={this.state.wallet.address} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField name="address" floatingLabelFixed={true} style={{ width: "330px" }} floatingLabelText="To Address" type="text" value={this.state.address} onChange={this.handleInputChange} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField style={{ width: "330px" }} floatingLabelText="Balance" type="text" disabled={true} value={this.state.piggyBank} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField style={{ width: "330px" }} name="amount" floatingLabelFixed={true} floatingLabelText="Amount" type="text" value={this.state.amount} max={this.state.piggyBank} onChange={this.handleInputChange} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField floatingLabelText="Pending Amount" style={{ width: "330px" }} type="text" disabled={true} value={this.state.wallet.pendingAmount} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField name="minerFee" floatingLabelFixed={true} style={{ width: "330px" }} floatingLabelText="Miner Fee" type="text" value={this.state.minerFee} onChange={this.handleInputChange} /></Grid>

                                <Grid item xs zeroMinWidth />
                                <Grid item xs={8}>
                                    <TextField name="password" value={this.state.password} floatingLabelFixed={true} style={{ marginRight: "20px", width: "330px" }} floatingLabelText="Wallet Password" type="password" autoComplete="off" onChange={(data) => { this.handlePassword(data) }} />
                                    {this.state.isHint ? (<span style={{ fontSize: "12px" }}>(Password Hint: {this.state.hint})</span>) : (<Button onClick={(e) => this.showHint(e)}>Hint</Button>)}
                                </Grid>
                                <Grid item xs zeroMinWidth />
                            </Grid>

                            <br /><br />
                            <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                                <Button variant="raised" onClick={this.handleSubmit} style={{ backgroundColor: "#50aaff", color: "white", float: "right", margin: "0 10px" }}>
                                    <span style={{ marginRight: "10px" }}>Send</span><Icon>send</Icon>
                                </Button>
                                <Button variant="raised" onClick={this.handleCancel} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", float: "right" }}>
                                    <span style={{ marginRight: "5px" }}>Cancel</span><Icon>close</Icon>
                                </Button>
                            </Grid>
                        </div>
                    </CardContent>
                </Card >

                {/* ADDRESS BOOK */}
                <Dialog open={this.state.dialog} onClose={() => { this.setState({ dialog: false }) }}>
                    <AddressBook rest={this.state.rest} favorites={this.state.favorites} isWalletView={false} callback={(address: string) => { this.handleListItemClick(address) }} />
                </Dialog>

                {/* LOADING */}
                <Dialog open={this.state.isLoading} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <div style={{ textAlign: "center", margin: "1em" }}>
                        <CircularProgress style={{ marginRight: "5px" }} size={50} thickness={2} />
                    </div>
                </Dialog>

            </div >
        )
    }
    private handleListItemClick(toAddr: string) {
        this.setState({ address: toAddr, dialog: false })
    }
    private showHint(e: any) {
        this.state.rest.getHint(this.state.name).then((result: string) => {
            this.setState({ isHint: true, hint: result })
        })
        e.preventDefault()
    }
}
