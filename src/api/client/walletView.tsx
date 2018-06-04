import * as React from "react"
import { Link } from "react-router-dom"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { WalletList } from "./walletList"
export class WalletView extends React.Component<any, any> {
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = { rest: props.rest }
    }
    public componentDidMount() {
    }
    public componentWillUnmount() {
    }
    public render() {
        return (
            <div>
                <div className="walletViewBtnDiv">
                    <button className="mdl-button">
                        <Link to="/wallet/addWallet" className="coloredBlack">
                            <i className="material-icons coloredBlack">note_add</i> ADD WALLET</Link>
                    </button>

                    <button className="mdl-button">
                        <Link to="/wallet/recoverWallet" className="coloredBlack">
                            <i className="material-icons ">input</i> RECOVER WALLET</Link>
                    </button>
                </div>
                <div>
                    <WalletList rest={this.state.rest} />
                </div>
            </div>
        )
    }
}
