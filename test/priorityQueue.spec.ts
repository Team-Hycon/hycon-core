import { PriorityQueue } from "../src/common/priorityQueue"

fdescribe("PriorityQueue", () => {
    const maxLength = 10

    it("insert: 1 should insert an item into an empty priority queue", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = () => 0
        const value = 0
        queue.insert(value, comparator)

        expect(queue.peek(0)).toEqual(value)
    })

    it("insert: 2 should insert an item into a queue with existing elements to the end of the queue", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b
        const value = 3

        queue.insert(1, comparator)
        queue.insert(2, comparator)
        queue.insert(value, comparator)

        expect(queue.peek(2)).toEqual(value)
    })

    it("insert: 3 should insert an item into the middle of a priority queue", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b
        const value = 3

        queue.insert(0, comparator)
        queue.insert(1, comparator)
        queue.insert(2, comparator)
        queue.insert(4, comparator)
        queue.insert(5, comparator)
        queue.insert(value, comparator)

        expect(queue.peek(3)).toEqual(value)
    })

    it("insert: 4 should insert an item into the front of a priority queue", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b
        const value = 3

        queue.insert(4, comparator)
        queue.insert(5, comparator)
        queue.insert(6, comparator)
        queue.insert(7, comparator)
        queue.insert(value, comparator)

        expect(queue.peek(0)).toEqual(value)
    })

    it("insert: 5 should reject an item of the wrong type", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b
        const value = "3"

        queue.insert(1, comparator)

        expect(queue.insert.bind(value, comparator)).toThrowError()
    })

    it("insert: 6 should pop the highest priority item when it fills", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b

        for (let i = 0; i < maxLength; i++) {
            queue.insert(i, comparator)
        }

        const max = queue.insert(11, comparator)

        expect(max.overflow).toEqual(11)
    })

    it("pop: should get the correct max priority item", () => {
        const queue = new PriorityQueue(maxLength)
        const comparator = (a: number, b: number) => a - b

        queue.insert(7, comparator)
        queue.insert(17, comparator)
        queue.insert(4, comparator)
        queue.insert(20, comparator)
        queue.insert(3, comparator)
        queue.insert(18, comparator)

        expect(queue.pop()).toEqual(20)
    })
})
