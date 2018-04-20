import * as proto from "../../serialization/proto"
import { NodeRef } from "./nodeRef"
export class StateNode implements proto.IStateNode {
    public nodeRefs: NodeRef[] = []
    constructor(stateNode?: proto.IStateNode) {
        if (stateNode !== undefined) {
            this.set(stateNode)
        }
    }

    public set(stateNode: proto.IStateNode) {
        if (stateNode.nodeRefs === undefined) { throw new Error("nodeRefs is missing") }
        this.nodeRefs = []
        for (const nodeRef of stateNode.nodeRefs) {
            this.nodeRefs.push(new NodeRef(nodeRef))
        }
    }

    public encode(): Uint8Array {
        return proto.StateNode.encode(this).finish()
    }
}
