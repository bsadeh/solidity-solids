import HttpProvider from 'ethjs-provider-http'
import EthRPC from 'ethjs-rpc'
import {keccak256, toBuffer, web3} from './web3'


export const mineUpTo = async (blockNumber) => {
  const current = await web3.eth.getBlockNumber()
  const howMany = blockNumber - current
  if (howMany < 0)
    throw Error(`block number ${blockNumber} is in the past (current is ${current})`)
  mine(howMany)
}
export const mine = (howManyBlocks) => { for (let i = 0; i < howManyBlocks; i++) mine1() }

const eth = new EthRPC(new HttpProvider('http://localhost:8545'))
const mine1 = () => eth.sendAsync({ method: 'evm_mine' })
export const increaseTime = (time) => eth.sendAsync({ method: 'evm_increaseTime', params: [time] })
export const snapshot = () => eth.sendAsync({ method: 'evm_snapshot', params: [] })
export const revert = (snapshotId) => eth.sendAsync({ method: 'evm_revert', params: [snapshotId] })


export const isEvmExceptionTagged = (e, tag) => e.message === `VM Exception while processing transaction: ${tag}`
export const isRevertException = (e) => isEvmExceptionTagged(e, 'revert')
export const isInvalidOpcodeException = (e) => isEvmExceptionTagged(e, 'invalid opcode')

export const extractEvents = (name, result) => result.logs.filter(x => x.event === name).map(x => x.args)

/* returns the time of the last mined block in seconds */
export const latestTime = () => web3.eth.getBlock('latest').timestamp


// const SolidityEvent = require('web3/lib/web3/event.js')
// export const decodeLogs = (logs, contract, address) => {
//   return logs.map(each => {
//     const event = new SolidityEvent(null, contract.events[each.topics[0]], address)
//     return event.decode(each)
//   })
// }

/* Hash and add same prefix to the hash that testrpc use */
export const hashMessage = (message) => {
  const messageHex = Buffer.from(keccak256(message).toString('hex'), 'hex')
  const prefix = toBuffer(`\u0019Ethereum Signed Message:\n${messageHex.length}`)
  return bufferToHex(keccak256(toBuffer(prefix, messageHex)))
}
