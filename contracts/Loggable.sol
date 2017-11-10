pragma solidity ^0.4.18;


contract Loggable {

  event Log(Level indexed level, uint time, string message);

  enum Level {trace, debug, info, warn, error, fatal, none}
  Level public level = Level.none;

  function levelString() public constant returns (string result) {
//    uint l = uint(level);
//    assembly {
//      switch l
//      case 0 {mstore(result, "trace")}
//      case 1 {mstore(result, "debug")}
//      case 2 {mstore(result, "info")}
//      case 3 {mstore(result, "warn")}
//      case 4 {mstore(result, "error")}
//      case 5 {mstore(result, "fatal")}
//      default {mstore(result, "none")}
//    }
    if (uint(level) == 0) return "trace";
    else if (uint(level) == 1) return "debug";
    else if (uint(level) == 2) return "info";
    else if (uint(level) == 3) return "warn";
    else if (uint(level) == 4) return "error";
    else if (uint(level) == 5) return "fatal";
    else return "none";
  }

  function setLogLevel(uint _level) public {
    require(uint(Level.none) >= _level);
    level = Level(_level);
  }

  function trace(string _message) public {if (level <= Level.trace) log(Level.trace, _message);}
  function debug(string _message) public {if (level <= Level.debug) log(Level.debug, _message);}
  function info(string _message) public {if (level <= Level.info) log(Level.info, _message);}
  function warn(string _message) public {if (level <= Level.warn) log(Level.warn, _message);}
  function error(string _message) public {if (level <= Level.error) log(Level.error, _message);}
  function fatal(string _message) public {if (level <= Level.fatal) log(Level.fatal, _message);}

  function log(Level _level, string _message) private {Log(_level, now, _message);}
}