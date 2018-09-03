import { CardContent, Icon } from "@material-ui/core"
import { Card } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { MultipleAccountsView } from "./multipleAccountsView"
import { IHyconWallet } from "./rest"
export class HardwareWalletView extends React.Component<any, any> {
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = {
            hasMore: true,
            hasMoreMinedInfo: true,
            index: 1,
            isAddressView: false,
            minedBlocks: [],
            minerIndex: 1,
            rest: props.rest,
            selectedAccount: "",
            txs: [],
            walletType: props.walletType,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }

    public componentDidMount() {
        this.mounted = true
        this.props.rest.setLoading(true)
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
    }

    public transfer() {
        this.setState({ isTransfer: true })
    }

    public selectFunction(index: string, account: IHyconWallet) {
        this.setState({ address: account.address, selectedAccount: index, isAddressView: true })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        if (this.state.isAddressView) {
            return <Redirect to={`/address/${this.state.address}/${this.state.walletType}/${this.state.selectedAccount}`} />
        }
        return (
            <div>
                <div style={{ width: "80%", margin: "auto" }}>
                    <Card>
                        <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ marginRight: "10px", color: "grey" }}>account_balance_wallet</Icon>Select wallet to view</h3><br />
                        <CardContent style={{ display: `${this.state.txStep ? ("none") : ("block")}` }}>
                            {this.state.walletType === "ledger" ? (
                                <MultipleAccountsView selectFunction={(index: string, account: IHyconWallet) => { this.selectFunction(index, account) }} rest={this.state.rest} selectedAccount={this.state.selectedAccount} walletType="ledger" />
                            ) : (
                                    <MultipleAccountsView selectFunction={(index: string, account: IHyconWallet) => { this.selectFunction(index, account) }} rest={this.state.rest} selectedAccount={this.state.selectedAccount} walletType="bitbox" />
                                )}
                        </CardContent>
                    </Card >
                </div >
            </div >
        )

    }
}
