import { PeerDatabase } from "../src/network/peerDatabase"
import * as proto from "../src/serialization/proto"

describe("peerDatabase test", () => {
    let dbPeer: PeerDatabase
    let peerGood: proto.IPeer
    let peerBad: proto.IPeer
    let peers: proto.IPeer[]
    let errInit: Error

    beforeAll(async () => {
        try {
            dbPeer = new PeerDatabase(undefined, "peerdb")
            await dbPeer.init()
            await dbPeer.removeAll()
            peerGood = {
                host: "192.168.1.100",
                port: 8888,
            }
            peerBad = {
                host: "888.888.888.888",
                port: 10001,
            }
            peers = [
                {
                    host: "192.168.100.2",
                    port: 1234,
                },
                {
                    host: "192.168.100.3",
                    port: 2345,
                },
                {
                    host: "192.168.100.4",
                    port: 3456,
                },
                {
                    host: "192.168.100.5",
                    port: 4567,
                },
            ]
        } catch (e) {
            errInit = e
        }
    })

    afterAll(async () => {
        await dbPeer.removeAll()
    })

    it("init(): init db table, should no error throw", () => {
        expect(errInit).toBeUndefined()
    })

    it("seen(): save peer to db and update lastSeen, successCount and active status, should no error throw", async () => {
        let errSeen: Error
        try {
            await dbPeer.seen(peerGood)
        } catch (e) {
            errSeen = e
        }
        expect(errSeen).toBeUndefined()
    })

    it("fail(): save peer to db and update lastAttempt, failCount, should no error throw", async () => {
        let errFail: Error
        try {
            await dbPeer.fail(peerGood)
        } catch (e) {
            errFail = e
        }
        expect(errFail).toBeUndefined()
    })

    it("deactivate(): update active status when peer disconnected, should no error throw", async () => {
        await dbPeer.seen(peerGood)
        const key = PeerDatabase.ipeer2key(peerGood)
        let errDea: Error
        try {
            await dbPeer.deactivate(key)
        } catch (e) {
            errDea = e
        }
        expect(errDea).toBeUndefined()
    })

    it("putPeers(): bulk save predefined maxPeerCount of peers in a SQL transaction, should no error throw", async () => {
        let errPut: Error
        try {
            await dbPeer.putPeers(peers)
        } catch (e) {
            errPut = e
        }
        expect(errPut).toBeUndefined()
    })

    it("getRandomPeer(): should return a random peer except for peers been connected", async () => {
        await dbPeer.putPeers(peers)
        const random = await dbPeer.getRandomPeer()
        expect(random).toBeDefined()
    })

    it("get(): should return a peer with specific key", async () => {
        const key = PeerDatabase.ipeer2key(peerGood)
        await dbPeer.seen(peerGood)
        const ret = await dbPeer.get(key)
        expect(ret).toBeDefined()
    })

    it("getKeys(): should return all key of peers", async () => {
        await dbPeer.putPeers(peers)
        const keys = await dbPeer.getKeys()
        expect(keys).toBeDefined()
    })
})
