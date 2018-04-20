import fs = require("fs")
export = JSON.parse(fs.readFileSync("./data/config.json", "utf-8"))
