import { Button, Radio } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { CircularProgress, TextField } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")
import { Redirect } from "react-router"
import { IHyconWallet, IResponseError } from "./rest"

export class MultipleAccountsView extends React.Component<any, any> {
    public mounted = false
    constructor(props: any) {
        super(props)

        this.state = {
            accounts: [],
            initialInfo: false,
            initialInfoStep: 0,
            initialSelected: props.selectedAccount ? props.selectedAccount : "",
            invalidPassword: props.invalidPassword,
            isLoad: false,
            moreLoading: false,
            name: props.name ? props.name : "",
            password: props.password ? props.password : "",
            password1: "",
            password2: "",
            redirect: false,
            remain_attemp: "",
            rest: props.rest,
            selectFunction: props.selectFunction,
            selectedAccount: "",
            startIndex: 0,
            walletType: props.walletType,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.getAccounts = this.getAccounts.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        if (this.state.walletType === "bitbox") {
            this.setState({ initialInfo: true })
            this.checkPasswordSetting()
        } else if (this.state.initialSelected === "") {
            this.getAccounts()
        }
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
        if (this.state.initialInfoStep === 0) {
            if (name === "password1") {
                if (value.length > 0 && value.length < 4) {
                    this.setState({ errorText: "The password length must be at least 4 characters." })
                } else { this.setState({ errorText: "" }) }

                if (this.state.password2 !== "") {
                    if (event.target.value === this.state.password2) {
                        this.setState({ errorText1: "" })
                    } else { this.setState({ errorText1: "Not matched with password" }) }
                }
            }
            if (name === "password2") {
                if (this.state.password1 !== "") {
                    if (event.target.value === this.state.password1) {
                        this.setState({ errorText1: "" })
                    } else { this.setState({ errorText1: "Not matched with password" }) }
                }
            }
        }
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
        if (this.state.initialInfo) {
            return (
                <div style={{ textAlign: "center" }}>
                    <div style={{ display: `${this.state.initialInfoStep === 0 ? ("block") : ("none")}` }} >
                        There is no password information set in Bitbox. Please set a new password. Be careful not to lose your password.<br />
                        <TextField style={{ marginRight: "3%" }} floatingLabelText="Password" floatingLabelFixed={true} type="password" autoComplete="off" name="password1"
                            errorText={this.state.errorText} errorStyle={{ float: "left" }} value={this.state.password1}
                            onChange={(data) => { this.handleInputChange(data) }}
                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                        />
                        <TextField floatingLabelText="Confirm Password" floatingLabelFixed={true} type="password" autoComplete="off" name="password2"
                            errorText={this.state.errorText1} errorStyle={{ float: "left" }}
                            value={this.state.password2}
                            onChange={(data) => { this.handleInputChange(data) }}
                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                        /><br /><br />
                    </div>
                    <div style={{ display: `${this.state.initialInfoStep === 1 ? ("block") : ("none")}` }} >
                        Please enter password to load wallet from bitbox.<br />
                        <TextField style={{ marginRight: "3%" }} floatingLabelText="Password" floatingLabelFixed={true} type="password" autoComplete="off" name="password1"
                            value={this.state.password1}
                            onChange={(data) => { this.handleInputChange(data) }}
                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                        /><br /><br />
                    </div>
                    <div style={{ display: `${this.state.initialInfoStep === 2 ? ("block") : ("none")}` }} >
                        Bitbox does not have wallet information. Create a new wallet. Please enter the information.<br />
                        <TextField style={{ marginRight: "3%" }} floatingLabelText="Name" floatingLabelFixed={true} name="name"
                            value={this.state.name}
                            onChange={(data) => { this.handleInputChange(data) }}
                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                        /><br /><br />
                    </div>
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="outlined" onClick={() => { this.handleNext() }} style={{ margin: "0 10px" }}>Next</Button>
                    </Grid><br />
                </div>
            )
        }
        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ overflow: "scroll", height: "19em", margin: "1%" }}>
                        <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp" style={{ width: "100%", border: "0" }}>
                            <thead>
                                <tr>
                                    <th className="mdl-data-table__cell--non-numeric"> </th>
                                    <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Index</th>
                                    <th className="mdl-data-table__cell--non-numeric">Your Address</th>
                                    <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.accounts.map((account: IHyconWallet, idx: number) => {
                                    return (
                                        <tr key={idx}>
                                            <td className="mdl-data-table__cell--non-numeric" style={{ padding: "0 0 0 0" }}>
                                                <Radio
                                                    checked={this.state.selectedAccount === String(idx)}
                                                    onChange={this.handleInputChange}
                                                    value={String(idx)}
                                                    name="selectedAccount"
                                                />
                                            </td>
                                            <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>{idx}</td>
                                            <td className="mdl-data-table__cell--non-numeric">{account.address}</td>
                                            <td className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>{account.balance} HYCON</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"} style={{ marginTop: "1%" }}>
                        <Button variant="outlined" style={{ display: `${this.state.moreLoading ? ("none") : ("block")}`, width: "100%" }} onClick={this.getAccounts}>Load More</Button>
                        <Button variant="outlined" style={{ display: `${this.state.moreLoading ? ("block") : ("none")}`, width: "100%" }} disabled ><CircularProgress size={15} /> Load More</Button>
                    </Grid>
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ marginTop: "1%" }}>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button onClick={() => { this.selectFunction() }}>Next</Button>
                    </Grid>
                </div>
            </div>
        )
    }

    private getAccounts() {
        this.setState({ moreLoading: true })
        if (this.state.walletType === "hdwallet") {
            this.state.rest.getHDWallet(this.state.name, this.state.password, this.state.startIndex, 10).then((data: IHyconWallet[] & IResponseError) => {
                if (data.error) {
                    alert(`Invalid password: Fail to decrypt key file.`)
                    this.state.invalidPassword()
                    return
                }
                this.setState({ accounts: update(this.state.accounts, { $push: data }), startIndex: this.state.startIndex + data.length, isLoad: true, moreLoading: false })
            })
        } else if (this.state.walletType === "ledger") {
            this.state.rest.getLedgerWallet(this.state.startIndex, 10).then((result: IHyconWallet[] | number) => {
                if (this.mounted) {
                    if (typeof (result) !== "number") {
                        this.setState({ isLoad: true, startIndex: this.state.startIndex + result.length })
                        this.setState({ accounts: update(this.state.accounts, { $push: result }) })
                    } else {
                        alert(`Please check connection and launch Hycon app.`)
                        this.setState({ isLoad: true, redirect: true })
                        window.location.reload()
                    }
                }
                this.setState({ moreLoading: false })
                this.state.rest.setLoading(false)
            })
        } else if (this.state.walletType === "bitbox") {
            this.state.rest.getBitboxWallet(this.state.password1, this.state.startIndex, 10).then((result: IHyconWallet[] | number) => {
                if (this.mounted) {
                    this.setState({ moreLoading: false })
                    if (typeof (result) !== "number") {
                        this.setState({ isLoad: true, startIndex: this.state.startIndex + result.length, initialInfo: false })
                        this.setState({ accounts: update(this.state.accounts, { $push: result }) })
                    } else {
                        this.handleError(result)
                    }
                }
                this.state.rest.setLoading(false)
            })
        }
    }

    private selectFunction() {
        if (this.state.selectedAccount === "") {
            alert(`Please select account to use`)
            return
        }
        this.state.selectFunction(this.state.selectedAccount, this.state.accounts[Number(this.state.selectedAccount)])
    }

    private handleCancel() {
        this.setState({ redirect: true })
    }

    private handleNext() {
        this.setState({ isLoad: false })
        switch (this.state.initialInfoStep) {
            case 0:
                if (this.state.password1 !== this.state.password2) {
                    alert(`Not matched password`)
                    this.setState({ isLoad: true })
                    return
                }
                this.state.rest.setBitboxPassword(this.state.password1).then((result: boolean | number) => {
                    this.setState({ isLoad: true })
                    if (typeof (result) === "boolean") {
                        if (result) {
                            alert(`Your password has been set.`)
                            this.setState({ initialInfoStep: 1 })
                            this.handleNext()
                        } else {
                            alert(`Failed to set password.`)
                        }
                        return
                    }
                    this.handleError(result)
                })
                break
            case 1:
                this.state.rest.checkWalletBitbox(this.state.password1).then((result: boolean | number | { error: number, remain_attemp: string }) => {
                    if (typeof (result) === "boolean") {
                        this.setState({ remain_attemp: "" })
                        if (!result) {
                            this.setState({ isLoad: true, initialInfoStep: 2 })
                        } else {
                            this.getAccounts()
                        }
                        return
                    }
                    if (typeof (result) === "number") {
                        this.handleError(result)
                        return
                    }
                    this.setState({ remain_attemp: result.remain_attemp })
                    this.handleError(result.error)
                })
                break
            case 2:
                if (this.state.name === "") { alert(`Please input name.`); return }
                this.state.rest.createBitboxWallet(this.state.name, this.state.password1).then((result: boolean | number) => {
                    if (typeof (result) === "boolean") {
                        if (!result) {
                            alert(`Failed to create new bitbox wallet`)
                            this.setState({ isLoad: true })
                        } else {
                            this.getAccounts()
                        }
                        return
                    }
                    this.handleError(result)
                })
                break
        }
    }

    private handleError(error: number) {
        this.setState({ isLoad: true })
        switch (error) {
            case 20:
                alert(`Can not find bitbox device.`)
                this.setState({ redirect: true })
                break
            case 21:
                alert(`Password information was not found.`)
                this.setState({ initialInfoStep: 0, password1: "", password2: "" })
                break
            case 22:
                alert(`Wallet information was not found.`)
                this.setState({ initialInfoStep: 2 })
                break
            case 23:
                if (this.state.remain_attemp !== "") {
                    alert(`Invalid password. Please try again. Remain attemp : ${this.state.remain_attemp}`)
                } else {
                    alert(`Invalid password. Please try again.`)
                }
                this.setState({ password1: "", password2: "" })
                break
            case 24:
                alert(`Password information already set up.`)
                this.setState({ initialInfoStep: 1, password1: "", password2: "" })
                break
            case 25:
                alert(`Wallet information already set up.`)
                this.getAccounts()
                break
            case 26:
                alert(`Too many failed access attempts. Device reset. Please set your wallet information again with bitbox.`)
                this.setState({ initialInfoStep: 0, password1: "", password2: "" })
                break
            case 29:
                alert(`Due to many login attempts, the next login requires holding the touch button for 3 seconds. If the LED light is displayed on the bitbox, touch it for 3 seconds.`)
                this.setState({ password1: "" })
                this.checkPasswordSetting()
                break
            case 30:
                alert(`Failed to get accounts from bitbox wallet. Please check connection and try again.`)
                break
            case 31:
                alert(`Failed to set wallet information to bitbox. Please try again.`)
                break
            case 32:
                alert(`Failed to check that wallet information is set.`)
                break
            case 33:
                alert(`Failed to create password.`)
                break
            case 34:
                alert(`Failed to check that password information is set.`)
                break
            case 35:
                alert(`Failed to set name of wallet.`)
                break
            default:
                alert(`Failed to connect with bitbox. Please try again.`)
                this.setState({ redirect: true })
                break
        }
    }

    private checkPasswordSetting() {
        this.setState({ isLoad: false })
        this.state.rest.checkPasswordBitbox().then((result: boolean | number) => {
            this.setState({ isLoad: true })
            if (typeof (result) === "boolean") {
                if (result) {
                    this.setState({ initialInfoStep: 1 })
                } else {
                    this.setState({ initialInfoStep: 0 })
                }
                return
            }
            this.handleError(result)
        })
    }
}
