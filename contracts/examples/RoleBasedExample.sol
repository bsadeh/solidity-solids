pragma solidity ^0.4.18;

import "../RoleBased.sol";


contract RoleBasedExample is RoleBased {

  function RoleBasedExample(address nominator) public {
    initialNominator(nominator);
  }

  modifier onlyOwner { if (isPlayer("owner", msg.sender)) _;}
  function isOwner(address owner) public constant returns (bool) { return isPlayer("owner", owner); }
  function getOwners() public constant returns (address[]) { return getPlayers("owner"); }
  function addOwner(address owner) external { addPlayer("owner", owner); }
  function removeOwner(address owner) public { removePlayer("owner", owner); }

  uint public counter = 1;
  function increment() onlyOwner external { counter += 1; }
}