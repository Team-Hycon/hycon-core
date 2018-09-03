import * as proto from "../serialization/proto"
import { PeerModel } from "./peerModel"

export interface IPeerDatabase {
    putPeers(peers: proto.IPeer[]): Promise<void>
    connecting(host: string, port: number): Promise<void>
    inBoundConnection(host: string, port: number): Promise<void>
    outBoundConnection(host: string, port: number): Promise<void>
    failedToConnect(host: string, port: number): Promise<void>
    disconnect(host: string, port: number): Promise<void>
    getRecentPeers(limit?: number): Promise<proto.IPeer[]>
    getLeastRecentPeer(limit?: number): Promise<proto.IPeer[]>
    getRandomPeer(limit?: number): Promise<proto.IPeer[]>
    get(host: string): Promise<PeerModel>
    getAll(): Promise<PeerModel[]>
}
