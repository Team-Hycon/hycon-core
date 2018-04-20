import { DifficultyAdjuster } from "../src/consensus/difficultyAdjuster"

describe("DifficultyAdjuster", () => {

        xit("calcTimeEMA: should calculate the latest EMAs from a time delta", () => {
                const prevTimeEMA = 30
                const newTime = 40

                const ema = DifficultyAdjuster.calcEMA(newTime, prevTimeEMA, 0.1)

                // expect(ema).toEqual(31)
        })
})
