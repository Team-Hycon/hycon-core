import Avatar from "material-ui/Avatar"
import { ListItem } from "material-ui/List"
import * as React from "react"
import { Link } from "react-router-dom"
import { IHyconWallet, IRest } from "./rest"
interface IWalletSummaryProps {
    wallet: IHyconWallet
    rest: IRest
    key: number
}
interface IWalletSummaryView {
    wallet: IHyconWallet
    rest: IRest
    secondaryText: string
    isHDWallet: boolean
}
export class WalletSummary extends React.Component<IWalletSummaryProps, IWalletSummaryView> {
    constructor(props: IWalletSummaryProps) {
        super(props)
        this.state = {
            isHDWallet: props.wallet.address ? false : true,
            rest: props.rest,
            secondaryText: props.wallet.address ? props.wallet.address : "HD Wallet. Click this wallet to use.",
            wallet: props.wallet,
        }
    }

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
                        secondaryText={this.state.secondaryText}
                    />
                </Link>
            </div >
        )
    }
}
