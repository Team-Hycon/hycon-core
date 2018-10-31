import { randomBytes, randomFillSync } from "crypto"
import * as Long from "long"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import { DBBlock } from "../src/consensus/database/dbblock"
import { DifficultyAdjuster } from "../src/consensus/difficultyAdjuster"
import * as proto from "../src/serialization/proto"

describe("DifficultyAdjuster", () => {
    it("", () => {
        const p = 0.3
        const length = 64

        const target = new Uint8Array(
            [75, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204])

        const arrHash1 = new Uint8Array(
            [75, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204])

        const arrHash2 = new Uint8Array(
            [74, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204])

        const arrHash3 = new Uint8Array(
            [76, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204,
                204, 204, 204, 204, 204, 204, 204, 204])

        expect(DifficultyAdjuster.acceptable(arrHash1, target)).toEqual(true)
        expect(DifficultyAdjuster.acceptable(arrHash2, target)).toEqual(true)
        expect(DifficultyAdjuster.acceptable(arrHash3, target)).toEqual(false)
    })
})
