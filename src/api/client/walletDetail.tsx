import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core"
import { TextField } from "material-ui"
import Avatar from "material-ui/Avatar"
import { Tab, Tabs } from "material-ui/Tabs"
import * as QRCode from "qrcode.react"
import * as React from "react"
import update = require("react-addons-update")
import * as CopyToClipboard from "react-copy-to-clipboard"
import { Redirect } from "react-router"
import { Login } from "./login"
import { MinedBlockLine } from "./minedBlockLine"
import { MultipleAccountsView } from "./multipleAccountsView"
import { NotFound } from "./notFound"
import { IHyconWallet, IMinedInfo, IResponseError, IRest, ITxProp, IWalletAddress } from "./rest"
import { TxLine } from "./txLine"

export class WalletDetail extends React.Component<any, any> {
    public msg1: string = "Are you sure delete your wallet?"
    public msg2: string = "Successfully deleted. You can recover deleted wallet anytime using mnemonic words."
    public msg3: string = "Fail to delete wallet"
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = {
            address: "",
            hasMore: true,
            hasMoreMinedInfo: true,
            index: 1,
            isLoad: false,
            login: false,
            minedBlocks: [],
            minerIndex: 1,
            name: props.name,
            notFound: false,
            password: "",
            pendings: [],
            rest: props.rest,
            redirectHDwalletView: false,
            selectedAccount: "",
            showDialog1: false,
            startWalletIndex: 0,
            txs: [],
            visible: false,
            walletType: "local",
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }

    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getWalletDetail(this.state.name).then((data: IHyconWallet & IResponseError) => {
            this.state.rest.setLoading(false)
            if (this.mounted && data.address) {
                this.setState({ wallet: data, address: data.address, txs: data.txs, minedBlocks: data.minedBlocks, pendings: data.pendings, isLoad: true })
            } else {
                if (data.address !== "") {
                    this.setState({ notFound: true, isLoad: true })
                    return
                }
                this.setState({ showDialog1: true, isLoad: true, wallet: data, address: "", walletType: "hdwallet" })
            }
        }).catch((e: Error) => {
            alert(e)
        })
    }
    public deleteWallet() {
        if (confirm(this.msg1)) {
            this.state.rest.deleteWallet(this.state.name).then((isDeleted: boolean) => {
                if (isDeleted === true) {
                    alert(this.msg2)
                    this.setState({ redirect: true })
                } else {
                    alert(this.msg3)
                }
            })
        }
    }
    public cancelDialog() {
        this.setState({ login: false })
    }
    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
    }

    public transfer() {
        this.setState({ isTransfer: true })
    }

    public login() {
        this.setState({ login: true })
    }

    public accountSelected(index: string, account: IHyconWallet) {
        this.setState({ redirectHDwalletView: true, address: account.address, selectedAccount: index })
    }
    public render() {
        let accountIndex = 0
        let minedIndex = 0
        if (this.state.notFound) {
            return <NotFound />
        }
        if (!this.state.notFound && !this.state.isLoad) {
            return <div></div>
        }
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        if (this.state.redirectHDwalletView) {
            return <Redirect to={`/address/${this.state.address}/hdwallet/${this.state.name}/${this.state.selectedAccount}`} />
        }
        if (this.state.isTransfer) {
            if (this.state.selectedAccount !== "") {
                return <Redirect to={`/maketransactionHDWallet/hdwallet/${this.state.name}/${this.state.address}/${this.state.selectedAccount}`} />
            }
            return <Redirect to={`/transaction/${this.state.name}`} />
        }
        return (
            <div>
                <table className="table_wallet_txs">
                    <thead>
                        <tr>
                            <td colSpan={2} className="walletDetailFunctionTd">
                                <button onClick={() => { this.login() }} className="mdl-button">
                                    <i className="material-icons">assignment_ind</i>CLAIM</button>
                                <button onClick={() => { this.transfer() }} className="mdl-button">
                                    <i className="material-icons">send</i>TRANSFER</button>
                                <button onClick={() => { this.deleteWallet() }} className="mdl-button">
                                    <i className="material-icons">delete</i>FORGET</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <table className="walletTable_NameAddr">
                                    <tbody>
                                        <tr>
                                            <td className="walletNameTd">
                                                <span>
                                                    <Avatar style={{ width: "35px", height: "35px" }} icon={<i className="material-icons walletIcon_white">account_balance_wallet</i>} />
                                                </span>
                                                <span className="walletName">{this.state.name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><br />
                                                <span>
                                                    <i className="material-icons">account_balance</i>
                                                </span>
                                                <span style={{ fontSize: "17px" }} className="walletName">
                                                    {this.state.wallet.balance} HYCON
                                                </span><br />
                                                <span style={{ marginLeft: "25px", fontSize: "14px" }} className="walletName">
                                                    pending: {this.state.wallet.pendingAmount} HYCON
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}><br />
                                                <button className="mdl-button flaotLeft copyBtn">
                                                    <CopyToClipboard text={this.state.address} onCopy={() => this.setState({ copied: true })} >
                                                        <span>
                                                            <i className="material-icons">content_copy</i>
                                                        </span>
                                                    </CopyToClipboard>
                                                </button>
                                                <div className="flaotLeft addressDiv">
                                                    {this.state.address}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span className="QRCodeInWalletDetail">
                                    <QRCode size={120} value={this.state.address} />
                                </span>
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>
                <Tabs style={{ paddingTop: "2px" }} inkBarStyle={{ backgroundColor: "#000" }}>
                    <Tab label="Transaction" style={{ backgroundColor: "#FFF", color: "#000" }}>
                        {this.state.pendings.map((tx: ITxProp) => {
                            return (
                                <div key={accountIndex++}>
                                    <TxLine tx={tx} rest={this.state.rest} name={this.state.name} index={this.state.selectedAccount} address={this.state.address} walletType={this.state.walletType} />
                                    {
                                        tx.from === this.state.address ?
                                            (<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent txAmtBtn">-{tx.estimated} HYCON</button>)
                                            :
                                            (<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored txAmtBtn">{tx.amount} HYCON</button>)
                                    }
                                </div>
                            )
                        })}
                        {this.state.txs.map((tx: ITxProp) => {
                            return (
                                <div key={accountIndex++}>
                                    <TxLine tx={tx} rest={this.state.rest} address={this.state.address} />
                                    {tx.from === this.state.address
                                        ? (<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent txAmtBtn">-{tx.estimated} HYCON</button>)
                                        : (<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored txAmtBtn">{tx.amount} HYCON</button>)}
                                </div>
                            )
                        })}
                        {this.state.hasMore && this.state.txs.length > 0
                            ? <div><button className="btn btn-block btn-info" onClick={() => this.fetchNextTxs()}>Load more</button></div> : null}
                    </Tab>
                    <Tab label="Mine Reward" style={{ backgroundColor: "#FFF", color: "#000" }}>
                        <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                            <thead>
                                <tr>
                                    <th className="mdl-data-table__cell--non-numeric">Block Hash</th>
                                    <th className="mdl-data-table__cell--non-numeric">Miner Address</th>
                                    <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Fee Reward</th>
                                    <th className="mdl-data-table__cell--non-numeric">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.minedBlocks.map((minedInfo: IMinedInfo) => {
                                    return <MinedBlockLine key={minedIndex++} minedInfo={minedInfo} />
                                })}
                            </tbody>
                        </table>
                        <br />
                        {this.state.hasMoreMinedInfo && this.state.minedBlocks.length > 0
                            ? <div><button className="btn btn-block btn-info" onClick={() => this.fetchNextMinedInfo()}>Load more</button></div> : null}
                    </Tab>
                </Tabs>
                <Dialog open={this.state.login} onClose={() => { this.setState({ login: false }) }}>
                    <Login address={this.state.address} rest={this.props.rest} cancelDialog={this.cancelDialog.bind(this)} />
                    <Button color="primary" id="modal_cancel" onClick={this.cancelDialog.bind(this)} >Close</Button>
                </Dialog>
                <Dialog open={this.state.showDialog1} onClose={this.closeSelectView.bind(this)} style={{ textAlign: "center" }}>
                    <DialogTitle style={{ color: "grey" }}>Using HD wallets</DialogTitle>
                    {(!this.state.visible ?
                        (
                            <DialogContent>
                                <div style={{ color: "grey" }}>If you want to load HD wallets, Type password here.</div>
                                <TextField type="password" floatingLabelText="Password" floatingLabelFixed={true} autoComplete="off"
                                    value={this.state.password}
                                    name="password"
                                    onChange={this.handleInputChange}
                                    onKeyPress={(event) => { if (event.key === "Enter") { event.preventDefault(); this.setState({ visible: true }) } }}
                                />
                                <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                    <Button color="primary" id="modal_cancel" onClick={() => { this.setState({ visible: true }) }} >Next</Button>
                                </Grid>
                            </DialogContent>
                        )
                        :
                        (<DialogContent style={{ margin: "1%" }}>
                            <div style={{ color: "grey" }}>Please select account to use.</div>
                            <MultipleAccountsView selectFunction={(index: string, account: IHyconWallet) => { this.accountSelected(index, account) }} rest={this.state.rest} password={this.state.password} name={this.state.name} invalidPassword={() => { this.setState({ visible: false }) }} walletType="hdwallet" />
                        </DialogContent>))}
                </Dialog>
            </div >
        )
    }
    private fetchNextTxs() {
        this.state.rest.getNextTxs(this.state.address, this.state.txs[0].hash, this.state.index).then((result: ITxProp[]) => {
            if (result.length === 0) { this.setState({ hasMore: false }) }
            this.setState({
                index: this.state.index + 1,
                txs: update(this.state.txs, { $push: result }),
            })
        })
    }

    private fetchNextMinedInfo() {
        this.state.rest.getMinedBlocks(this.state.address, this.state.minedBlocks[0].blockhash, this.state.minerIndex).then((result: IMinedInfo[]) => {
            if (result.length === 0) { this.setState({ hasMoreMinedInfo: false }) }
            this.setState({
                minedBlocks: update(this.state.minedBlocks, { $push: result }),
                minerIndex: this.state.minerIndex + 1,
            })
        })
    }

    private closeSelectView() {
        if (this.state.address === "") {
            this.setState({ showDialog1: false, redirect: true })
        } else {
            this.setState({ showDialog1: false })
        }
    }
}
