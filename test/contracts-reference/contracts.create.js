import {address} from '../../src/web3'
import {TokenRegistry} from '../../src/help'
import {ERC20Token} from './external/ERC20Token-reference'
import {RoleBasedExample} from './examples/RoleBasedExample-reference'
import {SwitchableExample} from './examples/SwitchableExample-reference'


const version = require('../../package.json').version


const newRoleBased = async (owner) => new RoleBasedExample([address(owner)], version)


const newSwitchable = async (owner) => new SwitchableExample([address(owner)], version)


const newERC20Token = (initialAmount, name, decimals, symbol) => ERC20Token.new(initialAmount, name, decimals, symbol)


const createSupportedTokens = () => TokenRegistry.create([
  newERC20Token(1e+9, 'all things cats', 9, 'MEOW'),
  newERC20Token(1e+6, 'all things dogs', 6, 'WOOF'),
])


module.exports = {
  newRoleBased,
  newSwitchable,
  newERC20Token,
  createSupportedTokens,
}
