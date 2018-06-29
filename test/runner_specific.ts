import Jasmine = require("jasmine")
import { PeerDatabase } from "../src/network/peerDatabase";

const j = new Jasmine({})
const specific_files = [
    'test/PeerDatabase.spec.ts',
]

j.configureDefaultReporter({
    showColors: true,
})
j.execute(specific_files)
