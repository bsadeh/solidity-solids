import abi from 'ethereumjs-abi'
import Web3 from 'web3'
web3 = new Web3(web3.currentProvider)


// use web3.utils.soliditySha3 once web3 1.0 is available
export const soliditySha3 = (type, value) => '0x' + abi.soliditySHA3([type], [value]).toString('hex')

export const isRevertException = (e) => e.message === 'VM Exception while processing transaction: revert'

export const extractEvents = (name, result) => result.logs.filter(x => x.event === name).map(x => x.args)

export const mineUpTo = (blockNumber) => {
  const howMany = blockNumber - web3.eth.blockNumber
  if (howMany < 0)
    throw Error(`block number ${blockNumber} is in the past (current is ${web3.eth.blockNumber})`)
  mine(howMany)
}
export const mine = (howManyBlocks) => { for (let i = 0; i < howManyBlocks; i++) mine1() }

const mine1 = async () => await web3.currentProvider.send({ method: "evm_mine" })
export const increaseTime = async (time) => web3.currentProvider.send({ method: 'evm_increaseTime', params: [time] })
export const snapshot = async () => web3.currentProvider.send({ method: 'evm_snapshot', params: [] })
export const revert = async (snapshotId) => web3.currentProvider.send({ method: 'evm_revert', params: [snapshotId] })
