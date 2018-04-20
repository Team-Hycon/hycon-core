import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import GoogleMapReact from "google-map-react"
import Long = require("long")
import { Card, CircularProgress, TextField } from "material-ui"
import Dialog from "material-ui/Dialog"
import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"

export class Transaction extends React.Component<any, any> {
    public currentMinerFee = "0"
    public currentReturnedFee = 0

    public mounted = false

    constructor(props: any) {
        super(props)

        const random = this.getRandomInt(0, 150)

        this.state = {
            address: "",
            amount: 0,
            hint: "",
            isHint: false,
            isLoading: false,
            minerFee: 1,
            name: props.name,
            piggyBank: "0",
            rest: props.rest,
            visible: false,
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

    }

    public getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
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
    }

    public handlePassword(data: any) {
        this.setState({ password: data.target.value })
    }

    public handleInputChange(event: any) {
        const target = event.target
        let value = target.value
        const name = target.name

        if (name === "amount") {
            const temp: string = value
            try {
                if (temp.match("(^[0-9]*)([.]{0,1}[0-9]{0,9})$") == null) {
                    alert("Please enter a number with up to 9 decimal places")
                    return
                }
            } catch (error) {

            }
            if (hyconfromString(target.value).add(hyconfromString(this.state.minerFee)).greaterThan(hyconfromString(this.state.piggyBank).sub(hyconfromString(this.state.wallet.pendingAmount)))) {
                alert(`You can't spend the money you don't have`)
                value = 0
            }
            this.setState({ [name]: value })
            this.currentMinerFee = hycontoString(hyconfromString(this.state.piggyBank).sub(hyconfromString(target.value).sub(this.state.wallet.pendingAmount)))

        } else if (name === "address") {
            if (value === this.state.wallet.address) {
                alert(`You can not send HYCON to yourself.`)
            } else {
                this.setState({
                    [name]: value,
                })
            }
        } else if (name === "minerFee") {
            if (this.state.amount === 0 || this.state.address === "") {
                alert(`Please should enter amount and address before enter miner fee.`)
                value = ""
            } else {
                const temp: string = value
                if (temp.match("(^[0-9]*)([.]{0,1}[0-9]{0,9}$)") == null) {
                    alert("Please enter a number with up to 9 decimal places")
                    value = ""
                } else if (hyconfromString(value).greaterThan(hyconfromString(this.currentMinerFee))) {
                    alert(`You can't spend the money you don't have : ${this.currentMinerFee}`)
                    if (hyconfromString("1").greaterThan(hyconfromString(this.currentMinerFee))) {
                        value = this.currentMinerFee
                    } else { value = 1 }
                }
            }
            this.setState({ minerFee: value })
        }
    }

    public handleSubmit(event: any) {
        if (this.state.address !== "" && this.state.address !== undefined) {
            if (this.state.amount > 0) {
                if (hyconfromString(this.state.minerFee).compare(hyconfromString("0")) === 0) {
                    alert(`Enter a valid miner fee`)
                } else {
                    if (this.state.wallet.address === this.state.address) {
                        alert("You can not send HYCON to yourself.")
                    } else {
                        this.setState({ isLoading: true })
                        this.state.rest.sendTx({ name: this.state.name, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString() })
                            .then((result: { res: boolean, case?: number }) => {
                                if (result.res === true) {
                                    alert("A transaction of " + this.state.amount +
                                        "HYCON has been submitted to " + this.state.address +
                                        " with " + this.state.minerFee + "HYCON as miner fees.",
                                    )
                                    this.setState({ redirect: true })
                                } else if (result.case === 1) {
                                    alert("Invalid password: You can see a hint about password pressing 'HINT'")
                                    window.location.reload()
                                } else if (result.case === 2) {
                                    alert("Invalid address: Please check 'To Address' input")
                                    window.location.reload()
                                } else if (result.case === 3) {
                                    alert("Fail to transfer hycon")
                                    this.setState({ redirect: true })
                                }
                            })
                    }
                }
            } else {
                alert("Enter a valid transaction amount")
            }
        } else {
            alert("Enter a to address")
        }
        event.preventDefault()
    }

    public handleCancel(event: any) {
        this.setState({ redirect: true })
    }

    public roundTo(n: number) {
        const digits = 9
        const multiplicator = Math.pow(10, digits)
        n = parseFloat((n * multiplicator).toFixed(11))
        const test = Math.round(n) / multiplicator
        return +test.toFixed(digits)
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to={`/wallet/detail/${this.state.name}`} />
        }
        if (this.state.wallet === undefined) { return < div ></div > }
        return (
            <div style={{ width: "60%", margin: "auto" }}>
                <Card>
                    <CardContent>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ color: "grey" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>send</Icon>Send Transaction</h3><br />
                            <TextField style={{ width: "330px" }} floatingLabelText="From Address" type="text" disabled={true} value={this.state.wallet.address} />
                            <TextField name="address" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="To Address" type="text" value={this.state.address} onChange={this.handleInputChange} />
                            <br />
                            <TextField style={{ width: "330px" }} floatingLabelText="Balance" type="text" disabled={true} value={this.state.piggyBank} />
                            <TextField style={{ marginLeft: "30px", width: "330px" }} name="amount" floatingLabelFixed={true} floatingLabelText="Amount" type="text" value={this.state.amount} max={this.state.piggyBank} onChange={this.handleInputChange} />
                            <br />
                            <TextField floatingLabelText="Pending Amount" style={{ width: "330px" }} type="text" disabled={true} value={this.state.wallet.pendingAmount} />
                            <TextField name="minerFee" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="Miner Fee" type="text" value={this.state.minerFee} onChange={this.handleInputChange} />
                            <br />
                            <TextField name="password" floatingLabelFixed={true} style={{ marginRight: "20px", width: "330px" }} floatingLabelText="Wallet Password" type="password" autoComplete="off" onChange={(data) => { this.handlePassword(data) }} />
                            {this.state.isHint ? (<span style={{ fontSize: "12px" }}>(Password Hint: {this.state.hint})</span>) : (<Button onClick={(e) => this.showHint(e)}>Hint</Button>)}
                            <br /><br />
                            <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                                <Button variant="raised" onClick={this.handleSubmit} style={{ backgroundColor: "#50aaff", color: "white", float: "right", margin: "0 10px" }}>
                                    <span style={{ marginRight: "10px" }}>Send</span><Icon>send</Icon>
                                </Button>
                                <Button variant="raised" onClick={this.handleCancel} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", float: "right" }}>
                                    <span style={{ marginRight: "5px" }}>Cancel</span><Icon>cancel</Icon>
                                </Button>
                            </Grid>
                        </div>
                    </CardContent>
                </Card >
                <Dialog open={this.state.isLoading} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <div style={{ textAlign: "center" }}>
                        <CircularProgress style={{ marginRight: "5px" }} size={50} thickness={2} /> LOADING
                    </div>
                </Dialog>
            </div >
        )
    }
    private showHint(e: any) {
        this.state.rest.getHint(this.state.name).then((result: string) => {
            this.setState({ isHint: true, hint: result })
        })
        e.preventDefault()
    }

}
