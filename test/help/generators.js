import uuid from 'uuid'
import {web3} from './web3'


export class TimestampGenerator {
  next() { return Date.now() }
}

export class NumberGenerator {
  constructor(start = 0) {
    this.current = start
  }
  next() { return ++this.current }
}

export class UuidGenerator {
  next() { return new web3.utils.BN(uuid.v1()) }
}
