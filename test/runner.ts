import Jasmine = require("jasmine")

const j = new Jasmine({})

j.loadConfigFile("jasmine-ts.json")
j.configureDefaultReporter({
    showColors: true,
})
j.execute()
