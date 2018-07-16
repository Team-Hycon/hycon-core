import { Button, Card, CardContent, FormControl, Grid, Icon, Input, InputLabel, Select } from "@material-ui/core"
import { Checkbox, Dialog, IconButton, MenuItem, TextField } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { encodingMnemonic } from "./stringUtil"

export class RecoverWallet extends React.Component<any, any> {
    public mounted: boolean = false
    public errMsg1: string = "Please enter required value"
    public errMsg2: string = "Invalid wallet name: the wallet name must be between 2 to 20 characters with no spaces. Use only English or number."
    public errMsg3: string = "Not matched password"
    public errMsg4: string = "Check your mnemonic words"
    public errMsg5: string = "Fail to recover wallet"
    public pattern1 = /^[a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]{2,20}$/
    constructor(props: any) {
        super(props)
        this.state = {
            advanced: false,
            dialog: false,
            errText1: "",
            errText2: "",
            language: "",
            languages: ["English", "Korean", "Chinese - Simplified", "Chinese - Traditional", "Japanese", "French", "Spanish", "Italian"],
            load: false,
            mnemonic: "",
            name: "",
            passphrase: "",
            password1: "",
            password2: "",
            redirect: false,
            rest: props.rest,
            selectedOption: "English",
        }
        this.handleOptionChange = this.handleOptionChange.bind(this)
    }

    public componentDidMount() {
        this.setState({ load: true })
    }
    public handleOptionChange(option: any) {
        this.setState({ selectedOption: option.target.value })
        let opt = option.target.value
        if (opt === "Chinese - Traditional") {
            opt = "chinese_traditional"
        } else if (opt === "Chinese - Simplified") {
            opt = "chinese_simplified"
        }
        this.setState({ language: opt })
    }
    public handleMnemonic(data: any) {
        this.setState({ mnemonic: data.target.value })
    }
    public handleName(data: any) {
        this.setState({ name: data.target.value })
    }
    public handlePassword(data: any) {
        if (this.state.password2 !== "") {
            if (data.target.value === this.state.password2) {
                this.setState({ errText1: "" })
            } else { this.setState({ errText1: "Not matched with password" }) }
        }
        this.setState({ password1: data.target.value })
    }
    public handleConfirmPassword(data: any) {
        if (this.state.password1 !== "") {
            if (data.target.value === this.state.password1) {
                this.setState({ errText1: "" })
            } else { this.setState({ errText1: "Not matched with password" }) }
        }
        this.setState({ password2: data.target.value })
    }
    public handlePassphrase(data: any) {
        this.setState({ passphrase: data.target.value })
    }
    public handleCheckbox(event: any) {
        if (event.target.checked === false) { this.setState({ passphrase: "" }) }
        this.setState({ advanced: event.target.checked })
    }
    public recoverWallet() {
        if (this.state.name === "") {
            alert(this.errMsg1)
            return
        }
        if (this.state.name.search(/\s/) !== -1 || !this.pattern1.test(this.state.name)) {
            alert(this.errMsg2)
            return
        }
        if (this.state.password1 !== this.state.password2) {
            alert(this.errMsg3)
            return
        }

        const mnemonic = encodingMnemonic(this.state.mnemonic)
        this.state.rest.recoverWallet({
            language: this.state.language,
            mnemonic,
            name: this.state.name,
            passphrase: this.state.passphrase,
            password: this.state.password1,
        }).then((data: string | boolean) => {
            if (typeof data !== "string") {
                alert(this.errMsg4)
            } else {
                this.setState({ redirect: true })
            }
        })

    }
    public cancelWallet() {
        this.setState({ redirect: true })
    }

    public render() {
        if (!this.state.load) {
            return <div></div>
        }
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        return (
            <div style={{ textAlign: "center", width: "80%", margin: "auto" }}>
                <Card><CardContent>
                    <h3 style={{ color: "grey" }}>Recover Wallet</h3><br />
                    <FormControl style={{ width: "256px", marginRight: "3%" }}>
                        <InputLabel htmlFor="language">Mnemonic Language</InputLabel>
                        <Select value={this.state.selectedOption} onChange={this.handleOptionChange} input={<Input name="language" />}>
                            {this.state.languages.map((lang: string) => {
                                return (<MenuItem key={lang} value={lang}>{lang}</MenuItem>)
                            })}
                        </Select>
                    </FormControl>
                    <TextField floatingLabelText="Mnemonic Phrase" floatingLabelFixed={true} autoComplete="off"
                        value={this.state.mnemonic}
                        onChange={(data) => { this.handleMnemonic(data) }}
                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.recoverWallet() } }}
                    /><br /><br /><br />
                    <TextField floatingLabelText="Wallet Name" floatingLabelFixed={true} autoComplete="off"
                        value={this.state.name}
                        onChange={(data) => { this.handleName(data) }}
                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.recoverWallet() } }}
                    /><br />
                    <TextField style={{ marginRight: "3%" }} type="password" floatingLabelText="Password" floatingLabelFixed={true} autoComplete="off" name="pw1"
                        value={this.state.password1}
                        onChange={(data) => { this.handlePassword(data) }}
                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.recoverWallet() } }}
                    />
                    <TextField type="password" floatingLabelText="Confirm Password" floatingLabelFixed={true} autoComplete="off" name="pw2"
                        errorText={this.state.errText1} errorStyle={{ float: "left" }}
                        value={this.state.password2}
                        onChange={(data) => { this.handleConfirmPassword(data) }}
                        onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.recoverWallet() } }}
                    /><br /><br />
                    <input type="checkbox" checked={this.state.advanced} onChange={(event) => this.handleCheckbox(event)} /> Advanced Options
                    <IconButton iconStyle={{ color: "grey", fontSize: "15px" }} onClick={() => { this.setState({ dialog: true }) }}><Icon>help_outline</Icon></IconButton>
                    {(this.state.advanced)
                        ? (<div>
                            <TextField floatingLabelText="BIP39 Passphrase" floatingLabelFixed={true} autoComplete="off" name="pp"
                                value={this.state.passphrase}
                                onChange={(data) => { this.handlePassphrase(data) }}
                                onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.recoverWallet() } }}
                            />
                        </div>)
                        : (<div></div>)
                    }
                    <br /><br />
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="raised" style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", margin: "0 10px" }}
                            onClick={() => { this.cancelWallet() }}
                        >Cancel</Button>
                        <Button variant="raised" style={{ backgroundColor: "#50aaff", color: "white", margin: "0 10px" }}
                            onClick={() => { this.recoverWallet() }}
                        >Recover</Button>
                    </Grid>
                </CardContent></Card>

                {/* HELP - ADVANCED OPTIONS */}
                <Dialog className="dialog" open={this.state.dialog} contentStyle={{ width: "70%", maxWidth: "none" }}>
                    <h3 style={{ color: "grey" }}>Who needs this option?</h3>
                    <div className="mdl-dialog__content dialogContent">
                        When you created a wallet, those who set up a passphrase must enter passphrase you set in Advanced Options.
                        If you didn't set, no advanced options are required.
                    </div><br />
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="raised" onClick={() => { this.setState({ dialog: false }) }} style={{ backgroundColor: "#50aaff", color: "white", float: "right" }}>Got it</Button>
                    </Grid>
                </Dialog>
            </div >
        )
    }
}
