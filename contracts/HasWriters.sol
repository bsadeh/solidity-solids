pragma solidity ^0.4.18;

import "./RoleBased.sol";


contract HasWriters is RoleBased {
  string constant private writer = "writer";

  function HasWriters(address nominator) RoleBased(nominator) public { }

  modifier onlyWriter { if (isPlayer(writer, msg.sender)) _; }
  function isWriter(address subject) public constant returns (bool) { return isPlayer(writer, subject); }
  function getWriters() public constant returns (address[]) { return getPlayers(writer); }
  function addWriter(address subject) external { addPlayer(writer, subject); }
  function removeWriter(address subject) public { removePlayer(writer, subject); }
}
