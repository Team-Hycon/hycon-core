import { DBBlock } from "../src/consensus/database/dbblock"
import { Block } from "../src/common/block"
import { BlockHeader } from "../src/common/blockHeader"
import { randomBytes, randomFillSync } from "crypto"
import { DifficultyAdjuster } from "../src/consensus/difficultyAdjuster"
import * as proto from "../src/serialization/proto"
import * as Long from "long"

describe("DifficultyAdjuster", () => {
        it("adjustDifficulty: should find a correct difficulty and EMAs", () => {
            const nonce = Long.fromNumber(83, true)

            let iBlockHeader:proto.IBlockHeader = {
                difficulty: 1,
                merkleRoot: randomBytes(32),
                miner: randomBytes(20),
                nonce,
                previousHash: [randomBytes(32)],
                stateRoot: randomBytes(32),
                timeStamp: Date.now(),
            }

            let iDBBlock:proto.IBlockDB = {
                fileNumber: 0,
                header: new BlockHeader(iBlockHeader),
                height: 0,
                length: 0,
                nextDifficulty: 1,
                offset: 0,
                pEMA: 30,
                tEMA: 30,
                totalWork: 0,
            }

            let dbBlock = new DBBlock(iDBBlock)
     
            let returnVal = DifficultyAdjuster.adjustDifficulty(dbBlock, 13)
            expect(returnVal).toEqual({ nextDifficulty: 0.11041090927725336,
                tEMA: 159.7525536800067,
                pEMA: 29.913 })
        })

        it("calcTimeEMA: should calculate the latest EMAs from a time delta", () => {
            const prevTimeEMA = 30
            const newTime = 40

            const ema = DifficultyAdjuster.calcEMA(newTime, prevTimeEMA, 0.1)

            expect(ema).toEqual(31)
        })

        it("getTarget: should calculate the correct target array", () => {
            {
                const p = 0.2
                const length = 32
                const target = DifficultyAdjuster.getTarget(p, length)
                const arrResult:Buffer=new Buffer([51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51])
                expect(target).toEqual(arrResult)
            }
            {
                const p = 0.3
                const length = 64
                const target = DifficultyAdjuster.getTarget(p, length)
                const arrResult:Buffer=new Buffer([ 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 76 ])
                /*let strTarget=""
                for ( let c of target ) {
                    strTarget+=c.toString()+", "
                }
                console.log(`target:${strTarget}`)*/

                expect(target).toEqual(arrResult)
            }
        })
        
        it("", () => {
            const p = 0.3
            const length = 64
            
            const target=new Uint8Array(
            [ 75, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204 ])
 
            const arrHash1=new Uint8Array(
            [ 75, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204 ])

            const arrHash2=new Uint8Array(
            [ 74, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204 ])

            const arrHash3=new Uint8Array(
            [ 76, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204, 
            204, 204, 204, 204, 204, 204, 204, 204 ])

            expect(DifficultyAdjuster.acceptable(arrHash1, target)).toEqual(true)
            expect(DifficultyAdjuster.acceptable(arrHash2, target)).toEqual(true)
            expect(DifficultyAdjuster.acceptable(arrHash3, target)).toEqual(false)
        })
 
        it("getTargetTime: should return the exact targetTime expected", () => {
            expect(DifficultyAdjuster.getTargetTime()).toEqual(43280.85122666891)
        })
        
})
