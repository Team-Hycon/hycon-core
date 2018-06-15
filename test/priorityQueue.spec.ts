import { PriorityQueue } from "../src/common/priorityQueue"

describe("PriorityQueue", () => {
    const maxLength = 10

    it("insert: 1 should insert an item into an empty priority queue", () => {
        const comparator = () => 0
        const queue = new PriorityQueue(maxLength, comparator)
        const value = 0
        queue.insert(value)

        expect(queue.peek(0)).toEqual(value)
    })

    it("insert: 2 should insert an item into a queue with existing elements to the end of the queue", () => {
        const comparator = (a: number, b: number) => a - b
        const queue = new PriorityQueue(maxLength, comparator)
        const value = 3

        queue.insert(1)
        queue.insert(2)
        queue.insert(value)

        expect(queue.peek(2)).toEqual(value)
    })

    it("insert: 3 should insert an item into the middle of a priority queue", () => {
        const comparator = (a: number, b: number) => a - b
        const queue = new PriorityQueue(maxLength, comparator)
        const value = 3

        queue.insert(0)
        queue.insert(1)
        queue.insert(2)
        queue.insert(4)
        queue.insert(5)
        queue.insert(value)

        expect(queue.peek(3)).toEqual(value)
    })

    it("insert: 4 should insert an item into the front of a priority queue", () => {
        const comparator = (a: number, b: number) => a - b
        const queue = new PriorityQueue(maxLength, comparator)
        const value = 3

        queue.insert(4)
        queue.insert(5)
        queue.insert(6)
        queue.insert(7)
        queue.insert(value)

        expect(queue.peek(0)).toEqual(value)
    })

    it("insert: 5 should reject an item of the wrong type", () => {
        const comparator = (a: number, b: number) => a - b
        const queue = new PriorityQueue(maxLength, comparator)
        const value = "3"

        queue.insert(1)

        expect(queue.insert.bind(value, comparator)).toThrowError()
    })

    it("pop: should get the correct max priority item", () => {
        const comparator = (a: number, b: number) => a - b
        const queue = new PriorityQueue(maxLength, comparator)

        queue.insert(7)
        queue.insert(17)
        queue.insert(4)
        queue.insert(20)
        queue.insert(3)
        queue.insert(18)

        expect(queue.pop()).toEqual(20)
    })
})
