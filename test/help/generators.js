import uuid from 'uuid'
import {uint} from './web3'


export class TimestampGenerator {
  next() { return Date.now() }
}

export class NumberGenerator {
  counter = 0
  next() { return ++this.counter }
}

export class UuidGenerator {
  next() { return uint(uuid.v1()) }
}
