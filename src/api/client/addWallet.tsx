import * as QRCode from "qrcode.react"
import * as React from "react"
import { Redirect } from "react-router"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { encodingMnemonic } from "./stringUtil"

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
            isLanguageView: true,
            isMnemonicTypeView: false,
            isMnemonicView: false,
            language: "",
            languages: ["English", "Korean", "Chinese - Simplified", "Chinese - Traditional", "Japanese", "French", "Spanish", "Italian"],
            mnemonic: "",
            redirect: false,
            rest: props.rest,
        }
    }

    public handleName(data: any) {
        this.setState({ name: data.target.value })
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
    public handleConfirmMnemonic(data: any) {
        this.setState({ confirmMnemonic: data.target.value })
    }
    public handleTypeMnemonic(data: any) {
        this.setState({ typedMnemonic: data.target.value })
    }

    public receiveMnemonic() {
        if (this.state.name === undefined || this.state.password === undefined || this.state.hint === undefined) {
            alert(this.errMsg1)
        } else if (this.state.name.search(/\s/) !== -1 || !this.pattern1.test(this.state.name)) {
            alert(this.errMsg2)
        } else {
            if (this.state.password !== this.state.confirmPassword) {
                alert(this.errMsg3)
            } else {
                this.state.rest.checkDupleName(this.state.name).then((result: boolean) => {
                    if (result) {
                        alert(this.errMsg6)
                    } else {
                        this.setState({ isMnemonicView: true })
                    }
                })
            }
        }
    }
    public checkConfirmMnemonic() {
        if (this.state.confirmMnemonic === "" || this.state.confirmMnemonic === undefined) {
            alert(this.errMsg5)
        } else {
            const mnemonicString = encodingMnemonic(this.state.mnemonic)
            const confirmMnemonicString = encodingMnemonic(this.state.confirmMnemonic)
            if (this.state.mnemonic === confirmMnemonicString) {
                this.setState({ isMnemonicView: false, isMnemonicTypeView: true })
            } else {
                alert(this.errMsg4)
            }
        }
    }
    public createWallet() {
        if (this.state.typedMnemonic === "" || this.state.typedMnemonic === undefined) {
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
    public languageSelected() {
        if (this.state.selectedOption === "" || this.state.selectedOption === undefined) {
            alert(this.errMsg7)
        } else {
            this.state.rest.setLoading(true)
            let opt = this.state.selectedOption
            if (opt === "Chinese - Traditional") {
                opt = "chinese_traditional"
            } else if (opt === "Chinese - Simplified") {
                opt = "chinese_simplified"
            }
            this.state.rest.getMnemonic(opt).then((data: string) => {
                this.state.rest.setLoading(false)
                this.setState({ isLanguageView: false, mnemonic: data, language: opt })
            })
        }
    }
    public handleOptionChange(option: any) {
        this.setState({ selectedOption: option.target.value })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        if (this.state.walletViewRedirect) {
            return <Redirect to={`/wallet/detail/${this.state.name}`} />
        }
        return (
            <div>
                <div className={`${this.state.isLanguageView ? "" : "hide"}`}>
                    <div className="contentTitle">Select Language</div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <form>
                                        {this.state.languages.map((lang: string) => {
                                            return (
                                                <div key={lang}>
                                                    <input type="radio" name="language"
                                                        value={lang}
                                                        onChange={(option) => { this.handleOptionChange(option) }}
                                                        onKeyPress={(event) => { if (event.key === "Enter") { this.languageSelected() } }}
                                                    />
                                                    <label>{lang}</label>
                                                </div>
                                            )
                                        })}
                                    </form>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2} className="addAccountBtnTd">
                                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent addAccountBtn"
                                        onClick={() => { this.cancelWallet() }}
                                    >CANCEL</button>
                                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored addAccountBtn"
                                        onClick={() => { this.languageSelected() }}
                                    >NEXT</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={`${this.state.isLanguageView || this.state.isMnemonicView || this.state.isMnemonicTypeView ? "hide" : ""}`}>
                    <div className="contentTitle">Add Account</div>
                    <table>
                        <tbody>
                            <tr>
                                <td className="subTitle_width20">Wallet Name</td>
                                <td>
                                    <form action="#">
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                            <input className="mdl-textfield__input" type="text" id="walletName"
                                                onChange={(data) => { this.handleName(data) }}
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        this.receiveMnemonic()
                                                    }
                                                }}
                                            />
                                        </div>
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <td className="subTitle_width20">Password</td>
                                <td>
                                    <form action="#">
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                            <input className="mdl-textfield__input" type="password" id="walletPwd" autoComplete="off"
                                                onChange={(data) => { this.handlePassword(data) }}
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        this.receiveMnemonic()
                                                    }
                                                }}
                                            />
                                        </div>
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <td className="subTitle_width20">Confirm Password</td>
                                <td>
                                    <form action="#">
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                            <input className="mdl-textfield__input" type="password" id="walletConfirmPwd" autoComplete="off"
                                                onChange={(data) => { this.handleConfirmPassword(data) }}
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        this.receiveMnemonic()
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
                                                        this.receiveMnemonic()
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
                                        onClick={() => { this.receiveMnemonic() }}
                                    >NEXT</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div
                    className={`${
                        this.state.isMnemonicView && !this.state.isMnemonicTypeView ? "" : "hide"
                        }`}
                >
                    <div className="contentTitle">Random Mnemonic</div>
                    <table className="mnemonicTable">
                        <tbody>
                            <tr>
                                <td>{this.state.mnemonic}</td>
                            </tr>
                            <tr>
                                <td>
                                    <form action="#">
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                            <input className="mdl-textfield__input mnemonicInput" type="text" id="confirmMnemonic1" autoComplete="off"
                                                onChange={(data) => { this.handleConfirmMnemonic(data) }}
                                                onPaste={(e) => { e.preventDefault() }}
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        this.checkConfirmMnemonic()
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
                                        onClick={() => { this.checkConfirmMnemonic() }}
                                    >NEXT</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div
                    className={`${
                        !this.state.isMnemonicView && this.state.isMnemonicTypeView ? "" : "hide"
                        }`}
                >
                    <div className="contentTitle">Type mnemonic words again</div>
                    <table className="mnemonicTable">
                        <tbody>
                            <tr>
                                <td>
                                    <form action="#">
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                            <input className="mdl-textfield__input mnemonicInput" type="text" id="confirmMnemonic2" autoComplete="off"
                                                onChange={(data) => { this.handleTypeMnemonic(data) }}
                                                onPaste={(e) => { e.preventDefault() }}
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        this.createWallet()
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
                                        onClick={() => { this.createWallet() }}
                                    >CREATE</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
