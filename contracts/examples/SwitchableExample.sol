pragma solidity ^0.4.18;

import "../Switchable.sol";
import "../HasOwners.sol";


contract SwitchableExample is Switchable, HasOwners {

  int public counter = 1;

  function SwitchableExample(address nominator) HasOwners(nominator) public { }

  function increment() whenOn external { counter += 1; }
  function decrement() whenOff external { counter -= 1; }
}