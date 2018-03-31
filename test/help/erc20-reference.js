import {Map} from 'immutable'
import {web3} from './web3'


export class ERC20Token {
  balances = Map().asMutable()
  allowed = Map().asMutable()

  constructor(initialAmount, tokenName, decimalUnits, tokenSymbol) {
    this.initialAmount = initialAmount
    this.tokenName = tokenName
    this.decimalUnits = decimalUnits
    this.tokenSymbol = tokenSymbol
    this._address = web3.utils.randomHex(20)
  }

  get address() { return this._address}

  transfer(to, value, msg = {})  {
    this.balances.update(msg.from, 0, x => x - value)
    this.balances.update(to, 0, x => x + value)
    return true
  }

  transferFrom(from, to, value, msg = {}) {
    this.balances.update(to, 0, x => x + value)
    this.balances.update(from, 0, x => x - value)
    this.allowed.updateIn([from, msg.from], 0, x => x - value)
    return true
  }

  balanceOf(owner) {
    return this.balances.get(owner, 0)
  }

  approve(spender, value, msg = {}) {
    this.allowed.setIn([msg.from, spender], value)
    return true
  }

  allowance(owner, spender) {
    return this.allowed.getIn([owner, spender], 0)
  }
}
