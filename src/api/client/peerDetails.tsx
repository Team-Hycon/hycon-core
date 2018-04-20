import GoogleMap from "google-map-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { Marker } from "./marker"
import { PeersLine } from "./peersLine"
import { IPeer, IRest } from "./rest"

interface IPeerDetails {
    hash: string
    rest: IRest
    peer: IPeer
}
export class PeerDetailsView extends React.Component<any, any> {
    public mounted: boolean = false

    constructor(props: any) {
        super(props)
        this.state = {
            center: [59.938043, 30.337157],
            hash: props.hash,
            peer: props.peer,
            rest: props.rest,
            zoom: 4,
        }
    }

    public componentWillUnMount() {
        this.mounted = false
    }
    public componentWillMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getPeerDetails(this.state.hash).then((data: IPeer) => {
            this.state.rest.setLoading(false)
            if (this.mounted) {
                this.setState({ peer: data })
            }
        })
    }

    public render() {
        if (this.state.peer === undefined) {
            return <div />
        }
        return (
            <div className="mdl-grid">
                <table className="mdl-cell mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined tablesInRow txSummaryTable">
                    <thead>
                        <tr>
                            <th
                                colSpan={2}
                                className="mdl-data-table__cell--non-numeric tableHeader_floatLeft"
                            >
                                {this.state.peer.name}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Location</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.location}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Ip</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.ip}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Port</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.port}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="mdl-cell mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined tablesInRow txSummaryTable">
                    <thead>
                        <tr>
                            <th
                                colSpan={2}
                                className="mdl-data-table__cell--non-numeric tableHeader_floatLeft"
                            >
                                Need Title
              </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Is Miner</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.isMiner ? (
                                    <span>Mining</span>
                                ) : (
                                        <span>Not mining</span>
                                    )}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Nodes</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.nodes}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">Last Block</td>
                            <td className="mdl-data-table__cell--non-numeric">
                                <Link to={`/block/${this.state.peer.lastBlock}`}>
                                    {this.state.peer.lastBlock}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">
                                Pending Transactions
              </td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.pendingTransaction}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">
                                Node Latency
              </td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.nodeLatency}
                            </td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">
                                Number of Peers
              </td>
                            <td className="mdl-data-table__cell--non-numeric">
                                {this.state.peer.peersNumber}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ width: "30%", height: "150px", margin: "auto" }}>
                    <GoogleMap
                        bootstrapURLKeys={{
                            key: "AIzaSyAp-2W8_T6dZjq71yOhxW1kRkbY6E1iyuk",
                        }}
                        defaultCenter={this.state.center}
                        defaultZoom={this.state.zoom}
                    >
                        <Marker
                            className="marker"
                            lat={59.955413}
                            lng={30.337844}
                            text={"Hello"}
                        />
                    </GoogleMap>
                </div>
            </div>
        )
    }
}
