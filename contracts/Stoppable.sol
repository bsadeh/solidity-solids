pragma solidity 0.4.24;


/* using a master switch, allowing to permanently turn-off functionality */
contract Stoppable {

  /************************************ abstract **********************************/
  modifier onlyOwner { _; }
  /********************************************************************************/

  bool public isOn = true;

  modifier whenOn() { require(isOn, "must be on"); _; }
  modifier whenOff() { require(!isOn, "must be off"); _; }

  function switchOff() external onlyOwner {
    if (isOn) {
      isOn = false;
      emit Off();
    }
  }
  event Off();
}
