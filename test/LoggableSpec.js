const LoggableExample = artifacts.require("LoggableExample")

contract('Loggable', function(accounts) {
  it("should respect log level when logging", async function () {
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
        let {level, timestamp, message} = events[i];
        assert.equal(expected.level, level)
        assert.equal(expected.message, message)
      }
    }

    let example = await LoggableExample.deployed()
    let atLevel, result, events

    atLevel = 6
    assert.equal(atLevel, await example.level(), "default level")
    assert.equal("none", await example.levelString(), "default level")
    result = await example.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 0, events, "none fired")

    atLevel = 5
    // await example.setLogLevel(atLevel)
    await example.setLogLevelFromString("fatal")
    assert.equal(atLevel, await example.level(), "highest level")
    assert.equal("fatal", await example.levelString())
    result = await example.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 1, events, "`fatal` is highest, so only it is fired")

    atLevel = 0
    await example.setLogLevel(atLevel)
    assert.equal(0, await example.level(), "lowest level")
    assert.equal("trace", await example.levelString())
    result = await example.testLog()
    events = extractEvents("Log", result)
    expectLogged(atLevel, 6, events, "all from level `trace` (lowest) to `fatal` (highest) are fired")
  })

})


function extractEvents(eventName, result) {
  let results = []
  for (let i = 0; i < result.logs.length; i++) {
    let log = result.logs[i]
    if (log.event == eventName) results.push(log.args)
  }
  return results
}
