import { randomBytes } from "crypto"
import { } from "jasmine"
import * as Long from "long"
import { StateNode } from "../src/consensus/database/stateNode"
import * as proto from "../src/serialization/proto"
describe("StateNode test", () => {
    let stateNode: StateNode
    let protoStateNode: proto.IStateNode

    beforeEach(() => {
        protoStateNode = {
            nodeRefs: [{ address: randomBytes(32), child: randomBytes(32) }],
        }
    })

    it("constructor() : call set method when account parameter not undefined", () => {
        const setSpy = spyOn(StateNode.prototype, "set")
        stateNode = new StateNode(protoStateNode)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set() : method should set property using parameter.", () => {
        stateNode = new StateNode()
        stateNode.set(protoStateNode)
        expect(stateNode.nodeRefs).not.toBeUndefined()
        expect(stateNode.nodeRefs.length).toBe(1)
    })

    it("set() : method should throw error when nodeRefs is undefined", () => {
        stateNode = new StateNode()
        function result() {
            return stateNode.set({})
        }
        expect(result).toThrowError("nodeRefs is missing")
    })

    it("encode(): should return encoded data", () => {
        const encoder = jasmine.createSpyObj("encoder", ["finish"])
        const encodeSpy = spyOn(proto.StateNode, "encode").and.returnValue(encoder)
        stateNode = new StateNode()
        stateNode.encode()
        expect(encodeSpy).toHaveBeenCalled()
    })
})
