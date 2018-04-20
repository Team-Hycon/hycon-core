import { } from "jasmine"
import * as net from "net"
import { MinerServer } from "../src/miner/minerServer"
import { StratumServer } from "../src/miner/stratumServer"
import { testAsync } from "./async"
const stratum = require("stratum")
const LibStratum = stratum.Server

describe("StratumServer", () => {
    let stratumServer: StratumServer
    let minerServerSpy: jasmine.SpyObj<MinerServer>
    let miningFunction: Function
    let miningErrorFunction: Function
    let rpcFunction: Function
    beforeAll(() => {
        minerServerSpy = jasmine.createSpyObj("MinerServer", [])
        const onSpy = jasmine.createSpyObj<{ on: (event: string, f: Function) => any }>("LibStratum", ["on"])
        onSpy.on.and.callFake((event: string, f: Function) => {
            switch (event) {
                case "mining":
                    miningFunction = f
                    break
                case "mining.error":
                    miningErrorFunction = f
                    break
                case "rpc":
                    rpcFunction = f
                    break
            }
            return onSpy
        })
    })
    // TODO : initialize test
})
