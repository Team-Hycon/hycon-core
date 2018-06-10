import { getLogger } from "log4js"
import { Socket } from "net"
import { resolve } from "url"
import { AsyncLock } from "../../common/asyncLock"
import * as proto from "../../serialization/proto"
import { Hash } from "../../util/hash"
import { SocketParser } from "./socketParser"

const logger = getLogger("Network")

// tslint:disable-next-line:interface-name
interface ReplyAndPacket { reply: proto.Network, packet: Buffer }
type replyResolve = (reply: ReplyAndPacket) => void
type replyReject = (reason?: any) => void
export abstract class BasePeer {
    public static DefaultTimeoutTime = 30000
    public socketBuffer: SocketParser
    private replyId: number
    private replyMap: Map<number, { resolved: replyResolve, reject: replyReject, timeout: NodeJS.Timer }>
    private requestSemaphore = new AsyncLock(0, 30000, 5)

    constructor(socket: Socket) {
        this.replyId = 1
        this.replyMap = new Map()
        this.socketBuffer = new SocketParser(socket, (route, buffer) => this.onPacket(route, buffer))
        socket.on("close", () => this.close())
    }
    public async sendPacket(buffer: Uint8Array): Promise<void> {
        return this.socketBuffer.send(0, buffer)
    }
    public disconnect() {
        this.socketBuffer.destroy()
        this.rejectAllReplies("Disconnect")
    }

    public getInfo(): string {
        return (this.socketBuffer === null) ? "" : this.socketBuffer.getInfo()
    }

    protected rejectAllReplies(reason?: string) {
        for (const [id, { reject }] of this.replyMap) {
            reject(reason)
        }
    }

    protected async onPacket(route: number, packet: Buffer): Promise<void> {
        try {
            const res = proto.Network.decode(packet)
            switch (res.request) {
                case "status":
                case "ping":
                case "getTxs":
                case "putTx":
                case "putBlock":
                case "getBlocksByHash":
                case "getHeadersByHash":
                case "getBlocksByRange":
                case "getHeadersByRange":
                case "getPeers":
                case "getTip":
                case "putHeaders":
                case "getHash":
                    this.requestSemaphore.critical(async () => await this.respond(route, res, packet)).catch((e) => logger.debug(e))
                    break
                case "statusReturn":
                case "pingReturn":
                case "putTxReturn":
                case "getTxsReturn":
                case "putBlockReturn":
                case "getBlocksByHashReturn":
                case "getHeadersByHashReturn":
                case "getBlocksByRangeReturn":
                case "getHeadersByRangeReturn":
                case "getPeersReturn":
                case "getTipReturn":
                case "putHeadersReturn":
                case "getHashReturn":
                    if (route === 0) {
                        logger.debug(`Recieved ${res.request} broadcast`)
                    }
                    await this.route(route, res, packet)
                    break
                default:
                    logger.debug(`Unsupported Protocol=${res.request}`)
                    break
            }
        } catch (e) {
            this.protocolError(e)
        }
    }

    protected abstract async respond(route: number, request: proto.Network, packet: Buffer): Promise<void>

    protected async route(route: number, reply: proto.Network, packet: Buffer): Promise<void> {
        try {
            const { resolved } = this.replyMap.get(route)
            resolved({ reply, packet })
        } catch (e) {
            this.protocolError(e)
        }
    }

    protected async sendRequest(request: proto.INetwork): Promise<ReplyAndPacket> {
        const id = this.newReplyID()
        let timeout: NodeJS.Timer
        try {
            return await new Promise<ReplyAndPacket>((resolved, reject) => {
                timeout = setTimeout(() => reject("Timeout"), BasePeer.DefaultTimeoutTime)
                this.replyMap.set(id, { resolved, reject, timeout })
                this.send(id, request).catch(reject)
            })
        } catch (e) {
            if (e === "Timeout") {
                timeout = undefined
            }
            throw e
        } finally {
            this.replyMap.delete(id)
            if (timeout !== undefined) {
                clearTimeout(timeout)
            }
        }
    }

    protected async send(route: number, data: proto.INetwork): Promise<void> {
        const buffer = proto.Network.encode(data).finish()
        try { const message = proto.Network.decode(buffer) } catch (e) {
            logger.fatal("Packet not properly encoded, could not decode")
        }
        return this.socketBuffer.send(route, buffer)
    }

    protected protocolError(e: Error) {
        this.socketBuffer.destroy(e)
    }

    private newReplyID(): number {
        if (this.replyId >= Number.MAX_SAFE_INTEGER) {
            this.replyId = 1
        }
        return this.replyId++
    }

    private close() {
        for (const [id, replyRoute] of this.replyMap) {
            replyRoute.reject("Disconnect")
        }
    }
}
