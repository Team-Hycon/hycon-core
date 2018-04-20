import { getLogger } from "log4js"

const logger = getLogger("Network")

interface ILockCallBack { resolve: () => void, reject: (e: any) => void, timeoutTimer: NodeJS.Timer }
export class AsyncLock {
    private locked: boolean
    private lockTransferQueue: ILockCallBack[]
    private timeoutTime: number | undefined

    constructor(locked: boolean = false, timeoutTime?: number) {
        this.locked = locked
        this.lockTransferQueue = []
        this.timeoutTime = timeoutTime
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

    public async getLock(): Promise<boolean> {
        if (this.locked) {
            if (this.lockTransferQueue.length > 1024) {
                logger.fatal("Lock queue very high, rejecting all lock requests")
                this.rejectAll()
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
        }
        this.locked = true
        return this.locked
    }

    public releaseLock() {
        if (this.locked && this.lockTransferQueue.length > 0) {
            const { resolve, timeoutTimer } = this.lockTransferQueue.splice(0, 1)[0]
            clearTimeout(timeoutTimer)
            setImmediate(resolve)
        } else {
            this.locked = false
        }
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
