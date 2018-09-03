import * as proto from "../serialization/proto"
import { IPeer } from "./ipeer"
import { PeerModel } from "./peerModel"
import { RabbitPeer } from "./rabbit/rabbitPeer"
export interface INetwork {
    version: number
    start(): Promise<boolean>
    getRandomPeer(): IPeer
    connect(ip: string, port: number): Promise<IPeer>
    getPeerDb(): Promise<PeerModel[]>
    getConnection(): Promise<PeerModel[]>
    getConnectionCount(): number
    getIPeers(exempt: RabbitPeer): proto.IPeer[]
    getPeers(): IPeer[]
    broadcastBlocks(block: proto.IBlock[]): void
    broadcastTxs(tx: proto.ITx[]): void
    addPeer(ip: string, port: number): Promise<void>
}
