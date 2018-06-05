import { ListItemText } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import GoogleMapReact from "google-map-react"
import Long = require("long")
import { Card, CircularProgress, List, ListItem, TextField } from "material-ui"
import Dialog from "material-ui/Dialog"
import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"

export class Transaction extends React.Component<any, any> {
    public errMsg1 = "Please enter a number with up to 9 decimal places"
    public errMsg2 = "You can't spend the money you don't have"
    public errMsg3 = "You can not send HYCON to yourself."
    public errMsg4 = "Please enter a number with up to 9 decimal places"
    public errMsg5 = `You can't spend the money you don't have : ${this.currentMinerFee}`
    public errMsg6 = "Enter a valid miner fee"
    public errMsg7 = "You can not send HYCON to yourself."
    public errMsg9 = "Invalid passphrase: You can see a hint about passphrase pressing 'HINT'"
    public errMsg10 = "Invalid address: Please check 'To Address' input"
    public errMsg11 = "Fail to transfer hycon"
    public errMsg12 = "Enter a valid transaction amount"
    public errMsg13 = "Enter a to address"
    public pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/

    public currentMinerFee = "0"
    public currentReturnedFee = 0

    public mounted = false

    constructor(props: any) {
        super(props)

        const random = this.getRandomInt(0, 150)

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
            piggyBank: "0",
            rest: props.rest,
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
        const target = event.target
        let value = target.value
        const name = target.name

        if (name === "amount") {
            const temp: string = value
            try {
                if (temp.match(this.pattern1) == null) {
                    alert(this.errMsg1)
                }
            } catch (error) {

            }
            if (hyconfromString(target.value).add(hyconfromString(this.state.minerFee)).greaterThan(hyconfromString(this.state.piggyBank).sub(hyconfromString(this.state.wallet.pendingAmount)))) {
                alert(this.errMsg2)
            }
            this.setState({ [name]: value })
            this.currentMinerFee = hycontoString(hyconfromString(this.state.piggyBank).sub(hyconfromString(target.value).sub(this.state.wallet.pendingAmount)))

        } else if (name === "address") {
            if (value === this.state.wallet.address) {
                alert(this.errMsg3)
            } else {
                this.setState({
                    [name]: value,
                })
            }
        } else if (name === "minerFee") {
            const temp: string = value
            if (temp.match(this.pattern1) == null) {
                alert(this.errMsg4)
                value = ""
            } else if (hyconfromString(value).greaterThan(hyconfromString(this.currentMinerFee))) {
                alert(this.errMsg5)
                if (hyconfromString("1").greaterThan(hyconfromString(this.currentMinerFee))) {
                    value = this.currentMinerFee
                } else { value = 1 }
            }
            this.setState({ minerFee: value })
        }
    }

    public handleSubmit(event: any) {
        if (this.state.address !== "" && this.state.address !== undefined) {
            if (this.state.amount > 0) {
                if (hyconfromString(this.state.minerFee).compare(hyconfromString("0")) === 0) {
                    alert(this.errMsg6)
                } else {
                    if (this.state.wallet.address === this.state.address) {
                        alert(this.errMsg7)
                    } else {
                        this.setState({ isLoading: true })
                        this.state.rest.sendTx({ name: this.state.name, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString() })
                            .then((result: { res: boolean, case?: number }) => {
                                if (result.res === true) {
                                    alert(`A transaction of ${this.state.amount} HYCON has been submitted to ${this.state.address} with ${this.state.minerFee} HYCON as miner fees.`)
                                    this.setState({ redirect: true })
                                } else if (result.case === 1) {
                                    alert(this.errMsg9)
                                    window.location.reload()
                                } else if (result.case === 2) {
                                    alert(this.errMsg10)
                                    window.location.reload()
                                } else if (result.case === 3) {
                                    alert(this.errMsg11)
                                    this.setState({ redirect: true })
                                }
                            })
                    }
                }
            } else {
                alert(this.errMsg12)
            }
        } else {
            alert(this.errMsg13)
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
    public checkListItemExist() {
        if (this.state.favorites === []) {
            this.setState({ dialog: true, noList: true })
        }
        this.setState({ dialog: true })
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
                                    <Icon>star</Icon><span style={{ marginLeft: "5px" }}>Favorites</span>
                                </Button>
                            </Grid>
                            <TextField style={{ width: "330px" }} floatingLabelText="From Address" type="text" disabled={true} value={this.state.wallet.address} />
                            <TextField name="address" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="To Address" type="text" value={this.state.address} onChange={this.handleInputChange} />
                            <br />
                            <TextField style={{ width: "330px" }} floatingLabelText="Balance" type="text" disabled={true} value={this.state.piggyBank} />
                            <TextField style={{ marginLeft: "30px", width: "330px" }} name="amount" floatingLabelFixed={true} floatingLabelText="Amount" type="text" value={this.state.amount} max={this.state.piggyBank} onChange={this.handleInputChange} />
                            <br />
                            <TextField floatingLabelText="Pending Amount" style={{ width: "330px" }} type="text" disabled={true} value={this.state.wallet.pendingAmount} />
                            <TextField name="minerFee" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="Miner Fee" type="text" value={this.state.minerFee} onChange={this.handleInputChange} />
                            <br />
                            <TextField name="password" floatingLabelFixed={true} style={{ marginRight: "20px", width: "330px" }} floatingLabelText="Wallet Passphrase" type="password" autoComplete="off" onChange={(data) => { this.handlePassword(data) }} />
                            {this.state.isHint ? (<span style={{ fontSize: "12px" }}>(Passphrase Hint: {this.state.hint})</span>) : (<Button onClick={(e) => this.showHint(e)}>Hint</Button>)}
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

                {/* FAVORITES */}
                <Dialog open={this.state.dialog}>
                    <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>star</Icon>Favorite Addresses</h3>
                    <div style={{ margin: "0 auto", width: "50%" }}>
                        {(this.state.favorites.length === 0) ? (<h5 style={{ color: "grey", textAlign: "center" }}>No favorite address</h5>) : (<div></div>)}
                        <List>
                            {this.state.favorites.map((favorite: { alias: string, address: string }) => (
                                <ListItem onClick={() => { this.handleListItemClick(favorite.address) }} key={favorite.alias}>
                                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                        <Icon style={{ color: "grey" }}>person</Icon>
                                        <ListItemText primary={favorite.alias} secondary={favorite.address} />
                                    </Grid>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                        <Button variant="raised" onClick={() => { this.setState({ dialog: false }) }} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", float: "right" }}>
                            <span style={{ marginRight: "5px" }}>Cancel</span><Icon>close</Icon>
                        </Button>
                    </Grid>
                </Dialog>

                {/* LOADING */}
                <Dialog open={this.state.isLoading} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <div style={{ textAlign: "center" }}>
                        <CircularProgress style={{ marginRight: "5px" }} size={50} thickness={2} /> LOADING
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
