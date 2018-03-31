require("source-map-support").install()
require("babel-register")()

const { mnemonic } = require('./test/secrets')
const HDWalletProvider = require('truffle-hdwallet-provider')

const walletProvider = (url) => new HDWalletProvider(mnemonic, url)

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
    },
    coverage: {
      host: 'localhost',
      port: 8555,
      network_id: '*',
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    ropsten: {
      provider: walletProvider('https://ropsten.infura.io'),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000,
    },
    mainnet: {
      provider: walletProvider('https://mainnet.infura.io'),
      network_id: 1,
      gas: 4500000,
      gasPrice: 4000000000,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}