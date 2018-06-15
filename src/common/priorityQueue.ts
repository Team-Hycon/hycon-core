export class PriorityQueue<T> {
    private queue: T[]
    private maxLength: number
    private comparator: (a: T, b: T) => number

    constructor(maxLength: number, comparator: (a: T, b: T) => number) {
        this.queue = []
        this.maxLength = maxLength
        this.comparator = comparator
    }

    public insert(value: T) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.queue.length; i++) {
            const item = this.peek(i)
            const compare = this.comparator(value, item)
            if (compare < 0 || compare === 0) {
                // insert the value before the retrieved item
                const upperQueue = this.queue.slice(i, this.maxLength - 1)
                const lowerQueue = this.queue.slice(0, i)
                lowerQueue.push(value)
                this.queue = lowerQueue.concat(upperQueue)
                return
            }
        }

        if (this.queue.length < this.maxLength) {
            this.queue.push(value)
        }
    }

    public pop(index?: number): T {
        if (index !== undefined) {
            return this.queue.splice(index, 1)[0]
        }
        return this.queue.pop()
    }

    public remove(value: T, equality: (a: T, b: T) => boolean = (a, b) => a === b) {
        for (let i = 0; i < this.queue.length; i++) {
            const item = this.peek(i)
            const compare = equality(value, item)
            if (compare) {
                this.queue.splice(i, 1)
                return i
            }
        }
    }
    public resort() {
        this.queue.sort(this.comparator)
    }

    public peek(index: number) {
        return this.queue[index]
    }

    public length() {
        return this.queue.length
    }

    public toArray() {
        return this.queue.slice()
    }
}
