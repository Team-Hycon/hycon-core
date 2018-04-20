import * as fs from "fs-extra"
import { } from "jasmine"
import { PeerList } from "../src/network/rabbit/peerList"
import * as proto from "../src/serialization/proto"
import { testAsync } from "./async"

describe("PeerList", () => {
    beforeEach(() => {
        spyOn(fs, "readFile")
        spyOn(fs, "writeFile")
    })

    it("peerList.addHost(host, port): Should add a host to the peer list", testAsync(async () => {
        const peerList = new PeerList("dbpath")
        await peerList.addHost("myhost", 2000)
    }))

    it("peerList.addHost(host, port): Should reject a host that is already on the list", testAsync(async () => {
        const peerList = new PeerList("dbpath")
        expect(await peerList.addHost("myhost", 2000)).toBeTruthy()
        expect(await peerList.addHost("myhost", 2000)).toBeFalsy()
    }))
})
