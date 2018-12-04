import * as React from "react"
import { IPeer } from "./rest"
import { RestClient } from "./restClient"

interface IPeersLineView {
    rest: RestClient
    peer: IPeer
}

export class PeersLine extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { peer: props.peer, rest: props.rest }
    }

    public render() {
        return (
            <tr>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.host}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.port}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>
                        <div className={`led-${this.state.peer.active > 1 ? "green" : (this.state.peer.active ? "orange" : "red")}`}> </div>
                    </span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.successCount}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.failCount}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.lastSeen}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.lastAttempt}</span>
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    <span>{this.state.peer.currentQueue}</span>
                </td>
            </tr>
        )
    }
}
