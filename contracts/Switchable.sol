pragma solidity 0.4.24;

import "./Stoppable.sol";


/* using a master switch, allowing to switch functionality on/off */
contract Switchable is Stoppable {

  function switchOn() external onlyOwner {
    if (!isOn) {
      isOn = true;
      emit On();
    }
  }
  event On();
}
