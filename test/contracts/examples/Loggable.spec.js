import expect from 'expect'
import {extractEvents} from '..'


const Loggable = artifacts.require('LoggableExample')


contract('Loggable', (_) => {
  let contract

  before(async () => { contract = await Loggable.new() })

  it('should respect log level when logging', async () => {
    function expectLogged(fromLevel, howMany, events, description) {
      const possibilities = [
        { level: 0, message: "watch Ma, I'm trace-ing"},
        { level: 1, message: "watch Ma, I'm debug-ing"},
        { level: 2, message: "watch Ma, I'm info-ing"},
        { level: 3, message: "watch Ma, I'm warn-ing"},
        { level: 4, message: "watch Ma, I'm error-ing"},
        { level: 5, message: "watch Ma, I'm fatal-ing"}
      ]
      expect(events.length).toEqual(howMany)
      for (let i = 0; i < events.length; i++) {
        let expected = possibilities[fromLevel + i]
        let {level, timestamp, message} = events[i]
        expect(level).toEqualBN(expected.level)
        expect(message).toEqual(expected.message)
      }
    }

    let atLevel, result, events

    atLevel = 6
    expect(await contract.level()).toEqualBN(atLevel)
    expect(await contract.levelString()).toEqual('none')
    result = await contract.testLog()
    events = extractEvents('Log', result)
    expectLogged(atLevel, 0, events, 'none fired')

    atLevel = 5
    // await contract.setLogLevel(atLevel)
    await contract.setLogLevelFromString('fatal')
    expect(await contract.level()).toEqualBN(atLevel)
    expect(await contract.levelString()).toEqual('fatal')
    result = await contract.testLog()
    events = extractEvents('Log', result)
    expectLogged(atLevel, 1, events, '`fatal` is highest, so only it is fired')

    atLevel = 0
    await contract.setLogLevel(atLevel)
    expect(await contract.level()).toEqualBN(0)
    expect(await contract.levelString()).toEqual('trace')
    result = await contract.testLog()
    events = extractEvents('Log', result)
    expectLogged(atLevel, 6, events, 'all from level `trace` (lowest) to `fatal` (highest) are fired')
  })

})
