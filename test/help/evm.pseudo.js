import {List, Map} from 'immutable'
import {uint} from './web3'


const zero = uint(0)

class Blocks {
  constructor(start = 0) {
    this.number = start
    this.timestamp = uint(Math.floor(Date.now() / 1000 /* in seconds */))
  }
  advanceBlocks(howMany = 1) { this.number += howMany }
  advanceTime(time) { this.timestamp = time }
}
export const blocks = new Blocks(1)
export const getBlockNumber = () => Promise.resolve(blocks.number)
export const getBlockTimestamp = () => Promise.resolve(blocks.timestamp)

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
    return Promise.resolve(true)
  }
  bootstrap(accounts = []) {
    this.balances.clear()
    accounts.forEach(_ => this.set(_, uint(1e+20)))
  }
}
export const wallet = new EtherWallet()
export const getBalance = (address) => Promise.resolve(wallet.get(address))

export const mineUpTo = async (blockNumber) => {
  const current = blocks.number
  const howMany = blockNumber - current
  if (howMany < 0) throw Error(`block number ${blockNumber} is in the past (it's currently ${current})`)
  mine(howMany)
}
export const mine = (howManyBlocks) => blocks.advanceBlocks(howManyBlocks)

export const increaseTime = (t) => {
  const time = uint(t)
  if (time.lt(blocks.timestamp)) throw Error(`time ${time.toString(10)} is in the past (it's currently ${blocks.timestamp.toString(10)})`)
  blocks.advanceTime(time)
}
export const snapshot = () => { throw Error('not implemented') }
export const revert = (snapshotId) => { throw Error('not implemented') }


export const throwEvmException = (tag) => { throw Error(`VM Exception while processing transaction: ${tag}`) }
export const isEvmExceptionTagged = (e, tag) => e.message === `VM Exception while processing transaction: ${tag}`
export const isRevertException = (e) => isEvmExceptionTagged(e, 'revert')
export const isInvalidOpcodeException = (e) => isEvmExceptionTagged(e, 'invalid opcode')

export const events = List().asMutable()
export const extractEvents = (name, result) => events.filter(x => x.constructor.name === name).toArray()
