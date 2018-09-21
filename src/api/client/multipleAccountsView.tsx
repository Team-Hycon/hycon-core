import { Button, Dialog, DialogContent, DialogTitle, Radio, Step, StepLabel, Stepper } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { CircularProgress, TextField } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")
import { Redirect } from "react-router"
import { IHyconWallet, IResponseError } from "./rest"

const updateSteps = ["Enter password", "Change Bitbox password"]
export class MultipleAccountsView extends React.Component<any, any> {
    public mounted = false
    constructor(props: any) {
        super(props)

        this.state = {
            accounts: [],
            activeStep: 0,
            initialInfo: false,
            initialInfoStep: 0,
            initialSelected: props.selectedAccount ? props.selectedAccount : "",
            invalidPassword: props.invalidPassword,
            isLoad: false,
            moreLoading: false,
            name: props.name ? props.name : "",
            newPassword1: "",
            newPassword2: "",
            originalPassword: "",
            password: props.password ? props.password : "",
            password1: "",
            password2: "",
            redirect: false,
            remain_attemp: "",
            rest: props.rest,
            selectFunction: props.selectFunction,
            selectedAccount: "",
            startIndex: 0,
            updatePassword: false,
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
        if (this.state.initialInfoStep === 0 || this.state.updatePassword) {
            if (name === "password1" || name === "newPassword1") {
                const compareTarget = name === "password1" ? this.state.password2 : this.state.newPassword2
                if (value.length > 0 && value.length < 4) {
                    this.setState({ errorText: "The password length must be at least 4 characters." })
                } else { this.setState({ errorText: "" }) }

                if (compareTarget !== "") {
                    if (event.target.value === compareTarget) {
                        this.setState({ errorText1: "" })
                    } else { this.setState({ errorText1: "Not matched with password" }) }
                }
            }
            if (name === "password2" || name === "newPassword2") {
                const compareTarget = name === "password2" ? this.state.password1 : this.state.newPassword1
                if (compareTarget !== "") {
                    if (event.target.value === compareTarget) {
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
                        /><br />
                        <Grid container direction={"row"} justify={"center"} alignItems={"center"} spacing={24}>
                            <Grid item>
                                <Button onClick={() => { this.updatePassword() }} style={{ fontSize: "10px", padding: "0", minHeight: "unset" }}><u>Change Password</u></Button>
                            </Grid>
                        </Grid>
                        <br /><br />
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

                    {/* Update bitbox password dialog */}
                    <Dialog open={this.state.updatePassword} onClose={() => { this.closeDialog() }}>
                        <DialogTitle style={{ textAlign: "center" }}>Change Bitbox Password</DialogTitle>
                        <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ display: "inline-block" }}>
                            <Stepper style={{ marginBottom: "2%" }} activeStep={this.state.activeStep}>
                                {updateSteps.map((label, index) => (<Step key={index}><StepLabel>{label}</StepLabel></Step>))}
                            </Stepper>
                        </Grid>
                        <DialogContent>
                            <Grid container direction={"row"} justify={"center"} alignItems={"center"} spacing={24}>
                                <div style={{ display: `${this.state.activeStep === 0 ? "block" : "none"}` }}>
                                    <Grid item xs={8}>
                                        <TextField floatingLabelText="Original Password" floatingLabelFixed={true} type="password" autoComplete="off" name="originalPassword"
                                            value={this.state.originalPassword}
                                            onChange={(data) => { this.handleInputChange(data) }}
                                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleDialogNext() } }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField style={{ marginTop: "10%" }} floatingLabelText="New Password" floatingLabelFixed={true} type="password" autoComplete="off" name="newPassword1"
                                            errorText={this.state.errorText} errorStyle={{ float: "left" }} value={this.state.newPassword1}
                                            onChange={(data) => { this.handleInputChange(data) }}
                                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleDialogNext() } }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField style={{ marginTop: "10%" }} floatingLabelText="Confirm New Password" floatingLabelFixed={true} type="password" autoComplete="off" name="newPassword2"
                                            errorText={this.state.errorText1} errorStyle={{ float: "left" }}
                                            value={this.state.newPassword2}
                                            onChange={(data) => { this.handleInputChange(data) }}
                                            onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleDialogNext() } }}
                                        />
                                    </Grid>
                                </div>
                                <div style={{ marginTop: "5%", textAlign: "center", display: `${this.state.activeStep !== 0 ? "block" : "none"}` }}>
                                    Click <b> 'CHANGE' </b> below to change your password.<br />
                                    After clicking button, when the <b> LED indicator </b> of the Bitbox device turns on, please <b> hold on </b> it.<br />
                                    <CircularProgress style={{ padding: "1em", margin: "auto", display: `${this.state.activeStep === 2 ? "block" : "none"}` }} size={20} thickness={2} />
                                </div>
                            </Grid>
                        </DialogContent>
                        <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ margin: "1em 0em" }}>
                            <Button variant="outlined" onClick={() => { this.handleDialogNext() }} style={{ display: `${this.state.activeStep === 0 ? "block" : "none"}` }}>Next</Button>
                            <Button variant="outlined" onClick={() => { this.updateBitboxPassword() }} style={{ display: `${this.state.activeStep === 1 ? "block" : "none"}` }}>Change</Button>
                        </Grid>
                    </Dialog>
                </div >
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
                } else if (this.state.password1.length < 4) {
                    alert(`The password length must be at least 4 characters.`)
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

    private updatePassword() {
        if (!confirm(`Do you want to change the password used by the Bitbox device? After changing the password, please be careful not to lose your password.`)) {
            return
        }
        this.setState({ updatePassword: true })
    }

    private handleDialogNext() {
        if (this.state.newPassword1 !== this.state.newPassword2) {
            alert(`Not matched password`)
            return
        } else if (this.state.newPassword1.length < 4) {
            alert(`The password length must be at least 4 characters.`)
            return
        }
        this.setState({ activeStep: this.state.activeStep + 1 })
    }

    private updateBitboxPassword() {
        this.setState({ activeStep: this.state.activeStep + 1 })
        this.state.rest.updateBitboxPassword(this.state.originalPassword, this.state.newPassword1).then((result: boolean | number | { error: number, remain_attemp: string }) => {
            if (typeof (result) === "boolean") {
                if (result) {
                    alert(`Your password has been changed.`)
                    this.closeDialogState()
                } else {
                    alert(`Failed to change password. Please try again.`)
                    this.setState({ activeStep: 0 })
                }
                return
            }
            if (typeof (result) === "number") {
                switch (result) {
                    case 20:
                        alert(`Can not find bitbox device.`)
                        this.setState({ activeStep: 0 })
                        break
                    case 21:
                        alert(`Password information was not found.`)
                        this.closeDialogState()
                        this.setState({ initialInfoStep: 0, password1: "", password2: "", activeStep: 0 })
                        break
                    case 22:
                        alert(`Wallet information was not found.`)
                        this.closeDialogState()
                        this.setState({ initialInfoStep: 2, activeStep: 0 })
                        break
                    default:
                        alert(`Failed to change password. Please try again.`)
                        this.setState({ activeStep: 0 })
                        break

                }
                return
            }
            alert(`Invalid password. Please try again. Remain attemp : ${result.remain_attemp}`)
            this.setState({ activeStep: 0, originalPassword: "", newPassword1: "", newPassword2: "" })
        })
    }

    private closeDialog() {
        if (this.state.activeStep === 2) {
            alert(`Communicating with the Bitbox device. Please wait.`)
            return
        }
        this.closeDialogState()
    }

    private closeDialogState() {
        this.setState({ updatePassword: false, activeStep: 0, originalPassword: "", newPassword1: "", newPassword2: "" })
    }
}
