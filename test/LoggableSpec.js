const LoggableExample = artifacts.require("LoggableExample")


contract('Loggable', function(accounts) {

  it("should respect log level when logging", async function () {
    let example = await LoggableExample.deployed()
    let result, events

    assert.equal(6, await example.level(), "default level")
    assert.equal("none", await example.levelString(), "default level")
    result = await example.testLog()
    events = extractEvents("Log", result)
    assert.equal(0, events.length, "none fired")

    await example.setLogLevel(5)
    assert.equal(5, await example.level(), "highest level")
    assert.equal("fatal", await example.levelString());
    result = await example.testLog();
    events = extractEvents("Log", result)
    assert.equal(1, events.length, "`fatal` is highest, so only it is fired")
    assert.equal("watch Ma, I'm fatal-ing", events[0].message)
    assert.equal(5, events[0].level)

    await example.setLogLevel(0)
    assert.equal(0, await example.level(), "lowest level")
    assert.equal("trace", await example.levelString());
    result = await example.testLog();
    events = extractEvents("Log", result)
    assert.equal(6, events.length, "all from level `trace` (lowest) to `fatal` (highest) are fired")
    assert.equal("watch Ma, I'm trace-ing", events[0].message)
    assert.equal("watch Ma, I'm debug-ing", events[1].message)
    assert.equal("watch Ma, I'm info-ing", events[2].message)
    assert.equal("watch Ma, I'm warn-ing", events[3].message)
    assert.equal("watch Ma, I'm error-ing", events[4].message)
    assert.equal("watch Ma, I'm fatal-ing", events[5].message)
    assert.equal(0, events[0].level)
    assert.equal(1, events[1].level)
    assert.equal(2, events[2].level)
    assert.equal(3, events[3].level)
    assert.equal(4, events[4].level)
    assert.equal(5, events[5].level)
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
