import {Map} from 'immutable'
import {uint, web3} from './web3'
import {throwEvmException} from './evm.pseudo'


const zero = uint(0)

export default class ERC20Token {
  static get(address) {
    if (!tokens.get(address)) throwEvmException('revert')
    return tokens.get(address)
  }

  constructor(initialAmount, tokenName, decimalUnits, tokenSymbol) {
    this.initialAmount = uint(initialAmount)
    this.tokenName = tokenName
    this.decimalUnits = uint(decimalUnits)
    this.tokenSymbol = tokenSymbol
    this.balances = Map().asMutable()
    this.allowed = Map().asMutable()
    this.address = web3.utils.randomHex(20)
    tokens.set(this.address, this)
  }

  transfer(to, value, msg = {})  {
    this.balances.update(msg.from, zero, x => x.sub(value))
    this.balances.update(to, zero, x => x.add(value))
    return Promise.resolve(true)
  }

  transferFrom(from, to, value, msg = {}) {
    this.balances.update(to, zero, x => x.add(value))
    this.balances.update(from, zero, x => x.sub(value))
    this.allowed.updateIn([from, msg.from], zero, x => x.sub(value))
    return Promise.resolve(true)
  }

  balanceOf(owner) {
    const value = this.balances.get(owner, zero)
    return Promise.resolve(value)
  }

  approve(spender, value, msg = {}) {
    this.allowed.setIn([msg.from, spender], value)
    return Promise.resolve(true)
  }

  allowance(owner, spender) {
    const value = this.allowed.getIn([owner, spender], zero)
    return Promise.resolve(value)
  }
}
const tokens = Map().asMutable()
