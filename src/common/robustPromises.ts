import { getLogger } from "log4js"
const logger = getLogger("EliminationRace")

export class RobustPromises<T> {
    private promises: Array<Promise<T>>
    constructor() {
        this.promises = []
    }

    public add(promise: Promise<T>) {
        this.promises.push(promise)
        promise.then((v) => this.remove(promise))
        promise.catch((e) => this.remove(promise))
    }

    public race(test: (t: T) => boolean = () => true) {
        return new Promise<T>(async (resolve, reject) => {
            while (this.promises.length > 0) {
                try {
                    const p = Promise.race(this.promises)
                    const value = await p
                    if (test(value)) {
                        resolve(value)
                    }
                } catch (e) {
                    logger.debug(e)
                }
            }
            reject(`No promise resolved`)
        })
    }

    public all(): Promise<T[]> {
        return new Promise<T[]>(async (resolve) => {
            while (this.promises.length > 0) {
                try {
                    const result = await Promise.all(this.promises)
                    resolve(result)
                } catch (e) {
                    logger.debug(e)
                }
            }
            resolve([])
        })
    }

    private remove(promise: Promise<T>) {
        let i = 0
        while (i < this.promises.length) {
            if (promise === this.promises[i]) {
                this.promises.splice(i, 1)
            } else {
                i++
            }
        }
    }
}
