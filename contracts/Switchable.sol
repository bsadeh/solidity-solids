pragma solidity ^0.4.19;


/* using a master switch, allowing to switch functionality on/off */
contract Switchable {

  /************************************ abstract **********************************/
  modifier onlyOwner { _; }
  /********************************************************************************/

  bool public isOn = true;


  modifier whenOn() { require(isOn); _; }
  modifier whenOff() { require(!isOn); _; }

  function switchOn() onlyOwner external { if (!isOn) { isOn = true; emit On(); } }
  event On();

  function switchOff() onlyOwner external { if (isOn) { isOn = false; emit Off(); } }
  event Off();
}
