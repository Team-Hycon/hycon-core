import { Dialog, FormControl, Input, InputLabel, Select } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Card, CircularProgress, MenuItem, TextField } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { AddressBook } from "./addressBook"
import { MultipleLedgerView } from "./multipleLedgerView"
import { IHyconWallet, IRest } from "./rest"
import { hyconfromString } from "./stringUtil"
interface IMakeTransactionProps {
    rest: IRest
    isLedger: boolean
    selectedLedger?: number
}

export class MakeTransaction extends React.Component<IMakeTransactionProps, any> {
    public mounted = false
    public mapWallets: Map<string, IHyconWallet>

    constructor(props: IMakeTransactionProps) {
        super(props)

        this.state = {
            address: "",
            amount: 0,
            cancelRedirect: false,
            dialog: false,
            favorites: [],
            fromAddress: "",
            initialSelected: props.selectedLedger,
            isLedger: props.isLedger,
            isLoading: false,
            isMultiple: true,
            isSelect: false,
            minerFee: 1,
            name: "",
            pendingAmount: "0",
            piggyBank: "0",
            rest: props.rest,
            selectedLedger: props.selectedLedger,
            txStep: false,
            wallets: [],
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.mapWallets = new Map<string, IHyconWallet>()
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        if (this.state.isLedger === true || this.state.isLedger === "true") {
            this.setState({ isLedger: true })
            if (this.state.selectedLedger !== undefined) {
                this.state.rest.getLedgerWallet(Number(this.state.selectedLedger), 1).then((result: IHyconWallet[] | number) => {
                    if (this.mounted) {
                        if (typeof (result) !== "number") {
                            this.setState({
                                fromAddress: result[0].address,
                                isLoad: true,
                                name: "ledgerWallet",
                                pendingAmount: result[0].pendingAmount,
                                piggyBank: result[0].balance,
                                txStep: true,
                            })
                        } else {
                            alert(`Please check connection and launch Hycon app.`)
                            this.setState({ isLoad: true, cancelRedirect: true })
                            window.location.reload()
                        }
                    }
                })
            }
        } else {
            this.state.rest.getWalletList().then((data: { walletList: IHyconWallet[], length: number }) => {
                for (const wallet of data.walletList) {
                    this.mapWallets.set(wallet.address, wallet)
                }
                if (this.mounted) {
                    this.setState({ wallets: data.walletList, isLedger: false, isSelect: true, txStep: true })
                }
                this.state.rest.setLoading(false)
            })
        }
        this.getFavorite()
    }

    public handlePassword(data: any) {
        this.setState({ password: data.target.value })
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        if (name === "fromAddress") {
            const wallet = this.mapWallets.get(value)
            this.setState({ name: wallet.name, fromAddress: value, piggyBank: wallet.balance, pendingAmount: wallet.pendingAmount })
        } else {
            this.setState({ [name]: value })
        }
    }

    public async handleSubmit(event: any) {
        const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/
        if (this.state.amount <= 0) {
            alert("Enter a valid transaction amount")
            return
        }
        if (this.state.amount.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            return
        }
        if (hyconfromString(this.state.amount).add(hyconfromString(this.state.minerFee)).greaterThan(hyconfromString(this.state.piggyBank).sub(hyconfromString(this.state.pendingAmount)))) {
            alert("You can't spend the money you don't have")
            return
        }
        if (hyconfromString(this.state.minerFee).compare(hyconfromString("0")) === 0) {
            alert("Enter a valid miner fee")
            return
        }
        if (this.state.fromAddress === this.state.address) {
            alert("You cannot send HYCON to yourself")
            return
        }
        if (this.state.address === "" || this.state.address === undefined) {
            alert("Enter a to address")
            return
        }
        if (this.state.name === "" || this.state.fromAddress === "") {
            alert("Please check your from account.")
            return
        }

        this.setState({ isLoading: true })

        if (this.state.isLedger === true || this.state.isLedger === "true") {
            this.state.rest.sendTxWithLedger(Number(this.state.selectedLedger), this.state.fromAddress, this.state.address, this.state.amount.toString(), this.state.minerFee.toString()).then((result: { res: boolean, case: number }) => {
                this.alertResult(result)
            })
        } else {
            const namecheck = this.mapWallets.get(this.state.fromAddress)
            if (this.state.name !== namecheck.name) {
                alert(`Please try again.`)
                return
            }
            this.state.rest.sendTx({ name: this.state.name, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString() })
                .then((result: { res: boolean, case?: number }) => {
                    this.alertResult(result)
                })
        }
        event.preventDefault()
    }

    public handleCancel(event: any) {
        if (this.state.initialSelected !== undefined && this.state.initialSelected !== "") {
            this.setState({ redirect: true })
        } else {
            this.setState({ cancelRedirect: true })
        }
    }

    public selectedLedgerFunction(selectedLedger: string, account: IHyconWallet) {
        this.setState({
            fromAddress: account.address,
            name: "ledgerWallet",
            pendingAmount: account.pendingAmount,
            piggyBank: account.balance,
            selectedLedger,
            txStep: true,
        })
    }

    public render() {
        let walletIndex = 0
        if (this.state.redirect) {
            if (this.state.isLedger === true || this.state.isLedger === "true") {
                return <Redirect to={`/address/${this.state.fromAddress}/${this.state.selectedLedger}`} />
            } else {
                return <Redirect to={`/wallet/detail/${this.state.name}`} />
            }
        }
        if (this.state.cancelRedirect) {
            return <Redirect to={`/wallet`} />
        }
        return (
            <div style={{ width: "80%", margin: "auto" }}>
                <Card>
                    <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>send</Icon>Send Transaction</h3><br />
                    <CardContent style={{ display: `${this.state.txStep ? ("none") : ("block")}` }}>
                        <MultipleLedgerView isLedgerPossibility={this.state.isLedger} selectFunction={(index: string, account: IHyconWallet) => { this.selectedLedgerFunction(index, account) }} rest={this.state.rest} selectedLedger={this.state.selectedLedger} />
                    </CardContent>
                    <CardContent style={{ display: `${this.state.txStep ? ("block") : ("none")}` }}>
                        <div style={{ textAlign: "center" }}>
                            <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                                <Button variant="raised" onClick={() => { this.setState({ dialog: true }) }} style={{ backgroundColor: "#f2d260", color: "white", float: "right", margin: "0 10px" }}>
                                    <Icon>bookmark</Icon><span style={{ marginLeft: "5px" }}>Address Book</span>
                                </Button>
                            </Grid>
                            {(this.state.isSelect)
                                ? (<FormControl style={{ width: "330px", marginTop: "1.5%" }}>
                                    <InputLabel style={{ top: "19px", transform: "scale(0.75) translate(0px, -28px)", color: "rgba(0, 0, 0, 0.3)", fontSize: "16px" }} htmlFor="fromAddress">From Address</InputLabel>
                                    <Select value={this.state.fromAddress} onChange={this.handleInputChange} input={<Input name="fromAddress" />}>
                                        {this.state.wallets.map((wallet: IHyconWallet) => {
                                            return (
                                                <MenuItem key={walletIndex++} value={wallet.address}>{wallet.address}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>)
                                : (<TextField style={{ width: "330px" }} floatingLabelFixed={true} floatingLabelText="From Address" type="text" disabled={true} value={this.state.fromAddress} />)
                            }
                            <TextField name="address" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="To Address" type="text" value={this.state.address} onChange={this.handleInputChange} />
                            <br />
                            <TextField style={{ width: "330px" }} floatingLabelFixed={true} floatingLabelText="Balance" type="text" disabled={true} value={this.state.piggyBank} />
                            <TextField style={{ marginLeft: "30px", width: "330px" }} name="amount" floatingLabelFixed={true} floatingLabelText="Amount" type="text" value={this.state.amount} max={this.state.piggyBank} onChange={this.handleInputChange} />
                            <br />
                            <TextField floatingLabelText="Pending Amount" floatingLabelFixed={true} style={{ width: "330px" }} type="text" disabled={true} value={this.state.pendingAmount} />
                            <TextField name="minerFee" floatingLabelFixed={true} style={{ marginLeft: "30px", width: "330px" }} floatingLabelText="Miner Fee" type="text" value={this.state.minerFee} onChange={this.handleInputChange} />
                            <br />
                            <TextField name="password" className={`${this.state.isLedger ? "hide" : ""}`} floatingLabelFixed={true} style={{ marginRight: "20px", width: "330px" }} floatingLabelText="Wallet Password" type="password" autoComplete="off" onChange={(data) => { this.handlePassword(data) }} />
                            {/* {this.state.isHint ? (<span style={{ fontSize: "12px" }}>(Password Hint: {this.state.hint})</span>) : (<Button onClick={(e) => this.showHint(e)}>Hint</Button>)} */}
                            <br /><br />
                            <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                {(this.state.isLedger && (this.state.initialSelected === undefined || this.state.initialSelected === "") ?
                                    (<Button onClick={this.prevPage}>Previous</Button>)
                                    : (<Button onClick={this.handleCancel}>Cancel</Button>))}
                                <Button onClick={this.handleSubmit}>Send</Button>
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

    private getFavorite() {
        this.state.rest.getFavoriteList()
            .then((data: Array<{ alias: string, address: string }>) => {
                if (this.mounted) { this.setState({ favorites: data }) }
            })
    }

    private alertResult(result: { res: boolean, case?: number }) {
        if (result.res === true) {
            alert(`A transaction of ${this.state.amount} HYCON has been submitted to ${this.state.address} with ${this.state.minerFee} HYCON as miner fees.`)
            this.setState({ redirect: true })
            return
        }
        this.setState({ isLoading: false })
        if (this.state.isLedger === true || this.state.isLedger === "true") {
            switch (result.case) {
                case 0:
                    alert(`Invalid wallet from address : ${this.state.fromAddress}`)
                    break
                case 1:
                    alert(`Invalid wallet to address : ${this.state.address}`)
                    break
                case 2:
                    alert(`Fail to load account(${this.state.fromAddress}). Please try again.`)
                    break
                case 3:
                    alert(`Fail to sign with Ledger wallet. Please try again.`)
                    break
                case 4:
                    alert(`Fail to put transaction in txPool.`)
                    this.setState({ redirect: true })
                    break
            }
        } else {
            switch (result.case) {
                case 1:
                    alert("Invalid password: Please check your password")
                    break
                case 2:
                    alert("Invalid address: Please check 'To Address' input")
                    break
                case 3:
                    alert("Fail to transfer hycon")
                    this.setState({ redirect: true })
                    break
            }
        }
    }
    private prevPage() {
        this.setState({
            address: "",
            amount: 0,
            fromAddress: "",
            minerFee: 1,
            pendingAmount: "0",
            piggyBank: "0",
            selectedLedger: "",
            txStep: false,
        })
    }
}
