pragma solidity 0.4.24;


/* a general purpose event publish, intended to be mixed-in */
contract Loggable {

  enum Level {trace, debug, info, warn, error, fatal, none}

  Level public level = Level.none;

  function levelString() public constant returns (string result) {
    if (level == Level.trace) return "trace";
    if (level == Level.debug) return "debug";
    if (level == Level.info) return "info";
    if (level == Level.warn) return "warn";
    if (level == Level.error) return "error";
    if (level == Level.fatal) return "fatal";
    return "none";
  }

  function setLogLevel(uint _level) public {
    require(_level <= uint(Level.none));
    level = Level(_level);
  }

  function setLogLevelFromString(string _level) public {
    if (equals(_level, "trace")) level = Level.trace;
    else if (equals(_level, "debug")) level = Level.debug;
    else if (equals(_level, "info")) level = Level.info;
    else if (equals(_level, "warn")) level = Level.warn;
    else if (equals(_level, "error")) level = Level.error;
    else if (equals(_level, "fatal")) level = Level.fatal;
    else level = Level.none;
  }
  function equals(string a, string b) private pure returns (bool) {return keccak256(bytes(a)) == keccak256(bytes(b)); }

  function trace(string _message) public { if (level <= Level.trace) log(Level.trace, _message); }
  function debug(string _message) public { if (level <= Level.debug) log(Level.debug, _message); }
  function info(string _message) public { if (level <= Level.info) log(Level.info, _message); }
  function warn(string _message) public { if (level <= Level.warn) log(Level.warn, _message); }
  function error(string _message) public { if (level <= Level.error) log(Level.error, _message); }
  function fatal(string _message) public { if (level <= Level.fatal) log(Level.fatal, _message); }

  function log(Level _level, string _message) private {
    emit Log(_level, now, _message);
  }
  event Log(Level indexed level, uint timestamp, string message);
}
