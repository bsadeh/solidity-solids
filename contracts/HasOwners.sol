pragma solidity ^0.4.18;

import "./RoleBased.sol";


contract HasOwners is RoleBased {
  string constant private role = "owner";

  function HasOwners(address nominator) RoleBased(nominator) public { }

  modifier onlyOwner { if (isPlayer(role, msg.sender)) _; }
  function isOwner(address subject) public constant returns (bool) { return isPlayer(role, subject); }
  function getOwners() public constant returns (address[]) { return getPlayers(role); }
  function addOwner(address subject) external { addPlayer(role, subject); }
  function removeOwner(address subject) public { removePlayer(role, subject); }
}
