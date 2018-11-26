pragma solidity 0.4.24;


contract Validating {

  modifier validAddress(address value) { require(value != address(0x0), "invalid address");  _; }
  modifier notEmpty(string text) { require(bytes(text).length != 0, "invalid empty string"); _; }
  modifier notZero(uint number) { require(number != 0, "invalid 0 value"); _; }
  modifier isPositive(uint value) { require(value > 0); _; }
  modifier isNegative(uint value) { require(value < 0); _; }

}
