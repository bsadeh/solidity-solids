pragma solidity ^0.4.23;

import "../RoleBased.sol";


/* a general purpose "readership", intended to be mixed-in */
contract HasReaders is RoleBased {
  string constant private reader = "reader";

  constructor(address nominator) RoleBased(nominator) public { }

  modifier onlyReader { require(isReader(msg.sender)); _; }
  function isReader(address subject) public constant returns (bool) { return isPlayer(reader, subject); }
  function getReaders() public constant returns (address[]) { return getPlayers(reader); }
  function addReader(address subject) external { addPlayer(reader, subject); }
  function removeReader(address subject) public { removePlayer(reader, subject); }
}
