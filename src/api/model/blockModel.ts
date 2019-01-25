
import { getLogger } from "log4js"
import { Address } from "../../common/address"
import { Block } from "../../common/block"
import { GenesisBlock } from "../../common/blockGenesis"
import { Consensus } from "../../consensus/consensus"
import { DBMined } from "../../consensus/database/dbMined"
import { Hash } from "../../util/hash"
import { BlockDTO } from "../dto/blockDTO"
import { RESPONSE_CODE, Responser } from "../router/responser"
const logger = getLogger("BlockModel")

export class BlockModel {

    private readonly MAX_NUMBER_OF_BLOCKS = 100
    private consensus: Consensus
    constructor(consensus: Consensus) {
        this.consensus = consensus
    }

    public async getBlocks(range: number = 1, hashOrHeight?: string | number) {
        range = Number(range)
        if (isNaN(range) || range === 0) { return Responser.invalidParam("range") }
        if (Math.abs(range) > this.MAX_NUMBER_OF_BLOCKS) {
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, `The absolute value of range cannot exceed ${this.MAX_NUMBER_OF_BLOCKS}.`)
        }

        try {
            const targetHeight = await this.setTargetHeight(hashOrHeight)
            if (typeof (targetHeight) !== "number") {
                return targetHeight
            }
            const startHeight = range < 0 ? targetHeight + range + 1 : targetHeight
            const blockCount = range < 0 ? -range : range
            const blocks = await this.consensus.getBlocksRange(startHeight, blockCount)

            if (blocks.length === 0) {
                return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `block ${hashOrHeight} not found`)
            }

            if (blocks.length === 1) {
                return BlockDTO.blockToDTO(blocks[0], targetHeight)
            }
            return this.blocksToDTOs(blocks, startHeight)
        } catch (e) {
            logger.warn(`getBlocks failed : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `${e}`)
        }
    }

    public getTips() {
        const bTip = this.consensus.getBtip()
        const hTip = this.consensus.getHtip()
        if (bTip === undefined || hTip === undefined) {
            return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `Tip information is undefined in consensus.`)
        }
        const blockTip = BlockDTO.blockToDTO(bTip, bTip.height)
        const headerTip = BlockDTO.blockToDTO(hTip, hTip.height)
        return { blockTip, headerTip }
    }
    public async getMinedInfo(targetAddress: string, count: number = 1) {
        try {
            if (targetAddress === undefined) { return Responser.missingParameter() }
            count = Number(count)
            if (isNaN(count) || count <= 0) { return Responser.invalidParam() }

            const minedBlocks: DBMined[] = await this.consensus.getMinedBlocks(new Address(targetAddress), count)
            if (minedBlocks.length === 1) { return BlockDTO.minedDBToDTO(minedBlocks[0]) }

            return this.dbBlocksToDTOs(minedBlocks)
        } catch (e) {
            logger.warn(`Failed to getMinedInfo : ${e} / stack : ${e.stack}`)
            return Responser.makeJsonError(RESPONSE_CODE.BAD_REQUEST, e.toString())
        }
    }

    private async setTargetHeight(hashOrHeight?: number | string) {
        let targetHeight: number

        if (hashOrHeight) {
            targetHeight = await this.getTargetHeight(hashOrHeight)
        } else {
            const tip = this.consensus.getBtip()
            if (tip === undefined) {
                return Responser.makeJsonError(RESPONSE_CODE.NOT_FOUND, `Tip information is undefined in consensus.`)
            }
            targetHeight = tip.height
        }

        return targetHeight
    }

    private async getTargetHeight(hashOrHeight?: number | string) {
        if (this.isNumber(hashOrHeight)) {
            return Number(hashOrHeight)
        }
        const height = await this.getBlockkHeight(String(hashOrHeight))
        if (height === undefined) { throw new Error(`hash ${hashOrHeight} is not found`) }
        return height
    }

    private async getBlockkHeight(blockhash: string) {
        try {
            return await this.consensus.getBlockHeight(Hash.decode(blockhash))
        } catch (e) {
            logger.warn(`getHeight failed : ${e.stack}`)
        }
    }
    private isNumber(target: any) {
        const regexp = /^[0-9]*$/
        return regexp.test(target)
    }

    private blocksToDTOs(blocks: Array<Block | GenesisBlock>, startHeight: number) {
        const blockDTOs = []
        for (const block of blocks) {
            blockDTOs.push(BlockDTO.blockToDTO(block, startHeight++))
        }
        return blockDTOs
    }
    private dbBlocksToDTOs(minedBlocks: DBMined[]) {
        const blockDTOs = []
        for (const block of minedBlocks) {
            blockDTOs.push(BlockDTO.minedDBToDTO(block))
        }
        return blockDTOs
    }

}
