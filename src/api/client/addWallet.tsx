import { Button, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Icon, Input, InputLabel, MenuItem, NativeSelect, Select, Step, StepLabel, Stepper } from "@material-ui/core"
import { Card, IconMenu, TextField } from "material-ui"
import * as QRCode from "qrcode.react"
import * as React from "react"
import { Redirect } from "react-router"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { encodingMnemonic } from "./stringUtil"

const steps = ["Enter wallet information", "Receive and type mnemonic", "Check mnemonic"]
export class AddWallet extends React.Component<any, any> {
    public mounted: boolean = false
    public errMsg1: string = "Please enter required value"
    public errMsg2: string = "Invalid wallet name: the wallet name must be between 2 to 20 characters with no spaces. Use only English or number."
    public errMsg3: string = "Not matched password"
    public errMsg4: string = "Check your mnemonic words"
    public errMsg5: string = "Please enter your mnemonic"
    public errMsg6: string = "Duplicate wallet name"
    public errMsg7: string = "Please select Language"
    public pattern1 = /^[a-zA-Z0-9]{2,20}$/
    constructor(props: any) {
        super(props)
        this.state = {
            activeStep: 0,
            confirmMnemonic: "",
            confirmPassword: "",
            errorWithPassword: "",
            hint: "",
            isPassphrase: false,
            language: "",
            languages: ["English", "Korean", "Chinese - Simplified", "Chinese - Traditional", "Japanese", "French", "Spanish", "Italian"],
            load: false,
            mnemonic: "",
            name: "",
            passphrase: "",
            password: "",
            redirect: false,
            rest: props.rest,
            selectedOption: "English",
            typedMnemonic: "",
        }
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.cancelWallet = this.cancelWallet.bind(this)
        this.handleNext = this.handleNext.bind(this)
    }

    public componentDidMount() {
        this.setState({ load: true })
    }

    public handleName(data: any) {
        this.setState({ name: data.target.value })
    }

    public handlePassphrase(data: any) {
        this.setState({ passphrase: data.target.value })
    }
    public handlePassword(data: any) {
        if (this.state.confirmPassword !== "") {
            if (data.target.value === this.state.confirmPassword) {
                this.setState({ errorWithPassword: "" })
            } else { this.setState({ errorWithPassword: "Not matched with password" }) }
        }
        this.setState({ password: data.target.value })
    }
    public handleConfirmPassword(data: any) {
        if (this.state.password !== "") {
            if (data.target.value === this.state.password) {
                this.setState({ errorWithPassword: "" })
            } else { this.setState({ errorWithPassword: "Not matched with password" }) }
        }
        this.setState({ confirmPassword: data.target.value })
    }
    public handleHint(data: any) {
        this.setState({ hint: data.target.value })
    }
    public handleConfirmMnemonic(data: any) {
        this.setState({ confirmMnemonic: data.target.value })
    }
    public handleTypeMnemonic(data: any) {
        this.setState({ typedMnemonic: data.target.value })
    }
    public handleOptionChange(option: any) {
        this.setState({ selectedOption: option.target.value })
    }

    public handleNext() {
        switch (this.state.activeStep) {
            case 0:
                this.receiveMnemonic()
                break
            case 1:
                this.checkConfirmMnemonic()
                break
            case 2:
                this.createWallet()
                break
            default:
                break
        }
    }

    public handleCheckbox(data: any) {
        this.setState({ isPassphrase: data.target.checked })
    }

    public receiveMnemonic() {
        if (this.state.name === "") {
            alert(this.errMsg1)
        } else if (this.state.name.search(/\s/) !== -1 || !this.pattern1.test(this.state.name)) {
            alert(this.errMsg2)
        } else {
            if (this.state.password !== this.state.confirmPassword) {
                alert(this.errMsg3)
            } else {
                this.state.rest.setLoading(true)
                this.state.rest.checkDupleName(this.state.name).then((result: boolean) => {
                    if (result) {
                        alert(this.errMsg6)
                    } else {
                        let opt = this.state.selectedOption
                        if (opt === "Chinese - Traditional") {
                            opt = "chinese_traditional"
                        } else if (opt === "Chinese - Simplified") { opt = "chinese_simplified" }
                        this.state.rest.getMnemonic(opt).then((data: string) => {
                            this.state.rest.setLoading(false)
                            this.setState({ mnemonic: data, language: opt, activeStep: this.state.activeStep + 1 })
                        })
                    }
                })
            }
        }
    }
    public checkConfirmMnemonic() {
        if (this.state.confirmMnemonic === "") {
            alert(this.errMsg5)
        } else {
            const mnemonicString = encodingMnemonic(this.state.mnemonic)
            const confirmMnemonicString = encodingMnemonic(this.state.confirmMnemonic)
            if (this.state.mnemonic === confirmMnemonicString) {
                this.setState({ activeStep: this.state.activeStep + 1 })
            } else {
                alert(this.errMsg4)
            }
        }
    }
    public createWallet() {
        if (this.state.typedMnemonic === "") {
            alert(this.errMsg5)
        } else {
            const mnemonicString = encodingMnemonic(this.state.mnemonic)
            const typedMnemonicString = encodingMnemonic(this.state.typedMnemonic)
            if (mnemonicString === typedMnemonicString) {
                this.state.rest.generateWallet({
                    hint: this.state.hint,
                    language: this.state.language,
                    mnemonic: this.state.mnemonic,
                    name: this.state.name,
                    passphrase: this.state.passphrase,
                    password: this.state.password,
                }).then((data: string) => {
                    this.setState({ walletViewRedirect: true, address: data })
                })
            } else {
                alert(this.errMsg4)
            }
        }
    }
    public cancelWallet() {
        this.setState({ redirect: true })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        if (this.state.walletViewRedirect) {
            return <Redirect to={`/wallet/detail/${this.state.name}`} />
        }
        if (!this.state.load) {
            return <div></div>
        }
        return (
            <div id="div1" style={{ textAlign: "center", width: "80%", margin: "auto" }}>
                <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ display: "inline-block" }}>
                    <Stepper style={{ marginBottom: "2%" }} activeStep={this.state.activeStep}>
                        {steps.map((label, index) => (<Step key={index}><StepLabel>{label}</StepLabel></Step>))}
                    </Stepper>
                </Grid>
                <Card style={{ height: "27em" }}>
                    <CardContent>
                        <div style={{ display: `${this.state.activeStep === 0 ? ("block") : ("none")}` }}>
                            <TextField name="walletName" style={{ marginRight: "3%" }} floatingLabelFixed={true} floatingLabelText="Wallet Name" type="text" value={this.state.walletName}
                                onChange={(data) => { this.handleName(data) }} autoComplete="off"
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                            <FormControl style={{ width: "256px", marginTop: "1.5%", marginRight: "3%" }}>
                                <InputLabel htmlFor="language">Mnemonic Language</InputLabel>
                                <Select value={this.state.selectedOption} onChange={this.handleOptionChange} input={<Input name="language" />}>
                                    {this.state.languages.map((lang: string) => {
                                        return (
                                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl><br />
                            <TextField name="walletPwd" floatingLabelFixed={true} style={{ marginRight: "3%" }} floatingLabelText="Encrypt Password" type="password" value={this.state.password}
                                onChange={(data) => { this.handlePassword(data) }} autoComplete="off"
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                            <TextField name="walletConfirmPwd" style={{ marginRight: "3%" }} errorText={this.state.errorWithPassword} floatingLabelFixed={true} floatingLabelText="Confirm Password" type="password" value={this.state.confirmPassword}
                                onChange={(data) => { this.handleConfirmPassword(data) }} autoComplete="off"
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} /><br />
                            <TextField name="walletPwdHint" style={{ marginRight: "3%" }} floatingLabelFixed={true} floatingLabelText="Password Hint" type="text" value={this.state.hint}
                                onChange={(data) => { this.handleHint(data) }} autoComplete="off"
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                            <br />
                            <br />
                            <input type="checkbox" checked={this.state.isPassphrase} onChange={(data) => { this.handleCheckbox(data) }} /> Passphrase
                            <TextField name="passphrase" style={{ margin: "auto", display: `${this.state.isPassphrase === true ? ("block") : ("none")}` }} floatingLabelFixed={true} floatingLabelText="Passphrase" type="text" value={this.state.passphrase}
                                onChange={(data) => { this.handlePassphrase(data) }} autoComplete="off"
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                        </div>
                        <div style={{ display: `${this.state.activeStep === 1 ? ("block") : ("none")}` }}>
                            <h4 style={{ color: "grey", marginBottom: "0%" }}>Below is a mnemonic for your wallet.</h4>
                            <div style={{ color: "red", fontSize: "11px" }}>*A mnemonic is a collection of words you need to recover your wallet. Please be careful not to lose it.*</div>
                            <br /><br />
                            <div style={{ fontWeight: "bold" }}>{this.state.mnemonic}</div>
                            <input style={{ border: "none", borderBottom: "0.5px solid", width: "53%" }} type="text" autoComplete="off"
                                onChange={(data) => { this.handleConfirmMnemonic(data) }} onPaste={(e) => { e.preventDefault() }}
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                        </div>
                        <div style={{ display: `${this.state.activeStep === 2 ? ("block") : ("none")}` }}>
                            <h4 style={{ color: "grey", marginBottom: "0%" }}>Please type one more time to check the mnemonic word.</h4>
                            <br /><br />
                            <input style={{ border: "none", borderBottom: "0.5px solid", width: "53%" }} type="text" autoComplete="off"
                                onChange={(data) => { this.handleTypeMnemonic(data) }} onPaste={(e) => { e.preventDefault() }}
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        this.handleNext()
                                    }
                                }} />
                        </div>
                    </CardContent>
                </Card>
                <br /><br />
                <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ display: "inline-block", width: "80%" }}>
                    <Button onClick={this.cancelWallet}>Cancel <Icon style={{ fontSize: "17px" }}>close</Icon></Button>
                    <Button onClick={this.handleNext} >
                        {this.state.activeStep === steps.length - 1 ? "Finish " : "Next "}
                        {this.state.activeStep === steps.length - 1 ? (<Icon style={{ fontSize: "20px" }}>check</Icon>) : (<Icon style={{ fontSize: "20px" }}>chevron_right</Icon>)}
                    </Button>
                </Grid>
            </div >
        )
    }
}
