pragma solidity ^0.4.23;

import "./RoleBased.sol";


/* a general purpose "ownership", intended to be mixed-in */
contract HasOwners is RoleBased {
  string constant private owner = "owner";

  constructor(address nominator) RoleBased(nominator) public { }

  modifier onlyOwner { require(isOwner(msg.sender)); _; }
  function isOwner(address subject) public constant returns (bool) { return isPlayer(owner, subject); }
  function getOwners() public constant returns (address[]) { return getPlayers(owner); }
  function addOwner(address subject) external { addPlayer(owner, subject); }
  function removeOwner(address subject) public { removePlayer(owner, subject); }
}
