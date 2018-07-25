import { Button, CardContent, FormControl, Grid, Icon, Input, InputLabel, MenuItem, Select, Step, StepLabel, Stepper } from "@material-ui/core"
import { Card, Dialog, IconButton, TextField } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { encodingMnemonic } from "./stringUtil"

const steps = ["Enter wallet information", "Receive and type mnemonic", "Check mnemonic"]
export class AddWallet extends React.Component<any, any> {
    public mounted: boolean = false
    public errMsg1: string = "Please enter required value"
    public errMsg2: string = "Invalid wallet name: the wallet name must be between 2 to 20 characters with no spaces. Use only English or number."
    public errMsg3: string = "Not matched password"
    public errMsg4: string = "Check your mnemonic phrase"
    public errMsg5: string = "Please enter your mnemonic"
    public errMsg6: string = "Duplicate wallet name"
    public errMsg7: string = "Please select Language"
    public pattern1 = /^[a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]{2,20}$/
    constructor(props: any) {
        super(props)
        this.state = {
            activeStep: 0,
            advanced: false,
            confirmMnemonic: "",
            dialog: false,
            errorText1: "",
            errorText2: "",
            language: "",
            languages: ["English", "Korean", "Chinese - Simplified", "Chinese - Traditional", "Japanese", "French", "Spanish", "Italian"],
            load: false,
            mnemonic: "",
            name: "",
            passphrase1: "",
            passphrase2: "",
            password1: "",
            password2: "",
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
    public handlePassword(data: any) {
        if (this.state.password2 !== "") {
            if (data.target.value === this.state.password2) {
                this.setState({ errorText1: "" })
            } else { this.setState({ errorText1: "Not matched with password" }) }
        }
        this.setState({ password1: data.target.value })
    }
    public handleConfirmPassword(data: any) {
        if (this.state.password1 !== "") {
            if (data.target.value === this.state.password1) {
                this.setState({ errorText1: "" })
            } else { this.setState({ errorText1: "Not matched with password" }) }
        }
        this.setState({ password2: data.target.value })
    }
    public handleCheckbox(event: any) {
        if (event.target.checked === false) { this.setState({ passphrase: "" }) }
        this.setState({ advanced: event.target.checked })
    }
    public handlePassphrase(data: any) {
        if (this.state.passphrase2 !== "") {
            if (data.target.value === this.state.passphrase2) {
                this.setState({ errorText2: "" })
            } else { this.setState({ errorText2: "Not matched with passphrase" }) }
        }
        this.setState({ passphrase1: data.target.value })
    }
    public handleConfirmPassphrase(data: any) {
        if (this.state.passphrase1 !== "") {
            if (data.target.value === this.state.passphrase1) {
                this.setState({ errorText2: "" })
            } else { this.setState({ errorText2: "Not matched with passphrase" }) }
        }
        this.setState({ passphrase2: data.target.value })
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
    public receiveMnemonic() {
        if (this.state.name === "") {
            alert(this.errMsg1)
        } else if (this.state.name.search(/\s/) !== -1 || !this.pattern1.test(this.state.name)) {
            alert(this.errMsg2)
        } else {
            if (this.state.password1 !== this.state.password2 || this.state.passphrase1 !== this.state.passphrase2) {
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
                    passphrase: this.state.passphrase1,
                    password: this.state.password1,
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
            <div style={{ textAlign: "center", width: "80%", margin: "auto" }}>
                <Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ display: "inline-block" }}>
                    <Stepper style={{ marginBottom: "2%" }} activeStep={this.state.activeStep}>
                        {steps.map((label, index) => (<Step key={index}><StepLabel>{label}</StepLabel></Step>))}
                    </Stepper>
                </Grid>
                <Card>
                    <CardContent>
                        <div style={{ display: `${this.state.activeStep === 0 ? ("block") : ("none")}` }}>
                            <TextField style={{ marginRight: "3%" }} floatingLabelText="Wallet Name" floatingLabelFixed={true} autoComplete="off"
                                value={this.state.walletName}
                                onChange={(data) => { this.handleName(data) }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                            />
                            <FormControl style={{ width: "256px", marginTop: "1.5%" }}>
                                <InputLabel htmlFor="language">Mnemonic Language</InputLabel>
                                <Select value={this.state.selectedOption} onChange={this.handleOptionChange} input={<Input name="language" />}>
                                    {this.state.languages.map((lang: string) => {
                                        return (
                                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl><br />
                            <TextField style={{ marginRight: "3%" }} floatingLabelText="Encrypt Password" floatingLabelFixed={true} type="password" autoComplete="off" name="pw1"
                                value={this.state.password1}
                                onChange={(data) => { this.handlePassword(data) }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                            />
                            <TextField floatingLabelText="Confirm Password" floatingLabelFixed={true} type="password" autoComplete="off" name="pw2"
                                errorText={this.state.errorText1} errorStyle={{ float: "left" }}
                                value={this.state.password2}
                                onChange={(data) => { this.handleConfirmPassword(data) }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                            /><br />
                            <br />
                            <br />
                            <input type="checkbox" checked={this.state.advanced} onChange={(event) => this.handleCheckbox(event)} /> Advanced Options
                            <IconButton iconStyle={{ color: "grey", fontSize: "15px" }} onClick={() => { this.setState({ dialog: true }) }}><Icon>help_outline</Icon></IconButton>
                            {(this.state.advanced)
                                ? (<div>
                                    <TextField style={{ marginRight: "3%" }} floatingLabelText="BIP39 Passphrase" floatingLabelFixed={true} autoComplete="off" name="pp1"
                                        value={this.state.passphrase1}
                                        onChange={(data) => { this.handlePassphrase(data) }}
                                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                                    />
                                    <TextField floatingLabelText="Confirm BIP39 Passphrase" floatingLabelFixed={true} autoComplete="off" name="pp2"
                                        errorText={this.state.errorText2} errorStyle={{ float: "left" }}
                                        value={this.state.passphrase2}
                                        onChange={(data) => { this.handleConfirmPassphrase(data) }}
                                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                                    /><br />
                                </div>)
                                : (<div></div>)
                            }
                            <br />
                        </div>
                        <div style={{ display: `${this.state.activeStep === 1 ? ("block") : ("none")}` }}>
                            <h4 style={{ color: "grey", marginBottom: "0%" }}>Below is a mnemonic for your wallet.</h4>
                            <div style={{ color: "red", fontSize: "11px" }}>*A mnemonic is a collection of words you need to recover your wallet. Please be careful not to lose it.*</div>
                            <br /><br />
                            <div style={{ fontWeight: "bold" }}>{this.state.mnemonic}</div>
                            <Input style={{ border: "none", borderBottom: "0.5px solid", width: "53%" }} placeholder="Please type mnemonic phrase above" autoComplete="off"
                                onChange={(data) => { this.handleConfirmMnemonic(data) }} onPaste={(e) => { e.preventDefault() }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                            />
                        </div>
                        <div style={{ display: `${this.state.activeStep === 2 ? ("block") : ("none")}` }}>
                            <h4 style={{ color: "grey", marginBottom: "0%" }}>Confirm mnemonic phrase</h4>
                            <br /><br />
                            <Input style={{ border: "none", borderBottom: "0.5px solid", width: "53%" }} placeholder="Please type one more time to confirm mnemonic phrase" autoComplete="off"
                                onChange={(data) => { this.handleTypeMnemonic(data) }} onPaste={(e) => { e.preventDefault() }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.handleNext() } }}
                            />
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

                {/* HELP - ADVANCED OPTIONS */}
                <Dialog className="dialog" open={this.state.dialog} contentStyle={{ width: "70%", maxWidth: "none" }}>
                    <h3 style={{ color: "grey" }}>Who needs this option?</h3>
                    <div className="mdl-dialog__content dialogContent">
                        Optionally, you can input a BIP39 Passphrase that will be used in addition to your Mnemonic Phrase to recover your Hycon Wallet.
                        With these options, you can manage your wallet more securely.<br />
                        <strong>Don't forget BIP39 Phrase you set. Without this, you will not be able to recover your wallet later.</strong>
                    </div><br />
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="raised" onClick={() => { this.setState({ dialog: false }) }} style={{ backgroundColor: "#50aaff", color: "white", float: "right" }}>Got it</Button>
                    </Grid>
                </Dialog>
            </div >
        )
    }
}
