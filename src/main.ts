import { configure, getLogger } from "log4js"
import { showHelp } from "./help"
configure({
    appenders: {

        console: {
            type: "log4js-protractor-appender",
        },
        fileLogs: {
            filename: `./logs/${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}/logFile.log`,
            keepFileExt: true,
            maxLogSize: 16777216,
            pattern: ".yyyy-MM-dd",
            type: "dateFile",
        },
    },
    categories: {
        default: { appenders: ["console", "fileLogs"], level: "info" },
    },
})
const logger = getLogger("Main")

import commandLineArgs = require("command-line-args")
const optionDefinitions = [
    { name: "api", alias: "a", type: Boolean },
    { name: "api_port", alias: "A", type: Number },
    { name: "bootstrap", type: Boolean },
    { name: "cpuMiners", alias: "m", type: Number },
    { name: "disable_upnp", alias: "x", type: Boolean },
    { name: "disable_nat", alias: "N", type: Boolean },
    { name: "genesis", alias: "G", type: String },
    { name: "lite", type: Boolean },
    { name: "minerAddress", alias: "M", type: String },
    { name: "networkid", alias: "n", type: String },
    { name: "nonLocal", alias: "l", type: Boolean },
    { name: "peer", type: String, multiple: true, defaultOption: true },
    { name: "port", alias: "p", type: Number },
    { name: "postfix", alias: "P", type: String },
    { name: "str_port", alias: "s", type: Number },
    { name: "verbose", alias: "v", type: Boolean, defaultOption: false },
    { name: "visualize", alias: "V", type: Boolean },
    { name: "wallet", alias: "W", type: Boolean },
    { name: "writing", alias: "w", type: Boolean },
    { name: "help", alias: "h", type: Boolean },
    { name: "config", alias: "c", type: String },
    { name: "data", alias: "d", type: String },
]

import conf = require("./settings")
export const globalOptions = commandLineArgs(optionDefinitions)

if (globalOptions.help) {
    showHelp()
    process.exit(0)
}

if (globalOptions.cpuMiners === undefined) {
    globalOptions.cpuMiners = 1
}
if (globalOptions.genesis !== undefined) {
    conf.dataGenesis = globalOptions.genesis
}
if (globalOptions.api_port !== "") {
    logger.info(`API Port=${globalOptions.api_port}`)
}
if (globalOptions.networkid === undefined) {
    globalOptions.networkid = "hycon"
}
if (globalOptions.nonLocal === undefined) {
    globalOptions.nonLocal = false
}
if (globalOptions.port === 0) {
    globalOptions.port = 20000 + Math.floor(40000 * Math.random())
}
if (globalOptions.postfix === undefined) {
    globalOptions.postfix = ""
}

if (globalOptions.data === undefined) {
    globalOptions.data = ""
} else {
    const target: string = globalOptions.data
    if (target.length > 0) {
        const lastone: string = target.slice(target.length - 1, target.length)
        if (lastone === "/" || lastone === "\\") {
        } else {
            globalOptions.data += "/"
        }
    }
}

if (globalOptions.str_port === 0) {
    globalOptions.str_port = 20000 + Math.floor(40000 * Math.random())
}
if (globalOptions.verbose) {
    logger.level = "debug"
}

logger.info(`GenesisBlock=${conf.dataGenesis}`)
logger.info(`Options=${JSON.stringify(globalOptions)}`)
logger.info(`Verbose=${globalOptions.verbose}`)
logger.info(`Port=${globalOptions.port}`)
logger.info(`Stratum Port=${globalOptions.str_port}`)

import * as fs from "fs-extra"
import { Server } from "./server"
import { Wallet } from "./wallet/wallet"
// tslint:disable-next-line:no-var-requires
const input = require("input")
async function createDefaultWallet(): Promise<string> {
    logger.warn("An encrypted mining wallet will be created for you")
    await Wallet.walletInit()
    let password = ""
    while (true) {
        const pw1 = await input.password("Please enter a password: ")
        const pw2 = await input.password("Please confirm your password: ")
        if (pw1 === pw2) {
            password = pw1
            break
        }
        logger.warn("Passwords do not match, please try again")

    }
    const newWallet = Wallet.randomWallet()
    await newWallet.save("mining", password, "")
    const address = newWallet.pubKey.address().toString()
    logger.info(`Default Wallet: '${address}'`)
    return address
}

export async function setMiner(address: string) {
    globalOptions.minerAddress = conf.minerAddress = address
    await fs.writeFileSync("./data/config.json", JSON.stringify(conf))
}

async function main() {
    let configChange = false

    if (globalOptions.os === undefined || globalOptions.os === "") {
        globalOptions.os = conf.os
    }

    if (globalOptions.minerAddress === undefined || globalOptions.minerAddress === "") {
        globalOptions.minerAddress = conf.minerAddress
    }

    if (globalOptions.minerAddress === undefined || globalOptions.minerAddress === "") {
        try {
            globalOptions.minerAddress = conf.minerAddress = await Wallet.getAddress("mining")
            configChange = true
        } catch (e) {

        }
    }

    if (conf.txPoolMaxAddresses === undefined) {
        conf.txPoolMaxAddresses = 36000
        await fs.writeFileSync("./data/config.json", JSON.stringify(conf))
    }

    if (conf.txPoolMaxTxsPerAddress === undefined) {
        conf.txPoolMaxTxsPerAddress = 64
        await fs.writeFileSync("./data/config.json", JSON.stringify(conf))
    }

    if (globalOptions.cpuMiners > 0) {
        if (globalOptions.minerAddress === undefined || globalOptions.minerAddress === "") {
            try {
                globalOptions.minerAddress = conf.minerAddress = await createDefaultWallet()
                configChange = true
            } catch (e) {
                logger.error(`Failed to initialize default wallet: ${e}`)
            }
        }
    }

    if (configChange) {
        await fs.writeFileSync("./data/config.json", JSON.stringify(conf))
    }

    if (globalOptions.lite === undefined || globalOptions.lite) {
        const hycon = new Server()
        hycon.run()
    } else {
        throw new Error("Lite node not implemented")
    }
}

main()
