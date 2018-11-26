pragma solidity 0.4.24;

import "../HasOwners.sol";
import "../Versioned.sol";


contract RoleBasedExample is HasOwners, Versioned {

  uint public counter = 1;

  constructor(address nominator, string version) HasOwners(nominator) Versioned(version) public { }

  function increment() onlyOwner external { counter += 1; }
}
