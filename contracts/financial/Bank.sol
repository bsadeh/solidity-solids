pragma solidity ^0.4.21;

import "../external/Token.sol";
import "../Switchable.sol";
import "../HasOwners.sol";
import "./HasBankers.sol";
import "./Accountant.sol";


/*
  Bank holds funds (ETH or any ERC20 token).
  note that the Bank uses an Accountant to track fund allocations
*/
contract Bank is Switchable, HasOwners, HasBankers, Accountant {
  string public constant version = "1.0.0";
  address internal constant ETH = address(0x0); // a hack to allow tracking ether deposit/withdrawal

  function Bank(address nominator) HasOwners(nominator) HasBankers(nominator) public { }

  modifier validToken(address value) { require(isToken(value)); _; }
  function isToken(address value) pure private returns (bool) { return value != ETH; }

  function () external payable { deposit(msg.sender, ETH, msg.value); }
  function depositEther() external payable { deposit(msg.sender, ETH, msg.value); }

  // note: an account must call token.approve(contract, quantity) beforehand
  function depositToken(address token, uint quantity) validToken(token) external {
    require(Token(token).transferFrom(msg.sender, this, quantity));
    deposit(msg.sender, token, quantity);
  }

  function deposit(address account, address coin, uint quantity) private {
    credit(account, coin, quantity);
    emit Deposit(account, coin, quantity, balanceOf(account, coin));
  }
  event Deposit(address account, address coin, uint quantity, uint balance);

  function withdrawEther(address account, uint quantity) whenOn onlyBanker external { withdraw(account, ETH, quantity); }
  function withdrawToken(address account, address token, uint quantity) whenOn onlyBanker validToken(token) external { withdraw(account, token, quantity); }

  function withdraw(address account, address coin, uint quantity) private {
    debit(account, coin, quantity);
    require(isToken(coin) ? Token(coin).transfer(account, quantity) : msg.sender.send(quantity));
    emit Withdraw(account, coin, quantity, balanceOf(account, coin));
  }
  event Withdraw(address account, address coin, uint quantity, uint balance);
}