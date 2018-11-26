import Web3 from 'web3'
const eth = new Web3().eth
const ETH = '0x'+'0'.repeat(40)
const address_0 = '0x'+'0'.repeat(40)

module.exports = Object.assign({eth, ETH, address_0},
  require('./ethereumjs-util'),
  require('./web3-utils'),
)
