import * as proto from "../serialization/proto"
import { IPeer } from "./ipeer"
import { RabbitPeer } from "./rabbit/rabbitPeer"
export interface INetwork {
    version: number
    start(): Promise<boolean>
    getRandomPeer(): IPeer
    getRandomPeers(count: number): IPeer[]
    connect(ip: string, port: number): Promise<IPeer>
    getPeerDb(): Promise<proto.IPeer[]>
    getConnection(): Promise<proto.IPeer[]>
    getConnectionCount(): number
    getIPeers(exempt: RabbitPeer): proto.IPeer[]
    getPeers(): IPeer[]
    broadcastBlocks(block: proto.IBlock[]): void
    broadcastTxs(tx: proto.ITx[]): void
    addPeer(ip: string, port: number): Promise<void>
}
