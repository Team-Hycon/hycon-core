import Base58 = require("base-58")
import levelup = require("levelup")
import { configure, getLogger } from "log4js"
import rocksdb = require("rocksdb")
import { DBBlock } from "./src/consensus/database/dbblock"
import { DBState } from "./src/consensus/database/dbState"
import { Hash } from "./src/util/hash"

configure({
    appenders: {
        console: {
            type: "log4js-protractor-appender",
        },
    },
    categories: {
        default: { appenders: ["console"], level: "info" },
    },
})

const logger = getLogger("WorldState-copy")

async function copy() {
    const stateRoot = await findStateRoot()//// new Hash(Base58.decode(root))
    const root = stateRoot.toString()
    const rocksOriginal: any = rocksdb("worldstate")
    const rocksCopy: any = rocksdb("worldstate2")
    const dbOriginal = levelup(rocksOriginal)
    const dbCopy = levelup(rocksCopy)

    interface State {
        address: ArrayLike<number>
        key: Buffer
    }

    const todo = [{ key: stateRoot.toBuffer(), address: [] }] as State[]
    while (todo.length > 0) {
        const state = todo.shift()
        try {
            const data = await dbOriginal.get(state.key)
            await dbCopy.put(state.key, data)
            const dbState = DBState.decode(data)
            if (dbState.node !== undefined) {
                for (const nodeRef of dbState.node.nodeRefs) {
                    const address = Array().concat(state.address, nodeRef.address)
                    const key = nodeRef.child.toBuffer()
                    todo.push({ key, address })
                }
            }
            if (dbState.account !== undefined) {
                const address = Base58.encode(state.address)
                logger.info(`(${address.length}) ${address.toString()}: ${dbState.account.balance}`)
            }
        } catch (e) {
            if (e.notFound) {
                logger.error(`DBState not found in getDBState`)
            } else {
                logger.error(`Fail to getDBState : ${e}`)
            }
        }
    }
}

async function findStateRoot() {
    const rocksBlockDB: any = rocksdb("blockdb")
    const blockdb = levelup(rocksBlockDB)
    const hashData = new Uint8Array(await blockdb.get("__blockTip"))
    const hash = new Hash(hashData)
    const key = "b" + hash
    const encodedBlock = await blockdb.get(key)
    const block = DBBlock.decode(encodedBlock)
    return block.header.stateRoot
}

copy()
