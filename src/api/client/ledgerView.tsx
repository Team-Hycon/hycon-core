import { CardContent, Icon } from "@material-ui/core"
import { Card } from "material-ui"
import * as React from "react"
import { Redirect } from "react-router"
import { MultipleLedgerView } from "./multipleLedgerView"
import { IHyconWallet } from "./rest"
export class LedgerView extends React.Component<any, any> {
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
            selectedLedger: "",
            txs: [],
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

    public selectedLedgerFunction(index: string, account: IHyconWallet) {
        this.setState({ address: account.address, selectedLedger: index, isAddressView: true })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to="/wallet" />
        }
        if (this.state.isAddressView) {
            return <Redirect to={`/address/${this.state.address}/${this.state.selectedLedger}`} />
        }
        return (
            <div>
                <div style={{ width: "80%", margin: "auto" }}>
                    <Card>
                        <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ marginRight: "10px", color: "grey" }}>account_balance_wallet</Icon>Select wallet to view</h3><br />
                        <CardContent style={{ display: `${this.state.txStep ? ("none") : ("block")}` }}>
                            <MultipleLedgerView isLedgerPossibility={true} selectFunction={(index: string, account: IHyconWallet) => { this.selectedLedgerFunction(index, account) }} rest={this.state.rest} selectedLedger={this.state.selectedLedger} />
                        </CardContent>
                    </Card >
                </div >
            </div >
        )

    }
}
