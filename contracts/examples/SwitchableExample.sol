pragma solidity 0.4.24;

import "../Switchable.sol";
import "../HasOwners.sol";
import "../Versioned.sol";


contract SwitchableExample is Switchable, HasOwners, Versioned {

  int public counter = 1;

  constructor(address nominator, string version) HasOwners(nominator) Versioned(version) public { }

  function increment() whenOn external { counter += 1; }
  function decrement() whenOff external { counter -= 1; }
}
