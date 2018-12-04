import levelup = require("levelup")
import { hycontoString } from "../../api/client/stringUtil"
import { Hash } from "../../util/hash"
import { BlockStatus } from "../sync"
import { Database } from "./database"
import { DBBlock } from "./dbblock"

export class DeferredDatabaseChanges {
    private db: Database
    private stateChanges: Map<string, BlockStatus>
    private heightChanges: Map<number, Hash>
    private dbblockChanges: Map<string, DBBlock>
    private blockTip?: Hash
    constructor(db: Database) {
        this.db = db
        this.stateChanges = new Map<string, BlockStatus>()
        this.heightChanges = new Map<number, Hash>()
        this.dbblockChanges = new Map<string, DBBlock>()
    }

    public async getBlockStatus(hash: Hash) {
        const hashString = hash.toString()
        const deferred = this.stateChanges.get(hashString)
        if (deferred !== undefined) { return deferred }
        const status = await this.db.getBlockStatus(hash)
        this.stateChanges.set(hashString, status)
        return status
    }

    public async getDBBlock(hash: Hash) {
        const hashString = hash.toString()
        const deferred = this.dbblockChanges.get(hashString)
        if (deferred !== undefined) { return deferred }
        return this.db.getDBBlock(hash)
    }

    public setBlockStatus(hash: Hash, blockStatus: BlockStatus) {
        this.stateChanges.set(hash.toString(), blockStatus)
    }
    public async setUncle(hash: Hash, uncle: boolean) {
        const dbblock = await this.getDBBlock(hash)
        if (dbblock.uncle !== uncle) {
            dbblock.uncle = uncle
            this.dbblockChanges.set(hash.toString(), dbblock)
        }
    }

    public setHashAtHeight(height: number, hash: Hash) {
        this.heightChanges.set(height, hash)
    }

    public setBlockTip(hash: Hash) {
        this.blockTip = hash
    }

    public revert() {
        this.stateChanges.clear()
        this.heightChanges.clear()
        this.dbblockChanges.clear()
        this.blockTip = undefined
    }
    public async commit() {
        const batch = [] as levelup.Batch[]
        for (const [hash, dbblock] of this.dbblockChanges) {
            const key = "b" + hash
            const value = dbblock.encode()
            batch.push({ type: "put", key, value })
        }
        for (const [hash, value] of this.stateChanges) {
            const key = "s" + hash
            batch.push({ type: "put", key, value })
        }
        for (const [key, hash] of this.heightChanges) {
            const value = hash.toBuffer()
            batch.push({ type: "put", key, value })
        }
        if (this.blockTip !== undefined) {
            batch.push({ type: "put", key: "__blockTip", value: this.blockTip.toBuffer() })
        }
        return this.db.batch(batch)
    }
}
