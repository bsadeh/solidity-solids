const Migrations = artifacts.require("./external/Migrations.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations)
}
