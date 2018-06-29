import { PeerDatabase } from "../src/network/peerDatabase"
import * as proto from "../src/serialization/proto"
import { ENGINE_METHOD_PKEY_ASN1_METHS } from "constants";

describe("peerDatabase test", () => {
    let dbPeer: PeerDatabase
    let res: Boolean
    let peer1: proto.IPeer
    let peer2: proto.IPeer
    let peers: proto.IPeer[]

    beforeEach(async () => {
        dbPeer = new PeerDatabase()
        res = await dbPeer.init()
        peer1 = {
            host: '192.168.1.100',
            port: 8888,
        }
        peer2 = {
            host: '888.888.888.888',
            port: 10001,
        }
        peers = [
            {
                host: '192.168.100.2',
                port: 1234
            },
            {
                host: '192.168.100.3',
                port: 2345
            },
            {
                host: '192.168.100.4',
                port: 3456
            },
            {
                host: '192.168.100.5',
                port: 4567
            }
        ]
    })

    afterEach(() => {
        dbPeer.close()
    })


    it("constructor(): init db object, and should return db object if sucessful", () => {
        expect(dbPeer).toBeDefined()
    })

    it("init(): init db table, and return true if successful", () => {
        expect(res).toBeTruthy()
    })

    it("put(): if there is peer record at db, update the peer record, otherwise insert the peer record into table. It should return the peer or undefined if peer port exceeds 10000", async () => {
        const peer = await dbPeer.put(peer1)
        const peer_ = await dbPeer.put(peer2)
        expect(peer).toEqual(peer1)
        expect(peer_).toBeUndefined()
    })

    it("putPeers(): put multiple peers, should return true if it is successful", async () => {
        expect(await dbPeer.putPeers(peers)).toBeTruthy()
    })

    it("seen(): lastSeen and failCount property of peer should be updated if it is successful", async () => {
        const peer = await dbPeer.seen(peer1)
        expect(peer.failCount).toEqual(0)
        expect(peer.lastSeen).not.toBeUndefined()
    })

    it("fail(): lastAttempt and failCount property of peer should be updated if it is successful", async () => {
        await dbPeer.put(peer1)
        const peer = await dbPeer.fail(peer1, 10)
        expect(peer.failCount).not.toEqual(0)
        expect(peer.lastAttempt).not.toBeUndefined()
    })

    it("get(): should return the peer if it exist otherwise return undefine", async () => {
        await dbPeer.put(peer1)
        const key = PeerDatabase.ipeer2key(peer1)
        const key_not_exist = PeerDatabase.ipeer2key(peer2)
        const res = await dbPeer.get(key)
        const res_not_exist = await dbPeer.get(key_not_exist)
        expect(res.host).toEqual(peer1.host)
        expect(res.port).toEqual(peer1.port)
        expect(res_not_exist).toBeUndefined()
    })

    it("remove(): return true if remove peer successful", async () => {
        const peer = await dbPeer.put(peer1)
        res = await dbPeer.remove(peer)
        expect(res).toBeTruthy()
    })

    it("getRandomPeer(): should return a random peer or undefine if there is no peers except for peers been connected", async () => {
        await dbPeer.putPeers(peers)
        const exception = [peers[0], peers[1]]
        const peer = await dbPeer.getRandomPeer(exception)
        expect(peer).not.toBeUndefined()
    })

    it("getKeys(): should return all key of peers in db", async () => {
        await dbPeer.putPeers(peers)
        const res = await dbPeer.getKeys()
        expect(res).not.toBeUndefined()
    })
})
