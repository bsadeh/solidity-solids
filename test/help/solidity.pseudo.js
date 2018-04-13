import {blocks, events} from './evm.pseudo'


export const block = blocks

export const require = (predicate, message = 'revert') => {
  if (!predicate) throw Error(`VM Exception while processing transaction: ${message}`)
}

export const emit = (event) => Promise.resolve(events.unshift(event))