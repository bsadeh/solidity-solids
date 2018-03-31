pragma solidity ^0.4.19;

import "../Validating.sol";
import "./HasBankers.sol";

/*
  Accountant tracks deposits/withdrawals of funds (ETH or any ERC20 token).
  note that the Accountant does not actually hold the funds!
*/
contract Accountant is Validating {
  string public constant version = "1.0.0";
  address internal constant ETH = address(0x0); // a hack to allow tracking ether deposit/withdrawal

  /* mapping of coins to mapping of account balances (coin => account => balance) */
  mapping (address => mapping (address => uint)) public balances;


  function balanceOf(address account, address coin) constant public returns (uint) {
    return balances[coin][account];
  }

  function credit(address account, address coin, uint quantity) validAddress(account) isPositive(quantity) internal {
    balances[coin][account] += quantity;
  }

  function debit(address account, address coin, uint quantity) validAddress(account) isPositive(quantity) internal {
    require(balanceOf(account, coin) >= quantity);
    balances[coin][account] -= quantity;
  }

  function transfer(
    address from_account, address from_coin, uint from_quantity,
    address to_account, address to_coin, uint to_quantity
  ) internal {
    debit(from_account, from_coin, from_quantity);
    credit(to_account, to_coin, to_quantity);
  }
}

