import * as React from "react"
import { Link } from "react-router-dom"
import { IRest, ITxProp } from "./rest"
import { TxLine } from "./txLine"
interface ITxListView {
    rest: IRest
    txs: ITxProp[]
}
export class TxList extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { txs: props.txs, rest: props.rest }
    }
    public render() {
        let txIndex = 0
        return (
            <div>
                <div className="contentTitle">Transactions</div>
                {this.state.txs.map((tx: ITxProp) => {
                    return (
                        <div key={txIndex++}>
                            <TxLine tx={tx} rest={this.state.rest} />
                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored txAmtBtn green">
                                {tx.estimated + " HYCON"}
                            </button>
                        </div>
                    )
                })}
            </div>
        )
    }
}
