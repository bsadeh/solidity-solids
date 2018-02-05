pragma solidity ^0.4.18;

import './HasOwners.sol';


/* using a master switch, allowing to switch functionality on/off */
contract Switchable is HasOwners {
  event On();
  event Off();

  bool public isOn = true;


  modifier whenOn() { require(isOn); _; }

  modifier whenOff() { require(!isOn); _; }

  function switchOn() onlyOwner whenOff external {
    isOn = true;
    On();
  }

  function switchOff() onlyOwner whenOn external {
    isOn = false;
    Off();
  }
}
