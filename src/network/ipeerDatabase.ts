import * as proto from "../serialization/proto"

export interface IPeerDatabase {
    putPeers(peers: proto.IPeer[]): Promise<void>
    seen(peer: proto.IPeer): Promise<proto.IPeer>
    fail(peer: proto.IPeer): Promise<proto.IPeer>
    deactivate(key: number): Promise<void>
    getRandomPeer(): Promise<proto.IPeer>
    get(key: number): Promise<proto.IPeer>
    getKeys(): Promise<number[]>
}
