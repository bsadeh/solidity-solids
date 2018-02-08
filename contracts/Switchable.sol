pragma solidity ^0.4.18;


/* using a master switch, allowing to switch functionality on/off */
contract Switchable {

  /************************************ abstract **********************************/
  modifier onlyOwner { _; }
  /********************************************************************************/

  bool public isOn = true;


  modifier whenOn() { require(isOn); _; }
  modifier whenOff() { require(!isOn); _; }

  function switchOn() onlyOwner whenOff external { isOn = true; On(); }
  event On();

  function switchOff() onlyOwner whenOn external { isOn = false; Off(); }
  event Off();
}
