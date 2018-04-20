import { randomBytes } from "crypto"
import { Packet } from "../src/network/turtle/packet"
import { SocketBuffer } from "../src/network/turtle/socketBuffer"

describe("socketBuffer test", () => {
    let socketBuffer: SocketBuffer
    beforeEach(() => {
        socketBuffer = new SocketBuffer()
    })
    it("Constructor have to call prepare method", () => {
        spyOn(SocketBuffer.prototype, "prepare")
        const socketBuf = new SocketBuffer()
        expect(SocketBuffer.prototype.prepare).toHaveBeenCalled()
    })

    it("prepare() : set initial property", () => {
        socketBuffer.packet = new Packet()
        socketBuffer.prepare()
        expect(socketBuffer.packet).toBeNull()
    })

    it("receive(src) : set buffer property and call parse method", () => {
        spyOn(Buffer, "concat").and.callThrough()
        spyOn(socketBuffer, "parse")
        socketBuffer.receive(new Buffer(32))
        expect(Buffer.concat).toHaveBeenCalled()
        expect(socketBuffer.parse).toHaveBeenCalled()
    })

    it("popBytes(toRead) : should pop bytes from buffer", () => {
        spyOn(Buffer.prototype, "copy").and.callThrough()
        spyOn(Buffer.prototype, "slice").and.callThrough()
        socketBuffer.popBytes(32)
        expect(Buffer.prototype.copy).toHaveBeenCalled()
        expect(Buffer.prototype.slice).toHaveBeenCalled()
    })

    it("parse() : Parses the contents of the buffer based on the size of the header.", () => {
        let index = 0
        const buffer = new Buffer(32)
        buffer.fill(1)
        spyOn(socketBuffer, "popBytes").and.callFake(() => {
            if (index === 0) {
                socketBuffer.buffer = buffer
                index++
            } else { socketBuffer.buffer = new Buffer(0) }
            return new Buffer(32)
        })
        spyOn(Packet.prototype, "unpack").and.returnValue({ head: buffer, body: buffer })
        spyOn(socketBuffer, "prepare").and.callThrough()
        socketBuffer.buffer = buffer
        let isCallback = false
        socketBuffer.packetCallback = () => { isCallback = true }
        spyOn(socketBuffer, "packetCallback").and.callThrough()
        socketBuffer.parse()
        expect(socketBuffer.popBytes).toHaveBeenCalledTimes(2)
        expect(Packet.prototype.unpack).toHaveBeenCalledTimes(1)
        expect(socketBuffer.packetCallback).toHaveBeenCalledTimes(1)
        expect(socketBuffer.prepare).toHaveBeenCalledTimes(1)
        expect(isCallback).toBeTruthy()
    })
})
