import * as fs from "fs-extra"
import conf = require("../settings")

import { getLogger } from "log4js"
const logger = getLogger("FileUtil")

export class FileUtil {
    public static init() {
        if (!fs.existsSync(conf.dataRoot)) {
            fs.mkdirSync(conf.dataRoot)
        }
        if (!fs.existsSync(conf.dataRaw)) {
            fs.mkdirSync(conf.dataRaw)
        }
        if (!fs.existsSync(conf.dataWallet)) {
            fs.mkdirSync(conf.dataWallet)
        }

        try {
            fs.ensureDir("./wallet/rootKey")
        } catch (e) {
            try {
                fs.mkdir("./wallet")
            } catch (error) {
                logger.error(`Making ./wallet directory failed: ${error}`)
            }
        }
    }
}
