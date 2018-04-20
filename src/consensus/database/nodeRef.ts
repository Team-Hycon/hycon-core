import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
export class NodeRef implements proto.INodeRef {
    public address: Uint8Array
    public child: Hash

    constructor(nodeRef?: proto.INodeRef) {
        if (nodeRef !== undefined) {
            this.set(nodeRef)
        }
    }

    public set(nodeRef: proto.INodeRef) {
        if (nodeRef.address === undefined) { throw new Error("address is missing") }
        if (nodeRef.child === undefined) { throw new Error("child is missing") }
        this.address = nodeRef.address
        this.child = new Hash(nodeRef.child)
    }
}
