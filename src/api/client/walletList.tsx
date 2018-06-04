import { List } from "material-ui/List"
import * as React from "react"
import { Link } from "react-router-dom"
import { IHyconWallet, IRest } from "./rest"
import { WalletSummary } from "./walletSummary"
interface IWalletListView {
    rest: IRest
    wallets: IHyconWallet[]
}
export class WalletList extends React.Component<any, any> {
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = { wallets: [], rest: props.rest }
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getWalletList().then((data: IHyconWallet[]) => {
            if (this.mounted) {
                this.setState({ wallets: data })
            }
            this.state.rest.setLoading(false)
        })
    }
    public render() {
        let index = 0
        if (this.state.wallets.length === 0) {
            return < div ></div >
        }
        return (
            <div>
                <div className="contentTitle noMarginTitle">Wallet List</div>
                <List>
                    {this.state.wallets.map((wallet: IHyconWallet) => {
                        return (
                            <WalletSummary
                                key={index++}
                                wallet={wallet}
                                res={this.state.rest}
                            />
                        )
                    })}
                </List>
            </div>
        )
    }
}
