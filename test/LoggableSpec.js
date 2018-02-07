const { extractEvents } = require('./web3_provider_help')

const Contract = artifacts.require("LoggableExample")

contract('Loggable', (accounts) => {
  let contract

  before(async () => {
    contract = await Contract.deployed()
  })

  it("should respect log level when logging", async () => {
    function expectLogged(fromLevel, howMany, events, description) {
      const possibilities = [
        {level: 0, message: "watch Ma, I'm trace-ing"},
        {level: 1, message: "watch Ma, I'm debug-ing"},
        {level: 2, message: "watch Ma, I'm info-ing"},
        {level: 3, message: "watch Ma, I'm warn-ing"},
        {level: 4, message: "watch Ma, I'm error-ing"},
        {level: 5, message: "watch Ma, I'm fatal-ing"}
      ]
      assert.equal(howMany, events.length, description)
      for (let i = 0; i < events.length; i++) {
        let expected = possibilities[fromLevel + i]
        let {level, timestamp, message} = events[i]
        assert.equal(expected.level, level)
        assert.equal(expected.message, message)
      }
    }

    let atLevel, result, events

    atLevel = 6
    assert.equal(atLevel, await contract.level(), "default level")
    assert.equal("none", await contract.levelString(), "default level")
    result = await contract.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 0, events, "none fired")

    atLevel = 5
    // await contract.setLogLevel(atLevel)
    await contract.setLogLevelFromString("fatal")
    assert.equal(atLevel, await contract.level(), "highest level")
    assert.equal("fatal", await contract.levelString())
    result = await contract.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 1, events, "`fatal` is highest, so only it is fired")

    atLevel = 0
    await contract.setLogLevel(atLevel)
    assert.equal(0, await contract.level(), "lowest level")
    assert.equal("trace", await contract.levelString())
    result = await contract.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 6, events, "all from level `trace` (lowest) to `fatal` (highest) are fired")
  })

})
