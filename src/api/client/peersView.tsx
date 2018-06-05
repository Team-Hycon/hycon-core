import GoogleMap from "google-map-react"
import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { Marker } from "./marker"
import { PeersLine } from "./peersLine"
import { PeersList } from "./peersList"
import { ILocationDetails, IPeer, IRest } from "./rest"

interface IPeersProps {
    rest: IRest
    peer: IPeer
}

// // tslint:disable-next-line:no-var-requires
// const googleMapsClient = require("@google/maps").createClient({
//     key: "AIzaSyAp-2W8_T6dZjq71yOhxW1kRkbY6E1iyuk",
// })

export class PeersView extends React.Component<any, any> {
    public mounted: boolean = false
    public count: number = 0
    constructor(props: any) {
        super(props)
        this.state = {
            center: [37.4951, 127.0628],
            index: 0,
            length: 0,
            peerCon: [],
            rest: props.rest,
            zoom: 0,
        }
        this.handlePageClick = this.handlePageClick.bind(this)
    }
    public componentWillUnMount() {
        this.mounted = false
    }
    public componentDidMount() {
        // this.mounted = true
        // this.state.rest.setLoading(true)
        // this.state.rest.getPeerList().then((data: IPeer[]) => {
        //     this.state.rest.setLoading(false)
        //     if (this.mounted) {
        //         this.setState({ peer: data })
        //     }
        // })
        // this.state.rest.getPeerConnected().then((data: IPeer[]) => {
        //     this.state.rest.setLoading(false)
        //     if (this.mounted) {
        //         this.setState({ peerCon: data })
        //     }
        // })
        this.getRecentPeerList(this.state.index)
    }

    public getRecentPeerList(index: number) {
        this.state.rest.getPeerConnected(index).then((data: { peersInPage: IPeer[], pages: number }) => {
            this.setState({
                peerCon: update(
                    this.state.peerCon, {
                        $splice: [[0, this.state.peerCon.length]],
                    },
                ),
            })
            this.setState({
                index: update(
                    this.state.index, {
                        $set: index,
                    },
                ),
                length: update(
                    this.state.length, {
                        $set: data.pages,
                    },
                ),
                peerCon: update(
                    this.state.peerCon, {
                        $push: data.peersInPage,
                    },
                ),
            })

        })
    }
    public render() {
        if (this.state.peerCon === undefined) {
            return <div className="contentTitle">Loading...</div>
        }
        return (
            <div>
                {/* <div className="contentTitle">Peers List</div>
                <div>
                    <PeersList rest={this.state.rest} peer={this.state.peer} />
                </div> */}
                <div className="contentTitle">
                    Peers Connected
                    <span className="seeMoreLink">
                        <ReactPaginate previousLabel={"PREV"}
                            nextLabel={"NEXT"}
                            breakLabel={<a>...</a>}
                            breakClassName={"break-me"}
                            pageCount={this.state.length}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={9}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            initialPage={this.state.index}
                            disableInitialCallback={true}
                        />
                    </span>
                </div>
                <div>
                    <PeersList rest={this.state.rest} peer={this.state.peerCon} />
                </div>

                {/* <div style={{ width: "90%", height: "400px", margin: "auto" }}>
                    <GoogleMap
                        bootstrapURLKeys={{
                            key: "AIzaSyAp-2W8_T6dZjq71yOhxW1kRkbY6E1iyuk",
                        }}
                        defaultCenter={this.state.center}
                        defaultZoom={this.state.zoom}
                    >
                        {this.state.peer.map((peer: IPeer) => {
                            return (
                                <Marker
                                    key={this.count++}
                                    className="marker"
                                    lat={peer.latitude}
                                    lng={peer.longitude}
                                    text={"0"}
                                />
                            )
                        })}
                    </GoogleMap>
                </div> */}
            </div>
        )
    }
    private handlePageClick = (data: any) => {
        this.getRecentPeerList(data.selected)
    }
}
