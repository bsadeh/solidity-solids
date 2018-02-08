pragma solidity ^0.4.18;

import "./RoleBased.sol";


contract HasReaders is RoleBased {
  string constant private reader = "reader";

  function HasReaders(address nominator) RoleBased(nominator) public { }

  modifier onlyReader { if (isPlayer(reader, msg.sender)) _; }
  function isReader(address subject) public constant returns (bool) { return isPlayer(reader, subject); }
  function getReaders() public constant returns (address[]) { return getPlayers(reader); }
  function addReader(address subject) external { addPlayer(reader, subject); }
  function removeReader(address subject) public { removePlayer(reader, subject); }
}
