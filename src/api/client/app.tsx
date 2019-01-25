import * as React from "react"
import { RouteComponentProps } from "react-router"
import { RouteConfig } from "react-router-config"
import { Link, Route, Switch } from "react-router-dom"

import { AddressInfo } from "./addressInfo"
import { BlockView } from "./blockView"
import { Home } from "./home"
import { MakeTransaction } from "./makeTransaction"
import { PeersView } from "./peersView"
import { Transaction } from "./transaction"
import { TxPoolList } from "./txPoolList"
import { TxView } from "./txView"

import { AddWallet } from "./addWallet"
import { HardwareWalletView } from "./hardwareWalletView"
import { MinerView } from "./minerView"
import { RecoverWallet } from "./recoverWallet"
import { RestClient } from "./restClient"
import { WalletDetail } from "./walletDetail"
import { WalletView } from "./walletView"

export const routes: RouteConfig[] = [
    { exact: true, path: "/" },
    { exact: true, path: "/tx/:hash" },
    { exact: true, path: "/block/:hash" },
    { exact: true, path: "/txPool" },
    { exact: true, path: "/address/:hash" },
    { exact: true, path: "/wallet" },
    { exact: true, path: "/wallet/addWallet" },
    { exact: true, path: "/wallet/recoverWallet" },
    { exact: true, path: "/wallet/detail/:name" },
    { exact: true, path: "/transaction/:name" },
    { exact: true, path: "/transaction/:name/:nonce" },
    { exact: true, path: "/maketransaction/:walletType" },
    { exact: true, path: "/maketransactionIndex/:walletType/:selectedAccount" },
    { exact: true, path: "/maketransactionIndex/:walletType/:selectedAccount/:nonce" },
    { exact: true, path: "/maketransactionAddress/:walletType/:address/:selectedAccount" },
    { exact: true, path: "/maketransactionAddress/:walletType/:address/:selectedAccount/:nonce" },
    { exact: true, path: "/maketransactionHDWallet/:walletType/:name/:address/:selectedAccount" },
    { exact: true, path: "/maketransactionHDWallet/:walletType/:name/:address/:selectedAccount/:nonce" },
    { exact: true, path: "/peersView" },
    { exact: true, path: "/minerView" },
    { exact: true, path: "/hardwareWallet/:walletType" },
    { exact: true, path: "/address/:hash/:walletType/:selectedAccount" },
    { exact: true, path: "/address/:hash/:walletType/:name/:selectedAccount" },
    // { exact: true, path: "/peer/:hash" },
]

// tslint:disable:no-shadowed-variable
export class App extends React.Component<{ rest: RestClient }, any> {
    public rest: RestClient
    public blockView: ({ match }: RouteComponentProps<{ hash: string }>) => JSX.Element
    public home: ({ match }: RouteComponentProps<{}>) => JSX.Element
    public addressInfo: ({ match }: RouteComponentProps<{ hash: string }>) => JSX.Element
    public txView: ({ match }: RouteComponentProps<{ hash: string }>) => JSX.Element
    public txPool: ({ match }: RouteComponentProps<{}>) => JSX.Element

    public transaction: ({ match }: RouteComponentProps<{ name: string, nonce: string }>) => JSX.Element
    public maketransaction: ({ match }: RouteComponentProps<{ walletType: string, nonce: string }>) => JSX.Element
    public maketransactionIndex: ({ match }: RouteComponentProps<{ walletType: string, address: string, selectedAccount: string, nonce: string }>) => JSX.Element
    public maketransactionHDWallet: ({ match }: RouteComponentProps<{ walletType: string, name: string, address: string, selectedAccount: string, nonce: string }>) => JSX.Element
    public peersView: ({ match }: RouteComponentProps<{}>) => JSX.Element

    public wallet: ({ match }: RouteComponentProps<{}>) => JSX.Element
    public addWallet: ({ match }: RouteComponentProps<{}>) => JSX.Element
    public recoverWallet: ({ match }: RouteComponentProps<{}>) => JSX.Element
    public walletDetail: ({ match }: RouteComponentProps<{ name: string }>) => JSX.Element
    public minerView: ({ match }: RouteComponentProps<{ name: string }>) => JSX.Element
    public hardwareWalletView: ({ match }: RouteComponentProps<{ walletType: string }>) => JSX.Element
    public hardwareAddressView: ({ match }: RouteComponentProps<{ walletType: string, hash: string, selectedAccount: string }>) => JSX.Element
    public hdwalletAddressView: ({ match }: RouteComponentProps<{ walletType: string, hash: string, name: string, selectedAccount: string }>) => JSX.Element
    public notFound: boolean

    constructor(props: any) {
        super(props)
        this.state = {
            block: "block",
            isParity: false,
            loading: false,
            name: "BlockExplorer",
            tx: "Tx 1",
        }
        this.rest = props.rest
        this.rest.loadingListener((loading: boolean) => {
            this.state = ({ loading })
        })
        this.blockView = ({ match }: RouteComponentProps<{ hash: string }>) => (
            <BlockView hash={match.params.hash} rest={this.rest} notFound={this.notFound} />
        )
        this.home = ({ match }: RouteComponentProps<{}>) => (
            <Home rest={props.rest} />
        )
        this.addressInfo = ({ match }: RouteComponentProps<{ hash: string }>) => (
            <AddressInfo hash={match.params.hash} rest={this.rest} />
        )
        this.txView = ({ match }: RouteComponentProps<{ hash: string }>) => (
            <TxView hash={match.params.hash} rest={this.rest} />
        )
        this.txPool = ({ match }: RouteComponentProps<{}>) => (
            <TxPoolList rest={this.rest} />
        )
        this.transaction = ({ match }: RouteComponentProps<{ name: string, nonce: string }>) => (
            <Transaction name={match.params.name} rest={this.rest} nonce={match.params.nonce} />
        )
        this.maketransaction = ({ match }: RouteComponentProps<{ walletType: string, nonce: string }>) => (
            <MakeTransaction walletType={match.params.walletType} rest={this.rest} nonce={match.params.nonce} />
        )
        this.maketransactionIndex = ({ match }: RouteComponentProps<{ walletType: string, address: string, selectedAccount: string, nonce: string }>) => (
            <MakeTransaction walletType={match.params.walletType} rest={this.rest} address={match.params.address} selectedAccount={match.params.selectedAccount} nonce={match.params.nonce} />
        )
        this.maketransactionHDWallet = ({ match }: RouteComponentProps<{ walletType: string, name: string, address: string, selectedAccount: string, nonce: string }>) => (
            <MakeTransaction rest={this.rest} walletType={match.params.walletType} name={match.params.name} address={match.params.address} selectedAccount={match.params.selectedAccount} nonce={match.params.nonce} />
        )
        this.peersView = ({ match }: RouteComponentProps<{}>) => (
            <PeersView rest={props.rest} />
        )

        this.wallet = ({ match }: RouteComponentProps<{}>) => (
            <WalletView rest={props.rest} />
        )
        this.addWallet = ({ match }: RouteComponentProps<{}>) => (
            <AddWallet rest={props.rest} />
        )
        this.recoverWallet = ({ match }: RouteComponentProps<{}>) => (
            <RecoverWallet rest={props.rest} />
        )
        this.walletDetail = ({ match }: RouteComponentProps<{ name: string }>) => (
            <WalletDetail name={match.params.name} rest={this.rest} notFound={this.notFound} />
        )

        this.minerView = ({ match }: RouteComponentProps<{}>) => (
            <MinerView rest={this.rest} />
        )

        this.hardwareWalletView = ({ match }: RouteComponentProps<{ walletType: string }>) => (
            <HardwareWalletView rest={this.rest} walletType={match.params.walletType} />
        )
        this.hardwareAddressView = ({ match }: RouteComponentProps<{ walletType: string, hash: string, selectedAccount: string }>) => (
            <AddressInfo hash={match.params.hash} walletType={match.params.walletType} rest={this.rest} selectedAccount={match.params.selectedAccount} />
        )
        this.hdwalletAddressView = ({ match }: RouteComponentProps<{ walletType: string, hash: string, name: string, selectedAccount: string }>) => (
            <AddressInfo hash={match.params.hash} walletType={match.params.walletType} rest={this.rest} name={match.params.name} selectedAccount={match.params.selectedAccount} />
        )
    }
    public render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header" >
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">Hycon Blockexplorer</span>
                        <div className="mdl-layout-spacer" />
                        <nav className="mdl-navigation">
                            <Link className="mdl-navigation__link navMargin" to="/">Home</Link>
                            {/* <Link className="mdl-navigation__link" to="/block">Block</Link> */}
                            <Link className="mdl-navigation__link" to="/txPool">Tx</Link>
                            <Link className="mdl-navigation__link" to="/wallet">Wallet</Link>
                            <Link className="mdl-navigation__link" to="/peersView">Peers List</Link>
                            <Link className="mdl-navigation__link" to="/minerView">Miner</Link>
                        </nav>
                    </div>
                    <div className={`mdl-progress mdl-js-progress mdl-progress__indeterminate progressBar ${this.state.loading ? "" : "hide"}`} />
                </header>
                <main className="mdl-layout__content main">
                    <div className="page-content">
                        <Switch>
                            {/* <Route exact path='/' component={() => { return <Home name={this.state.name} /> }} /> */}
                            <Route exact path="/" component={this.home} />
                            <Route exact path="/tx/:hash" component={this.txView} />
                            <Route exact path="/block/:hash" component={this.blockView} />
                            <Route exact path="/txPool" component={this.txPool} />
                            <Route exact path="/address/:hash" component={this.addressInfo} />
                            <Route exact path="/transaction/:name" component={this.transaction} />
                            <Route exact path="/transaction/:name/:nonce" component={this.transaction} />
                            <Route exact path="/maketransaction/:walletType" component={this.maketransaction} />
                            <Route exact path="/maketransactionIndex/:walletType/:selectedAccount" component={this.maketransactionIndex} />
                            <Route exact path="/maketransactionIndex/:walletType/:selectedAccount/:nonce" component={this.maketransactionIndex} />
                            <Route exact path="/maketransactionAddress/:walletType/:address/:selectedAccount" component={this.maketransactionIndex} />
                            <Route exact path="/maketransactionAddress/:walletType/:address/:selectedAccount/:nonce" component={this.maketransactionIndex} />
                            <Route exact path="/maketransactionHDwallet/:walletType/:name/:address/:selectedAccount" component={this.maketransactionHDWallet} />
                            <Route exact path="/maketransactionHDwallet/:walletType/:name/:address/:selectedAccount/:nonce" component={this.maketransactionHDWallet} />
                            <Route exact path="/wallet/addWallet" component={this.addWallet} />
                            <Route exact path="/wallet" component={this.wallet} />
                            <Route exact path="/wallet/recoverWallet" component={this.recoverWallet} />
                            <Route exact path="/wallet/detail/:name" component={this.walletDetail} />
                            <Route exact path="/peersView" component={this.peersView} />
                            <Route exact path="/minerView" component={this.minerView} />
                            <Route exact path="/hardwareWallet/:walletType" component={this.hardwareWalletView} />
                            <Route exact path="/address/:hash/:walletType/:selectedAccount" component={this.hardwareAddressView} />
                            <Route exact path="/address/:hash/:walletType/:name/:selectedAccount" component={this.hdwalletAddressView} />
                        </Switch>
                    </div>
                </main>
            </div>
        )
    }
}
