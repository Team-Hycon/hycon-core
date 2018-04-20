import { } from "jasmine"
import { AsyncLock } from "../src/common/asyncLock"
import { testAsync } from "./async"
async function lockTest(lock: AsyncLock): Promise<boolean> {
    let counter = 0
    const n = 50000
    const promises = []
    for (let i = 0; i < n; i++) {
        const promise = await lock.critical<number>(async () => {
            counter = await new Promise<number>((resolved, reject) => {
                resolved(counter + 1)
            })
            return counter
        })
        promises.push(promise)
    }
    try {
        let res: boolean
        if (promises.length === n && counter === promises.length) {
            res = true
        } else {
            res = false
        }
        return Promise.resolve(res)
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(`Error: ${n}: ${e}`)
    }
}
describe("Aync Lock Test Suite", () => {
    let lock: AsyncLock
    beforeEach(() => {
        lock = new AsyncLock()
    })
    it("Should run the lockTest Function to check for correct ordering of events", testAsync(async () => {
        const prom = await lockTest(lock)
        expect(prom).toBeTruthy()
    }))

})
