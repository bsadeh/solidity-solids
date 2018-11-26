import {Map} from 'immutable'
import {uint} from '../../../src'
import {throwEvmException} from '..'
import {ContractReference} from '../ContractReference'


const zero = uint(0)

/**
  reference implementation of ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
*/
class ERC20Token extends ContractReference {
  static get(address) { return tokens.get(address) ? tokens.get(address) : throwEvmException('revert') }
  static set(address, token) { tokens.set(address, token) }

  static new(initialAmount, tokenName, decimalUnits, tokenSymbol) {
    const token = new ERC20Token(initialAmount, tokenName, decimalUnits, tokenSymbol)
    this.set(token.address, token)
    return token
  }

  constructor(initialAmount, tokenName, decimalUnits, tokenSymbol, msg = {}) {
    super()
    this.totalSupply = uint(initialAmount)
    this.tokenName = tokenName
    this.decimalUnits = uint(decimalUnits)
    this.tokenSymbol = tokenSymbol
    this.balances = Map().asMutable()
    this.allowed = Map().asMutable()
  }

  name() { return this.tokenName }
  symbol() { return this.tokenSymbol }
  decimals() { return this.decimalUnits }

  toObject() {
    return {
      address: this.address,
      name: this.name(),
      symbol: this.symbol(),
      decimals: this.decimals().toString(10),
    }
  }
  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  async transfer(_to, _value, msg = {})  {
    const value = uint(_value)
    this.balances.update(msg.from, zero, x => x.sub(value))
    this.balances.update(_to, zero, x => x.add(value))
    this.emit(new Transfer(msg.from, _to, value))
    return true
  }

  /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
  /// @param _from The address of the sender
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  async transferFrom(_from, _to, _value, msg = {}) {
    const value = uint(_value)
    this.balances.update(_to, zero, x => x.add(value))
    this.balances.update(_from, zero, x => x.sub(value))
    this.allowed.updateIn([_from, msg.from], zero, x => x.sub(value))
    this.emit(new Transfer(_from, _to, value))
    return true
  }

  /// @param _owner The address from which the balance will be retrieved
  /// @return The balance
  async balanceOf(_owner) { return this.balances.get(_owner, zero) }

  /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @param _value The amount of tokens to be approved for transfer
  /// @return Whether the approval was successful or not
  async approve(_spender, _value, msg = {}) {
    const value = uint(_value)
    this.allowed.setIn([msg.from, _spender], value)
    this.emit(new Approval(msg.from, _spender, value))
    return true
  }

  /// @param _owner The address of the account owning tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  async allowance(_owner, _spender) { return this.allowed.getIn([_owner, _spender], zero) }
}

const tokens = Map().asMutable()


class Transfer {
  /**
   * @param {address} from
   * @param {address} to
   * @param {uint} value
   */
  constructor(from, to, value) {
    this.from = address(from)
    this.to = address(to)
    this.value = uint(value)
  }
}

class Approval {
  /**
   * @param {address} owner
   * @param {address} spender
   * @param {uint} value
   */
  constructor(owner, spender, value) {
    this.owner = address(owner)
    this.spender = address(spender)
    this.value = uint(value)
  }
}


module.exports = {ERC20Token}
