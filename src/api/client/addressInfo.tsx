import { Tab, Tabs } from "material-ui/Tabs"
import * as QRCode from "qrcode.react"
import * as React from "react"
import update = require("react-addons-update")
import { Redirect } from "react-router"
import { MinedBlockLine } from "./minedBlockLine"
import { IMinedInfo, IRest, ITxProp, IWalletAddress } from "./rest"
import { TxLine } from "./txLine"
interface IAddressProps {
    rest: IRest
    hash: string
    name?: string
    selectedAccount?: string
    walletType?: string
}
interface IAddressView {
    rest: IRest
    redirectTxView: boolean
    hash: string
    txs: ITxProp[],
    pendings: ITxProp[],
    hasMore: boolean,
    hasMoreMinedInfo: boolean,
    index: number,
    minedBlocks: IMinedInfo[],
    minerIndex: number,
    name: string,
    address?: IWalletAddress
    accountIndex?: string
    walletType?: string
}
export class AddressInfo extends React.Component<IAddressProps, IAddressView> {
    public mounted: boolean = false
    constructor(props: IAddressProps) {
        super(props)
        this.state = {
            accountIndex: props.selectedAccount,
            hasMore: true,
            hasMoreMinedInfo: true,
            hash: props.hash,
            index: 1,
            minedBlocks: [],
            minerIndex: 1,
            name: props.name ? props.name : "",
            pendings: [],
            redirectTxView: false,
            rest: props.rest,
            txs: [],
            walletType: props.walletType,
        }
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getAddressInfo(this.state.hash).then((data: IWalletAddress) => {
            if (this.mounted) {
                this.setState({ address: data, minedBlocks: data.minedBlocks, pendings: data.pendings, txs: data.txs })
                switch (this.state.walletType) {
                    case "ledger": this.setState({ name: "Ledger Wallet" }); break
                    case "bitbox": this.setState({ name: "Bitbox Wallet" }); break
                }
            }
            this.state.rest.setLoading(false)
        })
    }
    public makeTransaction() {
        this.setState({ redirectTxView: true })
    }
    public render() {
        if (this.state.address === undefined) {
            return < div ></div >
        }
        if (this.state.redirectTxView) {
            if (this.state.walletType === "hdwallet") {
                return <Redirect to={`/maketransactionHDWallet/hdwallet/${this.state.name}/${this.state.hash}/${this.state.accountIndex}`} />
            }
            return <Redirect to={`/maketransactionAddress/${this.state.walletType}/${this.state.hash}/${this.state.accountIndex}`} />
        }
        let count = 0
        let minedIndex = 0
        return (
            <div>
                <button onClick={() => { this.makeTransaction() }} className="mdl-button" style={{ display: `${this.state.accountIndex === undefined ? ("none") : ("block")}`, float: "right" }}>
                    <i className="material-icons">send</i>TRANSFER</button>
                {(this.state.accountIndex === undefined) ? (<div className="contentTitle">Hycon Address</div>) : (<div className="contentTitle">{this.state.name}</div>)}
                <div className="sumTablesDiv">
                    <table className="tablesInRow twoTablesInRow">
                        <thead>
                            <tr>
                                <th colSpan={2} className="tableBorder_Header tableHeader_floatLeft">Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="tdSubTitle subTitle_width20">Address</td>
                                <td>{this.state.hash}</td>
                            </tr>
                            <tr>
                                <td className="tdSubTitle subTitle_width40">Final balance</td>
                                <td>{this.state.address.balance}</td>
                            </tr>
                        </tbody>
                    </table>
                    <span className="QRSpan">
                        <QRCode size={170} value={this.state.hash} />
                    </span>
                </div>
                <Tabs style={{ paddingTop: "2px" }} inkBarStyle={{ backgroundColor: "#000" }}>
                    <Tab label="Transaction" style={{ backgroundColor: "#FFF", color: "#000" }}>
                        {this.state.pendings.map((tx: ITxProp) => {
                            return (
                                <div key={count++}>
                                    <TxLine tx={tx} rest={this.state.rest} index={this.state.accountIndex} address={this.state.hash} walletType={this.state.walletType} name={this.state.name} />
                                    <div>
                                        {tx.from === this.state.hash ? (
                                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent txAmtBtn">
                                                -{tx.amount} HYCON
                                            </button>
                                        ) : (
                                                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored txAmtBtn">
                                                    {tx.amount} HYCON
                                            </button>
                                            )}
                                    </div>
                                </div>
                            )
                        })}
                        {this.state.txs.map((tx: ITxProp) => {
                            return (
                                <div key={count++}>
                                    <TxLine tx={tx} rest={this.state.rest} address={this.state.hash} />
                                    <div>
                                        {tx.from === this.state.hash ? (
                                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent txAmtBtn">
                                                -{tx.amount} HYCON
                                            </button>
                                        ) : (
                                                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored txAmtBtn">
                                                    {tx.amount} HYCON
                                            </button>
                                            )}
                                    </div>
                                </div>
                            )
                        })}
                        {this.state.hasMore && this.state.txs.length > 0 ?
                            (<div><button className="btn btn-block btn-info" onClick={() => this.fetchNextTxs()}>Load more</button></div>)
                            :
                            (<div></div>)}
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
                        {this.state.hasMoreMinedInfo && this.state.minedBlocks.length > 0 ?
                            (<div><button className="btn btn-block btn-info" onClick={() => this.fetchNextMinedInfo()}>Load more</button></div>)
                            :
                            (<div></div>)}
                    </Tab>
                </Tabs>
            </div>
        )
    }
    private fetchNextTxs() {
        this.state.rest.getNextTxs(this.state.hash, this.state.txs[0].hash, this.state.index).then((result: ITxProp[]) => {
            if (result.length === 0) { this.setState({ hasMore: false }) }
            this.setState({
                index: this.state.index + 1,
                txs: update(this.state.txs, { $push: result }),
            })
        })
    }

    private fetchNextMinedInfo() {
        this.state.rest.getMinedBlocks(this.state.hash, this.state.minedBlocks[0].blockhash, this.state.minerIndex).then((result: IMinedInfo[]) => {
            if (result.length === 0) { this.setState({ hasMoreMinedInfo: false }) }
            this.setState({
                minedBlocks: update(this.state.minedBlocks, { $push: result }),
                minerIndex: this.state.minerIndex + 1,
            })
        })
    }
}
