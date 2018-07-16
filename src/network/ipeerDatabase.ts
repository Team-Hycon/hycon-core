import * as proto from "../serialization/proto"

export interface IPeerDatabase {

    put(peer: proto.IPeer): Promise<proto.IPeer>
    putPeers(peers: proto.IPeer[]): Promise<boolean>
    seen(peer: proto.IPeer): Promise<proto.IPeer>

    fail(peer: proto.IPeer, limit: number): Promise<proto.IPeer>

    get(key: number, db?: any): Promise<proto.IPeer>
    getRandomPeer(exemptions: proto.IPeer[]): Promise<proto.IPeer>

    remove(peer: proto.IPeer, db?: any): Promise<boolean>

    peerCount(): Promise<number>
    getKeys(): Promise<number[]>

}
