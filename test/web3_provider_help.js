const abi = require('ethereumjs-abi')
const Web3 = require('web3')
web3 = new Web3(web3.currentProvider)


// use web3.utils.soliditySha3 once web3 1.0 is available
const soliditySha3 = (type, value) => '0x' + abi.soliditySHA3([type], [value]).toString('hex')

const isRevertException = (e) => e.message === 'VM Exception while processing transaction: revert'

const extractEvents = (name, result) => result.logs.filter(x => x.event === name).map(x => x.args)

const mineUpTo = (blockNumber) => {
  const howMany = blockNumber - web3.eth.blockNumber
  if (howMany < 0)
    throw Error(`block number ${blockNumber} is in the past (current is ${web3.eth.blockNumber})`)
  mine(howMany)
}
const mine = (howManyBlocks) => { for (let i = 0; i < howManyBlocks; i++) mine1() }

const mine1 = async () => await web3.currentProvider.send({ method: "evm_mine" })
const increaseTime = async (time) => web3.currentProvider.send({ method: 'evm_increaseTime', params: [time] })
const snapshot = async () => web3.currentProvider.send({ method: 'evm_snapshot', params: [] })
const revert = async (snapshotId) => web3.currentProvider.send({ method: 'evm_revert', params: [snapshotId] })


module.exports = {
  soliditySha3,
  isRevertException,
  extractEvents,
  mineUpTo,
  mine,
  increaseTime,
  snapshot,
  revert,
}
