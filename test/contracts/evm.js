import Web3 from 'web3'
import {promisify} from 'util'
import {uint} from '../../src/web3'

const _web3_ = new Web3(web3.currentProvider)

const getBlockNumber = async () => _web3_.eth.getBlockNumber()
const getBlockTimestamp = async () => _web3_.eth.getBlockNumber().then(_ => _web3_.eth.getBlockByNumber(_).timestamp)
const getBalance = async (address) => _web3_.eth.getBalance(address).then(_ => uint(parseInt(_)))
const getEtherBalances = async (parties) => Promise.all(parties.map(_ => getBalance(_)))
const getTokenBalances = async (token, parties) => Promise.all(parties.map(_ => token.balanceOf(_).then(_ => uint(_))))
const getGasCost = async (txInfo) => {
  const transaction = await _web3_.eth.getTransaction(txInfo.tx)
  return uint(transaction.gasPrice).muln(txInfo.receipt.gasUsed)
}

const sendEther = async (to, value, msg = {}) => {
  return _web3_.eth.sendTransaction({from: msg.from, to, value})
}


const evmMineUpTo = async (blockNumber) => {
  const current = await _web3_.eth.getBlockNumber()
  const howMany = blockNumber - current
  if (howMany <= 0) return; else await evmMine(howMany)
}
const evmMine = (howManyBlocks) => { for (let i = 0; i < howManyBlocks; i++) evmMine1() }

const sendAsync = promisify(_web3_.currentProvider.sendAsync)
const evmMine1 = async () => sendAsync({ method: 'evm_mine' })
const increaseTime = async (time) => sendAsync({ method: 'evm_increaseTime', params: [time.toNumber()] })
const snapshot = async () => sendAsync({ method: 'evm_snapshot', params: [] })
const revert = async (snapshotId) => sendAsync({ method: 'evm_revert', params: [snapshotId] })


const isEvmExceptionTagged = (e, tag) => new RegExp(`VM Exception while processing transaction: ${tag}\$`).test(e.message)
const isRevertException = (e) => isEvmExceptionTagged(e, 'revert')
const isInvalidOpcodeException = (e) => isEvmExceptionTagged(e, 'invalid opcode')

const extractEvents = (name, result) => result.logs.filter(_ => _.event === name).map(_ => convertAllBigNumberToBN(_.args))

const convertAllBigNumberToBN = (subject) => {
  Object.entries(subject).forEach(([key, value]) => {
    if (value.constructor.name === 'BigNumber') subject[key] = uint(value)
  })
  return subject
}


module.exports = {
  evmMine,
  evmMineUpTo,
  extractEvents,
  getBlockNumber,
  getBlockTimestamp,
  getBalance,
  getEtherBalances,
  getGasCost,
  getTokenBalances,
  increaseTime,
  isEvmExceptionTagged,
  isInvalidOpcodeException,
  isRevertException,
  revert,
  sendEther,
  snapshot,
}
