const LoggableExample = artifacts.require("./examples/LoggableExample.sol")
const SwitchableExample = artifacts.require("./examples/SwitchableExample.sol")
const RoleBasedExample = artifacts.require("./examples/RoleBasedExample.sol")
const Storage = artifacts.require("./storage/Storage.sol")
const Bank = artifacts.require("./financial/Bank.sol")


module.exports = async function(deployer, network, [, nominator]) {
  await deployer.deploy(LoggableExample)
  await deployer.deploy(SwitchableExample, nominator)
  await deployer.deploy(RoleBasedExample, nominator)
  await deployer.deploy(Storage, nominator)
  await deployer.deploy(Bank, nominator)
}
