const LoggableExample = artifacts.require("./examples/LoggableExample.sol")
const RoleBasedExample = artifacts.require("./examples/RoleBasedExample.sol")

module.exports = async function(deployer) {
  await deployer.deploy([
    LoggableExample,
    RoleBasedExample,
  ])
}
