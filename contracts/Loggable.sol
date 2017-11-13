pragma solidity ^0.4.18;


contract Loggable {

  event Log(Level indexed level, uint time, string message);

  enum Level {trace, debug, info, warn, error, fatal, none}
  Level public level = Level.none;

  function levelString() public constant returns (string result) {
//    uint l = uint(level);
//    assembly {
//      switch l
//      case 0 {result := "trace"}
//      case 1 {result := "debug"}
//      case 2 {result := "info"}
//      case 3 {result := "warn"}
//      case 4 {result := "error"}
//      case 5 {result := "trace"}
//      default {result := "fatal"}
//    }
    var _level_ = uint(level);
    if (0 == _level_) return "trace";
    if (1 == _level_) return "debug";
    if (2 == _level_) return "info";
    if (3 == _level_) return "warn";
    if (4 == _level_) return "error";
    if (5 == _level_) return "fatal";
    return "none";
  }

  function setLogLevel(uint _level) public {
    require(uint(Level.none) >= _level);
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
  function equals(string a, string b) private pure returns (bool) {return keccak256(a) == keccak256(b);}

  function trace(string _message) public {if (level <= Level.trace) log(Level.trace, _message);}
  function debug(string _message) public {if (level <= Level.debug) log(Level.debug, _message);}
  function info(string _message) public {if (level <= Level.info) log(Level.info, _message);}
  function warn(string _message) public {if (level <= Level.warn) log(Level.warn, _message);}
  function error(string _message) public {if (level <= Level.error) log(Level.error, _message);}
  function fatal(string _message) public {if (level <= Level.fatal) log(Level.fatal, _message);}

  function log(Level _level, string _message) private {Log(_level, now, _message);}
}