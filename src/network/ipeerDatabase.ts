import * as proto from "../serialization/proto"

export interface IPeerDatabase {

    getKeys(): Promise<number[]>
    seen(peer: proto.IPeer): Promise<proto.IPeer>

    fail(peer: proto.IPeer, limit: number): Promise<proto.IPeer | undefined>

    put(peer: proto.IPeer): Promise<proto.IPeer | undefined>

    get(key: number): Promise<proto.IPeer | undefined>

    remove(peer: proto.IPeer): Promise<any>

    peerCount(): Promise<number | undefined>

    getRandomPeer(exemptions: proto.IPeer[]): Promise<proto.IPeer | undefined>

    printDB(): Promise<void>

}
