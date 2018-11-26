import {address} from '../../src/web3'
import {ERC20TokenWrapper, TokenRegistry} from '../../src/help'


const version = require('../../package.json').version


const RoleBased = artifacts.require('RoleBasedExample')
const newRoleBased = async (owner) => RoleBased.new([address(owner)], version)


const Switchable = artifacts.require('./SwitchableExample.sol')
const newSwitchable = async (owner) => Switchable.new([address(owner)], version)


const ERC20Token = artifacts.require('HumanStandardToken')
const newERC20Token = async (initialAmount, name, decimals, symbol) => ERC20Token.new(initialAmount, name, decimals, symbol)


const createSupportedTokens = async () => Promise.all([
  newERC20Token(1e+9, 'all things cats', 9, 'MEOW'),
  newERC20Token(1e+6, 'all things dogs', 6, 'WOOF'),
].map(_ => _.then(_ => ERC20TokenWrapper.from(_)))).then(_ => TokenRegistry.create(_))


module.exports = {
  newRoleBased,
  newSwitchable,
  newERC20Token,
  createSupportedTokens,
}
