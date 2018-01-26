pragma solidity ^0.4.18;

import "../Loggable.sol";


contract LoggableExample is Loggable {
  function testLog() public {
    trace("watch Ma, I'm trace-ing");
    debug("watch Ma, I'm debug-ing");
    info("watch Ma, I'm info-ing");
    warn("watch Ma, I'm warn-ing");
    error("watch Ma, I'm error-ing");
    fatal("watch Ma, I'm fatal-ing");
  }
}