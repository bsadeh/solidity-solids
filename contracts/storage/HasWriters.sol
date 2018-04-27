pragma solidity ^0.4.23;

import "../RoleBased.sol";


/* a general purpose "writership", intended to be mixed-in */
contract HasWriters is RoleBased {
  string constant private writer = "writer";

  constructor(address nominator) RoleBased(nominator) public { }

  modifier onlyWriter { require(isWriter(msg.sender)); _; }
  function isWriter(address subject) public constant returns (bool) { return isPlayer(writer, subject); }
  function getWriters() public constant returns (address[]) { return getPlayers(writer); }
  function addWriter(address subject) external { addPlayer(writer, subject); }
  function removeWriter(address subject) public { removePlayer(writer, subject); }
}
