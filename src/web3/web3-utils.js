import web3_utils from 'web3-utils'

const BN = web3_utils.BN
const toChecksumAddress = web3_utils.toChecksumAddress
const address = toChecksumAddress
const ether = (value) => web3_utils.toWei(value, 'ether')
const bytes32 = (val) => web3_utils.fromAscii(val).padEnd(66, '0')
const uint = web3_utils.toBN
const keccak256 = web3_utils.soliditySha3


module.exports = {address, BN, bytes32, ether, keccak256, toChecksumAddress, uint}
