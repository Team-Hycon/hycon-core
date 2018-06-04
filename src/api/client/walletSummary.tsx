import Avatar from "material-ui/Avatar"
import { ListItem } from "material-ui/List"
import * as React from "react"
import { Link } from "react-router-dom"
import { IHyconWallet, IRest } from "./rest"
interface IWalletSummaryView {
    wallet: IHyconWallet
    rest: IRest
}
export class WalletSummary extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { wallet: props.wallet, rest: props.rest }
    }
    public componentDidMount() { }
    public componentWillUnmount() { }
    public render() {
        if (this.state.wallet.address === undefined) {
            return < div ></div >
        }
        return (
            <div>
                <Link to={`/wallet/detail/${this.state.wallet.name}`}>
                    <ListItem style={{ width: "23em" }}
                        leftAvatar={<Avatar icon={<i className="material-icons walletIcon_white">
                            account_balance_wallet</i>} />}
                        primaryText={this.state.wallet.name}
                        secondaryText={this.state.wallet.address}
                    />
                </Link>
            </div >
        )
    }
}
