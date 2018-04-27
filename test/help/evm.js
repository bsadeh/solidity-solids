import HttpProvider from 'ethjs-provider-http'
import EthRPC from 'ethjs-rpc'
import {keccak256, toBuffer, web3} from './web3'

export const getBalance = (address) => web3.eth.getBalance(address).then(_ => parseInt(_))

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
export const increaseTime = (time) => eth.sendAsync({ method: 'evm_increaseTime', params: [time.toNumber()] })
export const snapshot = () => eth.sendAsync({ method: 'evm_snapshot', params: [] })
export const revert = (snapshotId) => eth.sendAsync({ method: 'evm_revert', params: [snapshotId] })


export const isEvmExceptionTagged = (e, tag) => e.message === `VM Exception while processing transaction: ${tag}`
export const isRevertException = (e) => isEvmExceptionTagged(e, 'revert')
export const isInvalidOpcodeException = (e) => isEvmExceptionTagged(e, 'invalid opcode')

export const extractEvents = (name, result) => result.logs.filter(x => x.event === name).map(x => x.args)

export const getBlockNumber = () => web3.eth.getBlockNumber()
export const getBlockTimestamp = () => web3.eth.getBlockNumber().then(_ => web3.eth.getBlock(_)).then(_ => _.timestamp)


/* Hash and add same prefix to the hash that testrpc use */
export const hashMessage = (message) => {
  const messageHex = Buffer.from(keccak256(message).toString('hex'), 'hex')
  const prefix = toBuffer(`\u0019Ethereum Signed Message:\n${messageHex.length}`)
  return bufferToHex(keccak256(toBuffer(prefix, messageHex)))
}
