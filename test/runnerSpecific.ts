import Jasmine = require("jasmine")

const j = new Jasmine({})
const specificFiles = [
    "test/PeerDatabase.spec.ts",
]
j.configureDefaultReporter({
    showColors: true,
})
j.execute(specificFiles)
