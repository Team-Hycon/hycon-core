import { randomBytes } from "crypto"
import * as Long from "long"
import { NodeRef } from "../src/consensus/database/nodeRef"
import * as proto from "../src/serialization/proto"
describe("NodeRef test", () => {
    let nodeRef: NodeRef
    let protoNodeRef: proto.INodeRef

    beforeEach(() => {
        protoNodeRef = {
            address: randomBytes(32), child: randomBytes(32),
        }
    })

    it("constructor() : call set method when account parameter not undefined", () => {
        const setSpy = spyOn(NodeRef.prototype, "set")
        nodeRef = new NodeRef(protoNodeRef)
        expect(setSpy).toHaveBeenCalled()
    })

    it("set() : method should set property using parameter.", () => {
        nodeRef = new NodeRef()
        nodeRef.set(protoNodeRef)
        expect(nodeRef.address).not.toBeUndefined()
        expect(nodeRef.child).not.toBeUndefined()
    })

    it("set() : method should throw error when address is undefined", () => {
        nodeRef = new NodeRef()
        function result() {
            return nodeRef.set({ child: randomBytes(32) })
        }
        expect(result).toThrowError("address is missing")
    })

    it("set() : method should throw error when child is undefined", () => {
        nodeRef = new NodeRef()
        function result() {
            return nodeRef.set({ address: randomBytes(32) })
        }
        expect(result).toThrowError("child is missing")
    })
})
