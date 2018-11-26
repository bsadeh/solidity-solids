import {keccak256, uint} from '../../../src'
import {ContractReference} from '../ContractReference'


class LoggableExample extends ContractReference {
  constructor() {
    super()
    this.level = Level.none
  }

  levelString() {
    if (this.level === Level.trace) return "trace"
    if (this.level === Level.debug) return "debug"
    if (this.level === Level.info) return "info"
    if (this.level === Level.warn) return "warn"
    if (this.level === Level.error) return "error"
    if (this.level === Level.fatal) return "fatal"
    return "none"
  }

  setLogLevel(level) {
    this.__require__(level <= Level.none)
    this.level = Level[level]
  }

  setLogLevelFromString(level) {
    if (this.equals(level, "trace")) this.level = Level.trace
    else if (this.equals(level, "debug")) this.level = Level.debug
    else if (this.equals(level, "info")) this.level = Level.info
    else if (this.equals(level, "warn")) this.level = Level.warn
    else if (this.equals(level, "error")) this.level = Level.error
    else if (this.equals(level, "fatal")) this.level = Level.fatal
    else this.level = Level.none
  }

  equals(a, b) { return keccak256(a) === keccak256(b) }

  trace(message) { if (this.level <= Level.trace) this.log(Level.trace, message) }
  debug(message) { if (this.level <= Level.debug) this.log(Level.debug, message) }
  info(message) { if (this.level <= Level.info) this.log(Level.info, message) }
  warn(message) { if (this.level <= Level.warn) this.log(Level.warn, message) }
  error(message) { if (this.level <= Level.error) this.log(Level.error, message) }
  fatal(message) { if (this.level <= Level.fatal) this.log(Level.fatal, message) }

  log(level, message) { return this.emit(new Log(level, Date.now(), message)) }


  testLog() {
    this.trace("watch Ma, I'm trace-ing")
    this.debug("watch Ma, I'm debug-ing")
    this.info("watch Ma, I'm info-ing")
    this.warn("watch Ma, I'm warn-ing")
    this.error("watch Ma, I'm error-ing")
    this.fatal("watch Ma, I'm fatal-ing")
  }
}

const Level = {trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5, none: 6}
class Log {
  /**
   * @param {uint} level
   * @param {uint} timestamp
   * @param {string} message
   */
  constructor(level, timestamp, message) {
    this.level = uint(level)
    this.timestamp = uint(timestamp)
    this.message = message
  }
}


module.exports = {LoggableExample}


