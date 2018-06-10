import { getLogger } from "log4js"

const logger = getLogger("Network")

interface ILockCallBack { resolve: () => void, reject: (e: any) => void, timeoutTimer: NodeJS.Timer }
export class AsyncLock {
    private locked: number
    private lockTransferQueue: ILockCallBack[]
    private timeoutTime: number | undefined
    private parallel: number

    constructor(locked: number = 0, timeoutTime?: number, parallel: number = 1) {
        this.locked = locked
        this.lockTransferQueue = []
        this.timeoutTime = timeoutTime
        this.parallel = parallel

    }

    public queueLength(): number {
        return this.lockTransferQueue.length
    }

    public rejectAll(error?: any): void {
        for (const { reject, timeoutTimer } of this.lockTransferQueue) {
            clearTimeout(timeoutTimer)
            setImmediate(reject, error)
        }
    }

    public async getLock(): Promise<number> {
        if (this.locked < this.parallel) {
            this.locked++
            return this.locked
        }

        if (this.lockTransferQueue.length > 512) {
            throw new Error("Lock queue high")
        }

        await new Promise((resolve, reject) => {
            let timeoutTimer: NodeJS.Timer
            if (this.timeoutTime !== undefined) {
                timeoutTimer = setTimeout(() => reject("Timeout"), this.timeoutTime)
            }
            this.lockTransferQueue.push({ resolve, reject, timeoutTimer })
        })

        return this.locked
    }

    public releaseLock() {
        if (this.lockTransferQueue.length === 0) {
            this.locked--
            return this.locked
        }

        const { resolve, timeoutTimer } = this.lockTransferQueue.splice(0, 1)[0]
        clearTimeout(timeoutTimer)
        setImmediate(resolve)
        return this.locked
    }

    public async critical<T>(f: () => Promise<T>): Promise<T> {
        await this.getLock()
        try {
            return await f()
        } finally {
            this.releaseLock()
        }
    }
}
