pragma solidity ^0.4.18;

import "../Switchable.sol";


contract SwitchableExample is Switchable {

  uint public counter = 1;

  function increment() onlyOwner whenOn external { counter += 1; }
  function decrement() onlyOwner whenOff external { counter -= 1; }
}