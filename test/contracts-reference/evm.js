import EventEmitter from  'events'
import {List, Map} from 'immutable'
import {uint} from '../../src/web3'


const zero = uint(0)

class Blocks extends EventEmitter {
  constructor(start = 0) {
    super()
    this.number = start
    this.timestamp = uint(Math.floor(Date.now() / 1000 /* in seconds */))
  }
  advanceBlocks(howMany = 1) {
    for (let i = 0; i < howMany; i++) {
      this.number += 1
      super.emit('data', {number: this.number})
    }
  }
  advanceTime(time) { this.timestamp = time }
  unsubscribe(callback) { super.removeListener('data', callback) }
}
const blocks = new Blocks(1)
const getBlockNumber = () => blocks.number
const getBlockTimestamp = () => blocks.timestamp

class EtherWallet {
  constructor() {
    this.balances = Map().asMutable()
  }
  get(address) { return this.balances.get(address, zero) }
  set(address, value) { this.balances.set(address, value) }
  add(value, address) { this.balances.update(address, zero, x => x.add(value)) }
  deduct(value, address) { this.balances.update(address, zero, x => x.sub(value)) }
  transfer(v, from, to) {
    const value = uint(v)
    if (this.get(from).lt(value)) throw Error(`insufficient ETH for address ${from}`)
    this.deduct(value, from)
    this.add(value, to)
    return true
  }
  bootstrap(accounts = []) {
    this.balances.clear()
    accounts.forEach(_ => this.set(_, uint(1e+20)))
  }
}
const wallet = new EtherWallet()

const getGasCost = (txInfo) => zero
const getBalance = (address) => wallet.get(address)
const getEtherBalances = (parties) => Promise.all(parties.map(_ => getBalance(_)))
const getTokenBalances = (token, parties) => Promise.all(parties.map(_ => token.balanceOf(_)))

const sendEther = async (to, value, msg = {}) => wallet.transfer(value, msg.from, to)


const evmMineUpTo = async (blockNumber) => {
  const current = blocks.number
  const howMany = blockNumber - current
  if (howMany <= 0) return; else await evmMine(howMany)
}
const evmMine = (howManyBlocks) => blocks.advanceBlocks(howManyBlocks)

const increaseTime = (t) => {
  const time = uint(t)
  if (time.lt(blocks.timestamp)) throw Error(`time ${time.toString(10)} is in the past (it's currently ${blocks.timestamp.toString(10)})`)
  blocks.advanceTime(time)
}
const snapshot = () => { throw Error('not implemented') }
const revert = (snapshotId) => { throw Error('not implemented') }


const throwEvmException = (tag) => { throw Error(`VM Exception while processing transaction: ${tag}`) }
const isEvmExceptionTagged = (e, tag) => new RegExp(`VM Exception while processing transaction: ${tag}\$`).test(e.message)
const isRevertException = (e) => isEvmExceptionTagged(e, 'revert')
const isInvalidOpcodeException = (e) => isEvmExceptionTagged(e, 'invalid opcode')

const events = List().asMutable()
const extractEvents = (name, result) => events.filter(_ => _.constructor.name === name).toArray()


/************************* solidity language keywords *******************************/

const block = blocks

const emit = async (event) => {
  evmMine(1)
  event.returnValues = Object.assign({}, event)
  event.blockNumber = getBlockNumber()
  return events.unshift(event)
}

module.exports = {
  block,
  blocks,
  emit,
  events,
  evmMine,
  evmMineUpTo,
  extractEvents,
  getBalance,
  getBlockNumber,
  getBlockTimestamp,
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
  throwEvmException,
  wallet,
}
