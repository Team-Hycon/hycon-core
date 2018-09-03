import { CircularProgress, Dialog, DialogContent, FormControl, Input, InputLabel, Select } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Card, MenuItem, TextField } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")
import { Redirect } from "react-router"
import { AddressBook } from "./addressBook"
import { MultipleAccountsView } from "./multipleAccountsView"
import { IHyconWallet, IRest, IWalletAddress } from "./rest"
import { hyconfromString } from "./stringUtil"
interface IMakeTransactionProps {
    rest: IRest
    walletType?: string
    address?: string
    name?: string
    selectedAccount?: string
    nonce?: number
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
            fromAddress: props.address ? props.address : "",
            initialSelected: props.selectedAccount,
            isLoading: false,
            isMultiple: true,
            minerFee: 1,
            name: props.name ? props.name : "",
            nonce: props.nonce,
            password: "",
            pendingAmount: "0",
            piggyBank: "0",
            remain_attemp: "",
            rest: props.rest,
            selectedAccount: props.selectedAccount,
            txStep: false,
            walletType: props.walletType,
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
        this.getFavorite()
        if (this.state.walletType === "ledger") {
            if (this.state.selectedAccount === undefined) { return }
            this.state.rest.getLedgerWallet(Number(this.state.selectedAccount), 1).then((result: IHyconWallet[] | number) => {
                if (this.mounted) {
                    if (typeof (result) !== "number") {
                        this.setState({
                            fromAddress: result[0].address,
                            name: "ledgerWallet",
                            pendingAmount: result[0].pendingAmount,
                            piggyBank: result[0].balance,
                            txStep: true,
                        })
                    } else {
                        alert(`Please check connection and launch Hycon app.`)
                        this.setState({ cancelRedirect: true })
                    }
                }
                this.state.rest.setLoading(false)
            })
        }
        if (this.state.walletType === "local") {
            this.state.rest.getWalletList().then((data: { walletList: IHyconWallet[], length: number }) => {
                if (this.mounted) {
                    for (const wallet of data.walletList) {
                        if (wallet.address !== undefined && wallet.address !== "") {
                            this.mapWallets.set(wallet.address, wallet)
                            this.setState({
                                wallets: update(this.state.wallets, { $push: [wallet] }),
                            })
                        }
                    }
                    this.setState({ txStep: true })
                }
                this.state.rest.setLoading(false)
            })
        }
        if (this.state.walletType === "hdwallet") {
            if (this.state.fromAddress === "") { alert(`Error`); this.setState({ cancelRedirect: true }) }
            this.state.rest.getAddressInfo(this.state.fromAddress).then((result: IWalletAddress) => {
                if (this.mounted) {
                    this.setState({ pendingAmount: result.pendingAmount, piggyBank: result.balance, txStep: true })
                }
                this.state.rest.setLoading(false)
            })
        }
        if (this.state.walletType === "bitbox") {
            if (this.state.fromAddress === "") { return }
            this.state.rest.getAddressInfo(this.state.fromAddress).then((result: IWalletAddress) => {
                if (this.mounted) {
                    this.setState({ name: "bitboxWallet", fromAddress: this.state.fromAddress, pendingAmount: result.pendingAmount, piggyBank: result.balance, txStep: true })
                }
                this.state.rest.setLoading(false)
            })
        }
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
        if (this.state.nonce === undefined && hyconfromString(this.state.amount).add(hyconfromString(this.state.minerFee)).greaterThan(hyconfromString(this.state.piggyBank).sub(hyconfromString(this.state.pendingAmount)))) {
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
        if (this.state.walletType === "ledger") {
            if (!confirm(`Please check the details on the Ledger wallet screen. If the details are correct, confirm the transaction on the wallet. Press ”OK” to continue.`)) {
                this.setState({ isLoading: false })
                return
            }
            this.state.rest.sendTxWithLedger(Number(this.state.selectedAccount), this.state.fromAddress, this.state.address, this.state.amount.toString(), this.state.minerFee.toString(), this.state.nonce).then((result: { res: boolean, case: number }) => {
                this.alertResult(result)
            })
        }
        if (this.state.walletType === "local") {
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
        if (this.state.walletType === "hdwallet") {
            this.state.rest.sendTxWithHDWallet({ name: this.state.name, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString(), nonce: this.state.nonce }, Number(this.state.selectedAccount))
                .then((result: { res: boolean, case?: number }) => {
                    this.alertResult(result)
                })
        }
        if (this.state.walletType === "bitbox") {
            this.state.rest.sendTxWithBitbox({ from: this.state.fromAddress, password: this.state.password, address: this.state.address, amount: this.state.amount.toString(), minerFee: this.state.minerFee.toString(), nonce: this.state.nonce }, Number(this.state.selectedAccount))
                .then((result: { res: boolean, case?: (number | { error: number, remain_attemp: string }) }) => {
                    if (typeof (result.case) === "number") {
                        this.alertResult({ res: result.res, case: result.case })
                    } else if (!result.res) {
                        this.setState({ remain_attemp: result.case.remain_attemp })
                        this.alertResult({ res: result.res, case: result.case.error })
                    } else {
                        this.alertResult({ res: result.res })
                    }
                })
        }
        event.preventDefault()
    }

    public handleCancel() {
        if (this.state.initialSelected !== undefined && this.state.initialSelected !== "") {
            this.setState({ redirect: true })
        } else {
            this.setState({ cancelRedirect: true })
        }
    }

    public selectedAccountFunction(selectedAccount: string, account: IHyconWallet) {
        this.setState({
            fromAddress: account.address,
            name: "ledgerWallet",
            pendingAmount: account.pendingAmount,
            piggyBank: account.balance,
            selectedAccount,
            txStep: true,
        })
    }

    public render() {
        let walletIndex = 0
        if (this.state.redirect) {
            if (this.state.walletType === "local" || this.state.walletType === "hdwallet") {
                return <Redirect to={`/wallet/detail/${this.state.name}`} />
            } else {
                return <Redirect to={`/address/${this.state.fromAddress}/${this.state.walletType}/${this.state.selectedAccount}`} />
            }
        }
        if (this.state.cancelRedirect) {
            return <Redirect to={`/wallet`} />
        }
        return (
            <div style={{ width: "80%", margin: "auto" }}>
                <Card>
                    <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>send</Icon>Send Transaction</h3><br />
                    {this.state.txStep ?
                        (
                            <CardContent>
                                <div style={{ textAlign: "center" }}>
                                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                                        <Button variant="raised" onClick={() => { this.setState({ dialog: true }) }} style={{ backgroundColor: "#f2d260", color: "white", float: "right", margin: "0 10px" }}>
                                            <Icon>bookmark</Icon><span style={{ marginLeft: "5px" }}>Address Book</span>
                                        </Button>
                                    </Grid>
                                    {(this.state.walletType === "local")
                                        ? (<FormControl style={{ width: "330px", marginTop: "1.5%" }}>
                                            <InputLabel style={{ top: "19px", transform: "scale(0.75) translate(0px, -28px)", color: "rgba(0, 0, 0, 0.3)", fontSize: "16px" }} htmlFor="fromAddress">From Address</InputLabel>
                                            <Select value={this.state.fromAddress} onChange={this.handleInputChange} input={<Input name="fromAddress" />}>
                                                {this.state.wallets.map((wallet: IHyconWallet) => {
                                                    return (<MenuItem key={walletIndex++} value={wallet.address}>{wallet.address}</MenuItem>)
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
                                    <TextField name="password" value={this.state.password} className={`${this.state.walletType === "ledger" ? "hide" : ""}`} floatingLabelFixed={true} style={{ marginRight: "20px", width: "330px" }} floatingLabelText="Wallet Password" type="password" autoComplete="off" onChange={(data) => { this.handlePassword(data) }} />
                                    {/* {this.state.isHint ? (<span style={{ fontSize: "12px" }}>(Password Hint: {this.state.hint})</span>) : (<Button onClick={(e) => this.showHint(e)}>Hint</Button>)} */}
                                    <br /><br />
                                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                        {(this.state.walletType !== "local" && (this.state.initialSelected === undefined || this.state.initialSelected === "") ?
                                            (<Button onClick={this.prevPage}>Previous</Button>)
                                            : (<Button onClick={this.handleCancel}>Cancel</Button>))}
                                        <Button onClick={this.handleSubmit}>Send</Button>
                                    </Grid>
                                </div>
                            </CardContent>
                        ) :
                        (
                            <CardContent>
                                <MultipleAccountsView selectFunction={(index: string, account: IHyconWallet) => { this.selectedAccountFunction(index, account) }} rest={this.state.rest} selectedAccount={this.state.selectedAccount} walletType={this.state.walletType} />
                            </CardContent>
                        )}

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
        switch (result.case) {
            case 1:
                if (this.state.walletType === "ledger") {
                    alert(`Invalid wallet from address : ${this.state.fromAddress}`)
                } else {
                    this.setState({ password: "" })
                    alert("Invalid password: Please check your password")
                }
                break
            case 2:
                alert("Invalid address: Please check 'To Address' input")
                break
            case 3:
                alert("Failed to transfer hycon")
                this.setState({ redirect: true })
                break
            case 4:
                alert(`Failed to sign with Ledger wallet. Please try again.`)
                break
            case 20:
                alert(`Can not find bitbox device.`)
                break
            case 21:
                alert(`Password information was not found.`)
                this.setState({ redirect: true })
                break
            case 22:
                alert(`Wallet information was not found.`)
                this.setState({ redirect: true })
                break
            case 23:
                if (this.state.remain_attemp !== "") {
                    alert(`Invalid password. Please try again. ${this.state.remain_attemp} attempts remain before the device is reset.`)
                } else {
                    alert(`Invalid password. Please try again.`)
                }
                this.setState({ password: "" })
                break
            case 26:
                alert(`Your Bitbox Wallet has been reset. Please make new wallet.`)
                this.setState({ redirect: true })
                break
            case 27:
                alert(`Invalid from address. Please try again.`)
                break
            case 28:
                alert(`Failed to sign with bitbox wallet. Please try again.`)
                break
            case 29:
                alert(`Due to many login attempts, the next login requires holding the touch button for 3 seconds. If the LED light is displayed on the bitbox, touch it for 3 seconds.`)
                break
            case 30:
                alert(`Failed to get accounts from bitbox wallet. Please check connection and try again.`)
                break
            case 32:
                alert(`Failed to check that wallet information is set.`)
                break
            default:
                alert("Failed to transfer hycon")
                this.setState({ redirect: true })
                break
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
            selectedAccount: "",
            txStep: false,
        })
    }
}
