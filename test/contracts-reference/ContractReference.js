import EventEmitter from 'events'
import randomHex from 'randomhex'
import {address} from '../../src/web3'
import {emit} from './evm'


class ContractReference extends EventEmitter {
  static register(contract) { this.registry.set(contract.address, contract) }
  static get(contractAddress) { return this.registry.get(contractAddress) }

  constructor() {
    super()
    this.address = address(randomHex(20))
    this.events = []
    ContractReference.register(this)
  }

  __require__(predicate, message = 'revert') {
    if (!predicate) throw Error(`VM Exception while processing transaction: ${message}`)
  }

  emit(event) {
    const error = undefined
    super.emit(event.constructor.name, error, event)
    this.events.push(event)
    return emit(event)
  }

  getPastEvents(name, options = {}) {
    options.topics = [name]
    return this.getLogs(options)
  }

  getLogs(filter = {}) {
    const {fromBlock, toBlock, topics} = Object.assign({fromBlock: 'earliest', toBlock: 'latest', topics: []}, filter)
    const from = fromBlock === 'earliest' ? 0 : fromBlock
    const to = toBlock === 'latest' ? Number.MAX_SAFE_INTEGER : toBlock
    const eventNames = new Set(topics)
    const found = this.events.
      filter(_ => eventNames.has(_.constructor.name)).
      filter(_ => from <= _.blockNumber && _.blockNumber <= to)
    found.forEach(_ => _.data = _)
    return found
  }
}
ContractReference.registry = new Map()


module.exports = {ContractReference}
