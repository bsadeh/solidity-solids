pragma solidity ^0.4.18;

import "../RoleBased.sol";


contract HasBankers is RoleBased {
  string constant private banker = "banker";

  function HasBankers(address nominator) RoleBased(nominator) public { }

  modifier onlyBanker { require(isBanker(msg.sender)); _; }
  function isBanker(address subject) public constant returns (bool) { return isPlayer(banker, subject); }
  function getBankers() public constant returns (address[]) { return getPlayers(banker); }
  function addBanker(address subject) external { addPlayer(banker, subject); }
  function removeBanker(address subject) public { removePlayer(banker, subject); }
}
