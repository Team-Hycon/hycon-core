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
    public pattern1 = /^[a-zA-Z0-9]{2,20}$/
    constructor(props: any) {
        super(props)
        this.state = {
            isPassphrase: false,
            language: "English",
            languages: ["English", "Korean", "Chinese - Simplified", "Chinese - Traditional", "Japanese", "French", "Spanish", "Italian"],
            mnemonic: "",
            redirect: false,
            rest: props.rest,
        }
    }

    public handleName(data: any) {
        this.setState({ name: data.target.value })
    }
    public handlePassphrase(data: any) {
        this.setState({ passphrase: data.target.value })
    }
    public handlePassword(data: any) {
        this.setState({ password: data.target.value })
    }
    public handleConfirmPassword(data: any) {
        this.setState({ confirmPassword: data.target.value })
    }
    public handleHint(data: any) {
        this.setState({ hint: data.target.value })
    }
    public handleTypeMnemonic(data: any) {
        this.setState({ mnemonic: data.target.value })
    }

    public handleLanguage(data: any) {
        let opt = data.target.value
        if (opt === "Chinese - Traditional") {
            opt = "chinese_traditional"
        } else if (opt === "Chinese - Simplified") {
            opt = "chinese_simplified"
        }
        this.setState({ language: opt })
    }

    public handleCheckbox(data: any) {
        this.setState({ isPassphrase: data.target.checked })
    }

    public recoverWallet() {
        if (this.state.name === undefined) {
            alert(this.errMsg1)
        } else if (this.state.name.search(/\s/) !== -1 || !this.pattern1.test(this.state.name)) {
            alert(this.errMsg2)
        } else {
            if (this.state.password !== this.state.confirmPassword) {
                alert(this.errMsg3)
            } else {
                const mnemonic = encodingMnemonic(this.state.mnemonic)
                this.state.rest.recoverWallet({
                    hint: this.state.hint,
                    language: this.state.language,
                    mnemonic,
                    name: this.state.name,
                    passphrase: this.state.passphrase,
                    password: this.state.password,
                }).then((data: string | boolean) => {
                    if (typeof data !== "string") {
                        alert(this.errMsg4)
                    } else {
                        this.setState({ redirect: true })
                    }
                })
            }
        }
    }
    // TODO: Remove lines below if codes are not used
    // public recoverWalletForce() {
    //     let mnemonic = this.state.mnemonic
    //     if (mnemonic.charCodeAt(0) >= 0xAC00 && mnemonic.charCodeAt(0) <= 0xD7A3) {
    //         mnemonic = encodingMnemonic(mnemonic)
    //     }
    //     this.state.rest
    //         .recoverWalletForce({
    //             hint: this.state.hint,
    //             language: this.state.language,
    //             mnemonic,
    //             name: this.state.name,
    //             password: this.state.password,
    //         })
    //         .then((data: string) => {
    //             if (typeof data !== "string") {
    //                 alert(this.errMsg5)
    //             }
    //             this.setState({ redirect: true })
    //         })
    // }

    public cancelWallet() {
        this.setState({ redirect: true })
    }

    public render() {
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        return (
            <div>
                <div className="contentTitle">Recover Wallet</div>
                <table className="recoverTable">
                    <tbody>
                        <tr>
                            <td className="subTitle_width20">Wallet Name<span style={{ color: "red" }}>*</span></td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <input className="mdl-textfield__input" type="text" id="walletName"
                                            onChange={(data) => { this.handleName(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20">Encryption Password</td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <input className="mdl-textfield__input" type="password" id="walletPwd" autoComplete="off"
                                            onChange={(data) => { this.handlePassword(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20">Confirm Encryption Password</td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <input className="mdl-textfield__input" type="password" id="walletConfirmPwd" autoComplete="off"
                                            onChange={(data) => { this.handleConfirmPassword(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20">Password Hint</td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <input className="mdl-textfield__input" type="text" id="walletPwdHint"
                                            onChange={(data) => { this.handleHint(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20">Language of Mnemonic<span style={{ color: "red" }}>*</span></td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <select className="selectBox" value={this.state.language} onChange={(data) => { this.handleLanguage(data) }}>
                                            {this.state.languages.map((lang: string) => {
                                                return (<option key={lang} value={lang}>{lang}</option>)
                                            })}
                                        </select>
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20">Type Your Mnemonic<span style={{ color: "red" }}>*</span></td>
                            <td>
                                <form action="#">
                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                        <input className="mdl-textfield__input mnemonicInput" type="text" id="confirmMnemonic" autoComplete="off"
                                            onChange={(data) => { this.handleTypeMnemonic(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td className="subTitle_width20 checkPassphrase">
                                <input type="checkbox" checked={this.state.isPassphrase} onChange={(data) => { this.handleCheckbox(data) }} />Passphrase
                            </td>
                            <td>
                                <form action="#">
                                    <div className={`${this.state.isPassphrase ? "mdl-textfield mdl-js-textfield mdl-textfield--floating-label" : "hide"}`}>
                                        <input className="mdl-textfield__input" type="text" id="walletPassphrase" autoComplete="off"
                                            onChange={(data) => { this.handlePassphrase(data) }}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    this.recoverWallet()
                                                }
                                            }}
                                        />
                                    </div>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="addAccountBtnTd">
                                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent addAccountBtn"
                                    onClick={() => { this.cancelWallet() }}
                                >CANCEL</button>
                                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored addAccountBtn"
                                    onClick={() => { this.recoverWallet() }}
                                >RECOVER</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
