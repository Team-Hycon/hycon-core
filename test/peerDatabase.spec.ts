import { PeerDatabase } from "../src/network/peerDatabase"
import * as proto from "../src/serialization/proto"

describe("peerDatabase test", () => {
    let dbPeer: PeerDatabase
    let res: boolean
    let peerGood: proto.IPeer
    let peerBad: proto.IPeer
    let peers: proto.IPeer[]

    beforeEach(async () => {
        await dbPeer.clearAll()
    })
    beforeAll(async () => {
        dbPeer = new PeerDatabase(null)
        res = await dbPeer.init()
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

    })

    afterAll(async () => {
        dbPeer.close()
    })

    it("constructor(): init db object, and should return db object if sucessful", () => {
        expect(dbPeer).toBeDefined()
    })

    it("init(): init db table, and return true if successful", () => {
        expect(res).toBeTruthy()
    })

    it("put(): if there is peer record at db, update the peer record, otherwise insert the peer record into table. It should return the peer or undefined if peer port exceeds 10000", async () => {
        const peer = await dbPeer.put(peerGood)
        try {
            await dbPeer.put(peerBad)
        } catch (e) {
            expect(peer.host).toEqual(peerGood.host)
            expect(peer.port).toEqual(peerGood.port)
            return
        }
        fail()

    })

    it("putPeers(): put multiple peers, should return true if it is successful", async () => {
        expect(await dbPeer.putPeers(peers)).toBeTruthy()
    })

    it("seen(): lastSeen and failCount property of peer should be updated if it is successful", async () => {
        const peer = await dbPeer.seen(peerGood)
        expect(peer.successCount).toBeDefined()
        expect(peer.lastSeen).toBeDefined()
    })

    it("fail(): lastAttempt and failCount property of peer should be updated if it is successful", async () => {
        await dbPeer.put(peerGood)
        const peer = await dbPeer.fail(peerGood, 10)
        expect(peer.failCount).toBeDefined()
        expect(peer.lastAttempt).toBeDefined()
    })

    it("get(): should return the peer if it exist otherwise return undefine", async () => {
        await dbPeer.put(peerGood)
        const key = PeerDatabase.ipeer2key(peerGood)
        const keyNotExist = PeerDatabase.ipeer2key(peerBad)
        const result: proto.IPeer = await dbPeer.get(key)

        expect(result.host).toEqual(peerGood.host)
        expect(result.port).toEqual(peerGood.port)

        try {
            await dbPeer.get(keyNotExist)
            fail()
        } catch (e) {
            // success
        }

    })

    it("remove(): return true if remove peer successful", async () => {
        const peer = await dbPeer.put(peerGood)
        res = await dbPeer.remove(peer)
        expect(res).toBeTruthy()
    })

    it("getRandomPeer(): should return a random peer or undefine if there is no peers except for peers been connected", async () => {
        await dbPeer.putPeers(peers)
        const exception = [peers[0], peers[1]]
        const peer = await dbPeer.getRandomPeer(exception)
        expect(peer).toBeDefined()
    })

    it("getKeys(): should return all key of peers in db", async () => {
        await dbPeer.putPeers(peers)
        const result: number[] = await dbPeer.getKeys()
        expect(result).toBeDefined()
    })
})
