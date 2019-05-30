import { configure, getLogger } from "log4js"
import { optionDefinitions, Options } from "./options"
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
export const userOptions = new Options(commandLineArgs(optionDefinitions))

if (userOptions.verbose) {
    logger.level = "debug"
}
import { Server } from "./server"
import { Wallet } from "./wallet/wallet"
// tslint:disable-next-line:no-var-requires
const input = require("input")
export async function createDefaultWallet(): Promise<string> {
    logger.warn("An encrypted mining wallet will be created for you")
    logger.warn("You can use the option --minerAddress=\"${your address}\" or modifi data/config.json file")
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

async function main() {
    logger.info(`GenesisBlock=${userOptions.dataGenesis}`)
    logger.info(`Options=${JSON.stringify(userOptions)}`)
    logger.info(`Verbose=${userOptions.verbose}`)
    logger.info(`Port=${userOptions.port}`)
    logger.info(`Stratum Port=${userOptions.str_port}`)
    await userOptions.setMiner()

    const hycon = new Server()
    hycon.run()
}
// if (process.env.NODE_ENV !== "test") {
//     main()
// }
