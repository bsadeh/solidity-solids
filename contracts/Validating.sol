pragma solidity ^0.4.18;


contract Validating {

  modifier validAddress(address value) { require(value != address(0x0));  _; }

  modifier notEmpty(string value) { require(bytes(value).length != 0); _; }

  modifier notZero(uint value) { require(value != 0); _; }
  modifier isPositive(uint value) { require(value > 0); _; }
  modifier isNegative(uint value) { require(value < 0); _; }
}
