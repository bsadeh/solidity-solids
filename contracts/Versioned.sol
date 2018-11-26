pragma solidity 0.4.24;


contract Versioned {
  string public version;

  constructor(string _version) public {
    version = _version;
  }

}
