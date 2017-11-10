const LoggableExample = artifacts.require("./examples/LoggableExample.sol")

module.exports = async function(deployer) {
  await deployer.deploy([
    LoggableExample,
  ])
}
