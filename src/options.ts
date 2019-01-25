// tslint:disable:variable-name
// tslint:disable:forin
import commandLineArgs = require("command-line-args")
import * as fs from "fs-extra"
import { getLogger } from "log4js"
import { showHelp } from "./help"
import { createDefaultWallet } from "./main"
import conf = require("./settings")
import { Wallet } from "./wallet/wallet"

const logger = getLogger("Options")

export const optionDefinitions = [
    { name: "help", alias: "h", type: Boolean },

    { name: "api", alias: "a", type: Boolean },
    { name: "api_port", alias: "A", type: Number },
    { name: "bootstrap", type: Boolean },
    { name: "cpuMiners", alias: "m", type: Number },

    { name: "prefix", type: String },
    { name: "postfix", alias: "P", type: String },

    { name: "disable_upnp", alias: "x", type: Boolean },
    { name: "disable_nat", alias: "N", type: Boolean },
    { name: "genesis", alias: "G", type: String },
    { name: "networkid", alias: "n", type: String },
    { name: "nonLocal", alias: "l", type: Boolean },
    { name: "noGUI", type: Boolean },
    { name: "peer", type: String, multiple: true, defaultOption: true },
    { name: "port", alias: "p", type: Number },
    { name: "public_rest", alias: "R", type: Boolean },
    { name: "str_port", alias: "s", type: Number },
    { name: "verbose", alias: "v", type: Boolean, defaultOption: false },

    { name: "dataGenesis", type: String },
    { name: "dataExodus", type: String },
    { name: "dataExodusDB", type: String },
    { name: "dataRaw", type: String },
    { name: "dataRoot", type: String },
    { name: "dataWallet", type: String },
    { name: "minerAddress", alias: "M", type: String },

    { name: "ghostHeight", type: Number },
    { name: "jabiruHeight", type: Number },
    { name: "txPoolMaxAddresses", type: Number },
    { name: "txPoolMaxTxsPerAddress", type: Number },

    { name: "config", alias: "c", type: String },
]

export class Options {
    public readonly api: boolean = true
    public readonly api_port: number = 2442
    public readonly bootstrap: boolean = false
    public cpuMiners: number = 0

    // TODO Replace with path object
    public readonly prefix: string = ""
    public readonly postfix: string = ""

    public readonly disable_upnp: boolean = false
    public readonly disable_nat: boolean = false
    public readonly genesis: string
    public readonly nonLocal: boolean = false
    public readonly noGUI: boolean = false
    public readonly peer: string[] = []
    public readonly port: number = 8148
    public readonly public_rest: boolean = false
    public readonly str_port: number
    public readonly verbose: boolean = false

    public readonly dataGenesis: string
    public readonly dataExodus: string
    public readonly dataExodusDB: string
    public readonly dataRaw: string
    public readonly dataRoot: string
    public readonly dataWallet: string
    public minerAddress: string
    public readonly networkid: string = "hycon"

    public readonly ghostHeight: number = 0
    public readonly jabiruHeight: number = 0
    public readonly txPoolMaxAddresses: number = 36000
    public readonly txPoolMaxTxsPerAddress: number = 64
    public readonly config: string = ""

    constructor(userOptions: commandLineArgs.CommandLineOptions) {

        for (const property in conf) {
            // @ts-ignore
            this[property] = conf[property]
        }

        for (const property in userOptions) {
            // @ts-ignore
            this[property] = userOptions[property]
        }

        if (this.dataGenesis === undefined) {
            throw new Error("dataGenesis path is not defined")
        }
        if (this.dataExodus === undefined) {
            throw new Error("dataExodus path is not defined")
        }
        if (this.dataExodusDB === undefined) {
            throw new Error("dataExodusDB path is not defined")
        }
        if (this.dataRaw === undefined) {
            throw new Error("dataRaw path is not defined")
        }
        if (this.dataRoot === undefined) {
            throw new Error("dataRoot path is not defined")
        }
        if (this.dataWallet === undefined) {
            throw new Error("dataWallet path is not defined")
        }

        // TODO Replace prefix with path object
        if (this.prefix.length > 0) {
            const lastone: string = this.prefix.slice(this.prefix.length - 1, this.prefix.length)
            if (lastone !== "/" && lastone !== "\\") {
                userOptions.prefix += "/"
            }
        }

        if (userOptions.help) {
            showHelp()
            process.exit(0)
        }

        if (this.port === 0) { this.port = 20000 + Math.floor(40000 * Math.random()) }
        if (this.ghostHeight > this.jabiruHeight) {
            this.jabiruHeight = Infinity
        }
        if (this.ghostHeight === this.jabiruHeight) {
            this.ghostHeight = -Infinity
        }
    }

    public async setMiner(address?: string) {
        if (address === undefined && (this.minerAddress === undefined || this.minerAddress === "")) {
            try {
                address = await Wallet.getAddress("mining")
            } catch (e) {
                logger.debug(`${e}`)
            }
            if (address === "") {
                address = await createDefaultWallet()
            }
        }
        address = address === undefined ? this.minerAddress : address
        this.minerAddress = conf.minerAddress = address
        await fs.writeFileSync("./data/config.json", JSON.stringify(conf))
    }
}
