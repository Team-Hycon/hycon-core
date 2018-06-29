// import { randomBytes } from "crypto"
// import { } from "jasmine"
// import * as levelup from "levelup"
// import * as Long from "long"
// import * as net from "net"
// import { Address } from "../src/common/address"
// import { Block } from "../src/common/block"
// import { GenesisBlock } from "../src/common/blockGenesis"
// import { BlockHeader } from "../src/common/blockHeader"
// import { SignedTx } from "../src/common/txSigned"
// import { Database } from "../src/consensus/database/database"
// import { DBBlock } from "../src/consensus/database/dbblock"
// import { DBState } from "../src/consensus/database/dbState"
// import { UpnpClient } from "../src/network/upnp"
// import { UpnpServer } from "../src/network/upnp"
// import * as proto from "../src/serialization/proto"
// import { Server } from "../src/server"
// import { Hash } from "../src/util/hash"
// import { testAsync } from "./async"

// xdescribe("Server", () => {
//     let server: Server
//     const netServer: jasmine.SpyObj<net.Server> = jasmine.createSpyObj("netServer", ["on", "listen"])
//     const dbObj: jasmine.SpyObj<Database> = jasmine.createSpyObj("database", ["constructor"])
//     let iDBBlock: proto.IBlockDB
//     let iBlockHeader: proto.IBlockHeader
//     let originalTimeout: number
//     let testPrevious: DBBlock
//     let itx: proto.ITx

//     beforeAll(() => {
//         spyOn(UpnpClient.prototype, "run")
//         spyOn(UpnpServer.prototype, "run")
//         spyOn(net, "createServer").and.returnValue(netServer)
//         server = new Server()

//         iBlockHeader = {
//             difficulty: 33,
//             merkleRoot: new Hash("Merkle root"),
//             nonce: 1234,
//             previousHash: [new Hash("Previous Block")],
//             stateRoot: new Hash("State root"),
//             timeStamp: Date.now(),
//         }
//         iDBBlock = {
//             fileNumber: 0,
//             header: iBlockHeader,
//             height: 1,
//             length: 100,
//             offset: 10,
//         }
//         itx = {
//             amount: 10000,
//             fee: 100,
//             from: new Address(randomBytes(20)),
//             nonce: 1234,
//             recovery: 10,
//             signature: randomBytes(32),
//             to: new Address(randomBytes(20)),
//         }
//         testPrevious = new DBBlock(iDBBlock)
//     })
//     beforeEach(() => {
//         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
//     })
//     afterEach(() => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
//     })
//     it("Should create a server to listen for sockets", () => {
//         expect(net.createServer).toHaveBeenCalled()
//     })
//     it("Should start the server listening", () => {
//         expect(netServer.listen).toHaveBeenCalled()
//     })
// })
