pragma solidity ^0.4.18;

import "../RoleBased.sol";


contract RoleBasedExample is RoleBased {

  function RoleBasedExample(address[] owners) public {
    setPlayers("owner", owners);
  }

  modifier onlyOwner { require(isPlayer("owner", msg.sender)); _; }

  function isOwner(address owner) public constant returns (bool) { return isPlayer("owner", owner); }

  function getOwners() public constant returns (address[]) { return getPlayers("owner"); }

  function addOwner(address owner) external onlyOwner { addPlayer("owner", owner); }

  function removeOwner(address owner) public onlyOwner { removePlayer("owner", owner); }
}