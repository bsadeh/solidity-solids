pragma solidity ^0.4.18;

import "../HasOwners.sol";


contract RoleBasedExample is HasOwners {

  uint public counter = 1;

  function RoleBasedExample(address nominator) HasOwners(nominator) public { }

  function increment() onlyOwner external { counter += 1; }
}