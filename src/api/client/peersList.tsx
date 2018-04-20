import * as React from "react"
import { Link } from "react-router-dom"
import { PeersLine } from "./peersLine"
import { IPeer, IRest } from "./rest"

interface IPeerListView {
    rest: IRest
    peers: IPeer[]
}
export class PeersList extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { peers: props.peer, rest: props.rest }
    }
    public render() {
        let count = 0
        if (this.props.peer === undefined) {
            return (
                <div />
            )
        } else {
            return (
                <div>
                    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>Host</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>Port</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>isActive</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>FailCount</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>LastSeen</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>LastAttempt</span>
                                </th>
                                <th className="mdl-data-table__cell--non-numeric">
                                    <span>currentQueue</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.peer.map((peer: IPeer) => {
                                return (
                                    <PeersLine key={count++} peer={peer} rest={this.state.rest} />
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }

    }
}
