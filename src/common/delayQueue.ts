import { PriorityQueue } from "./priorityQueue"

interface IPromiseControl { resolve: () => void, reject: (e: any) => void, timer: NodeJS.Timer, timeStamp: number }
function comparator(a: IPromiseControl, b: IPromiseControl) {
    return b.timeStamp - a.timeStamp
}
export class DelayQueue {

    private queue: PriorityQueue<IPromiseControl>

    constructor(maxLength: number) {
        this.queue = new PriorityQueue(maxLength, comparator)
    }

    public waitUntil(timeStamp: number) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.queue.pop()
                resolve()
            }, timeStamp - Date.now())
            this.queue.insert({ resolve, reject, timer, timeStamp })
        })
    }
}
