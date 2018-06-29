import { CardMedia, Icon } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Collapse from "@material-ui/core/Collapse"
import Divider from "@material-ui/core/Divider"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import Select from "@material-ui/core/Select"
import withStyles, { StyleRulesCallback, WithStyles } from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import { Checkbox, Dialog, IconButton, TextField } from "material-ui"
import * as React from "react"

export interface ILogin {
    email: string
    password: string
    tfa_token?: string
    tfa_pin?: number
}

export interface IUpdateAddr {
    addr?: any
    idx: any
    email: any
}
// tslint:disable:object-literal-sort-keys
const styles = ({
    flex: {
        flex: 1,
    }, formField: {
        width: "100%",
    }, logo: {
        width: "40%",
        marginTop: "0.4em",
    }, typography: {
        h1: {
            marginTop: "1.5em",
            color: "#FFF",
            fontSize: "24px",
        }, h2: {
            color: "#FFF",
            fontSize: "16px",
        }, link: {
            color: "#3f51b5",
            fontSize: "12px",
            cursor: "pointer",
            margin: "auto 0",
        }, select: {
            color: "#3f51b5",
            fontSize: "12px",
            marginRight: "auto",
        }, statusError: {
            marginTop: "6px",
            color: "#D50000",
            fontSize: "9px",
        }, statusSuccess: {
            marginTop: "6px",
            color: "#7CB342",
            fontSize: "9px",
        },
    }, modal: {
        modalstyle: {
            backgroundColor: "#F0F0F0",
        }, modalbtn: {
            marginTop: "1em",
            marginBottom: "1em",
            padding: "0 18px",
        }, innerpadding: {
            // padding: "24px 22px 0 22px",
        }, bottompadding: {
            paddingBottom: "24px",
        },
    }, vcenter: {
        margin: "auto",
    },
})

export class Login extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            claimErr: false,
            email: "",
            password: "",
            rest: props.rest,
            tfaShow: false,
            tfaInput: "",
            tfaError: "",
            errorMsg: false,
            loggedIn: false,
            mnemonic: "",
            mnemonicError: false,
            passphrase: "",
            language: "english",
            success: false,
            token: "",
            age: "",
        }
        // this.handleSubmit = this.handleSubmit.bind(this)
    }

    public async handleLogin(event: any) {
        let data: any
        if (this.state.tfaInput === "") {
            data = {
                email: this.state.email,
                password: this.state.password,
            }
        } else {
            data = {
                email: this.state.email,
                password: this.state.password,
                tfa_token: this.state.tfaInput,
            }
        }
        const response = await this.login(data)

        switch (response.status) {
            case 305:
                this.setState({ claimErr: true })
                break
            case 302:
                this.setState({ tfaError: true })
                break
            case 201:
                this.setState({ tfaShow: true })
                this.setState({ errorMsg: false })
                break
            case 200:
                this.setState({ loggedIn: true })
                this.setState({ token: response.token })
                this.setState({ errorMsg: false })
                break
            default:
                this.setState({ errorMsg: true })
        }
    }

    public changeLanguage = (name: any) => (event: any) => {
        this.setState({ [name]: event.target.value })
    }
    public async handleUpdateAddress(event: any) {
        if (!(await this.handleMnemonic())) {
            this.setState({ mnemonicError: true })
            return
        }

        const response = await this.updateAddress()
        switch (response.status) {
            case 301:
                break
            case 300:
                break
            case 200:
                this.setState({ success: true })
                this.props.cancelDialog()
                break
        }
    }

    public async handleMnemonic(): Promise<boolean> {
        const wallet = await this.state.rest.createNewWallet({
            mnemonic: this.state.mnemonic,
            language: this.state.language,
            passphrase: this.state.passphrase,
        })

        return (wallet.address === this.props.address)
    }

    public closeModal() {
        this.setState({ tfaShow: false, tfa: undefined })
    }
    public handleChange(e: any) {
        e.preventDefault()
        this.setState({ [e.target.id]: e.target.value })
    }

    public handlePassphrase(data: any) {
        this.setState({ passphrase: data.target.value })
    }

    public handleCheckbox(event: any) {
        this.setState({ advanced: event.target.checked })
    }

    public render() {
        let recoverStatus: any
        switch (this.state.recoverSent) {
            case 1:
                recoverStatus = <Typography style={styles.typography.statusError}>{this.props.language["login-reset-error"]}</Typography>
                break
            case 2:
                recoverStatus = <Typography style={styles.typography.statusSuccess}>{this.props.language["login-reset-success"]}</Typography>
                break
        }

        return (
            <Grid container style={{ width: "100%" }}>
                {!this.state.loggedIn ?
                    <CardContent>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <FormControl style={styles.formField}>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="text" value={this.state.email} onChange={this.handleChange.bind(this)} autoComplete="off" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl style={styles.formField}>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input id="password" type="password" value={this.state.password} onChange={this.handleChange.bind(this)} autoComplete="off" />
                                </FormControl>
                                {this.state.errorMsg ? <Typography style={styles.typography.statusError}>Invalid email/password. Please re-enter.</Typography> : null}
                                {this.state.claimErr ? <Typography style={styles.typography.statusError}>Transaction already sent. Can't claim wallet.</Typography> : null}
                            </Grid>
                            <Grid item xs={12} />
                            <Grid container style={{ justifyContent: "space-between", padding: "0 12px" }}>
                                {this.state.tfaShow ?
                                    <Button id="loginSubmitBtn" variant="outlined" disabled onClick={this.handleLogin.bind(this)}>
                                        Login
                                </Button> :
                                    <Button id="loginSubmitBtn" variant="outlined" color="primary" onClick={this.handleLogin.bind(this)}>
                                        Login
                                </Button>
                                }
                            </Grid>
                            <Collapse in={this.state.tfaShow} style={styles.formField}>
                                <Paper elevation={4} style={styles.modal.modalstyle}>
                                    <Grid container style={styles.modal.innerpadding}>
                                        <Grid item xs={12}>
                                            <Typography component="p" style={styles.typography.link}>
                                                Enter 2FA
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl style={styles.formField}>
                                                <InputLabel htmlFor="tfaInput">PIN</InputLabel>
                                                <Input id="tfaInput" type="text" value={this.state.tfaInput} onChange={this.handleChange.bind(this)} autoComplete="off" />
                                            </FormControl>
                                            {this.state.tfaError ? <Typography style={styles.typography.statusError}>Invalid 2FA PIN. Please re-enter.</Typography> : null}
                                        </Grid>
                                    </Grid>
                                    <Grid container style={styles.modal.bottompadding}>
                                        <Grid item xs={12}>
                                            <Grid container justify={"flex-end"} spacing={8} style={styles.modal.modalbtn}>
                                                <Button color="primary" id="modal_cancel" onClick={this.closeModal.bind(this)} >Cancel</Button>
                                                <Button variant="raised" color="primary" id="modal_submit" onClick={this.handleLogin.bind(this)}>Submit</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Collapse>
                            <Divider />
                        </Grid>
                    </CardContent> :
                    <CardContent style={{ width: "100%" }}>
                        <Grid container spacing={8}>
                            <Grid item xs={8} style={{ paddingBottom: "10px" }}>
                                <FormControl style={styles.formField}>
                                    <InputLabel htmlFor="mnemonic">Enter the mnemonic phrase for this address to confirm</InputLabel>
                                    <Input id="mnemonic" type="text" value={this.state.mnemonic} onChange={this.handleChange.bind(this)} autoComplete="off" />
                                </FormControl>
                                {this.state.mnemonicError ? <Typography style={styles.typography.statusError}>Mnemonic/passphrase or language is incorrect. Please re-enter.</Typography> : null}
                            </Grid>
                            <Grid item xs={4} style={{ paddingBottom: "10px" }}>

                                <FormControl style={{ width: "100%" }}>
                                    <InputLabel htmlFor="language-native-simple">Language</InputLabel>
                                    <Select
                                        native
                                        value={this.state.language}
                                        onChange={this.changeLanguage("language")}
                                        inputProps={{
                                            name: "language",
                                            id: "language-native-simple",
                                        }}
                                        autoWidth
                                    >

                                        <option value={"english"}>English</option>
                                        <option value={"korean"}>한국어</option>
                                        <option value={"chinese_simplified"}>中文（简体)</option>
                                        <option value={"chinese_traditional"}>中文 (繁體)</option>
                                        <option value={"japanese"}>日本語</option>
                                        <option value={"french"}>Français</option>
                                        <option value={"italian"}>Italiano</option>
                                        <option value={"spanish"}>Español</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <input type="checkbox" checked={this.state.advanced} onChange={(event) => this.handleCheckbox(event)} /> &nbsp;Advanced Options
                            {(this.state.advanced)
                                ? (<div>
                                    <TextField type="password" floatingLabelText="BIP39 Passphrase" floatingLabelFixed={true} autoComplete="off" name="pp1"
                                        value={this.state.passphrase}
                                        onChange={(data) => { this.handlePassphrase(data) }}
                                    />
                                </div>)
                                : null
                            }
                            <Grid item xs={12}>
                                <Button variant="raised" color="primary" id="update_address" onClick={this.handleUpdateAddress.bind(this)}>Submit</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                }
            </Grid >
        )
    }

    private async login(data: ILogin): Promise<any> {
        try {
            const formData = new FormData()
            formData.append("action", "login")
            formData.append("login_email", data.email)
            formData.append("login_pass", data.password)
            if (data.tfa_token) {
                formData.append("tfa_token", data.tfa_token)
            }

            const headers = new Headers()
            headers.append("Accept", "application/json")
            const res = await fetch(`https://wallet.hycon.io/ajax.php`, {
                body: formData,
                credentials: "include",
                headers,
                method: "POST",
            })
            return res.json()
        } catch (e) {
            // tslint:disable-next-line:no-console
            // console.log(e)
        }
    }

    private async updateAddress(): Promise<any> {
        try {
            const formData = new FormData()
            formData.append("action", "hycAddrUpdate")
            formData.append("addr", this.props.address)
            formData.append("token", this.state.token)

            const headers = new Headers()
            headers.append("Accept", "application/json")
            const res = await fetch(`https://wallet.hycon.io/ajax.php`, {
                body: formData,
                credentials: "include",
                headers,
                method: "POST",
            })
            return res.json()
        } catch (e) {
            // tslint:disable-next-line:no-console
            // console.log(e)
        }
    }
}
