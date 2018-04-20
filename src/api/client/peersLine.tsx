import * as React from "react"
import { Link } from "react-router-dom"
import { IPeer, IRest } from "./rest"

interface IPeersLineView {
    rest: IRest
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
                {this.state.peer.active ? (
                    <td className="mdl-data-table__cell--non-numeric">
                        <span>
                            <div className="led-green"> </div>
                        </span>
                    </td>
                ) : (
                        <td className="mdl-data-table__cell--non-numeric">
                            <span>
                                <div className="led-red"> </div>
                            </span>
                        </td>
                    )
                }
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
