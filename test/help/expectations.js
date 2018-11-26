import expect from 'expect'
import {address, recover, uint} from '../../src/web3'


expect.extend({
  toBeSignedBy(params, signer) {
    const {hash, signature} = params
    return recover(hash, signature) === signer ?
      { message: () => `expected hash: ${hash} & signature: ${signature} to not be signed by ${signer}`, pass: true } :
      { message: () => `expected hash: ${hash} & signature: ${signature} to be signed by ${signer}`, pass: false }
  }
})

expect.extend({
  toHaveSize(received, value) {
    return received.size === value ?
      { message: () => `expected ${received} not to have size ${value}`, pass: true } :
      { message: () => `expected ${received} to have size ${value} (but was ${received.size})`, pass: false }
  }
})

expect.extend({
  toInclude(received, item) {
    return received.includes(item) ?
      { message: () => `expected ${received} not to include ${item}`, pass: true } :
      { message: () => `expected ${received} to include ${item}`, pass: false }
  }
})

expect.extend({
  toEqualAddress(received, value) {
    return address(received) === address(value) ?
      { message: () => `expected address ${received} not to equal to address ${value}`, pass: true } :
      { message: () => `expected address ${received} to equal to address ${value}`, pass: false }
  }
})

/**************************************************** BN to BN ********************************************************/

expect.extend({
  toBeLessThanBN(received, value) {
    value = uint(value)
    return received.lt(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be less than BN ${value.toString(10)}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be less than BN ${value.toString(10)}`, pass: false }
  }
})

expect.extend({
  toBeLessThanOrEqualBN(received, value) {
    value = uint(value)
    return received.lte(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be less than or equal to BN ${value.toString(10)}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be less than or equal to BN ${value.toString(10)}`, pass: false }
  }
})

expect.extend({
  toEqualBN(received, value) {
    value = uint(value)
    return received.eq(value) ?
      { message: () => `expected BN ${received.toString(10)} not to equal to BN ${value.toString(10)}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to equal to BN ${value.toString(10)}`, pass: false }
  }
})

expect.extend({
  toBeGreaterThanOrEqualBN(received, value) {
    value = uint(value)
    return received.gte(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be greater than or equal to BN ${value.toString(10)}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be greater than or equal to BN ${value.toString(10)}`, pass: false }
  }
})

expect.extend({
  toBeGreaterThanBN(received, value) {
    value = uint(value)
    return received.gt(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be greater than BN ${value.toString(10)}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be greater than BN ${value.toString(10)}`, pass: false }
  }
})

/************************************************** BN to Number ******************************************************/

expect.extend({
  toBeLessThanNumber(received, value) {
    return received.ltn(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be less than ${value}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be less than ${value}`, pass: false }
  }
})

expect.extend({
  toBeLessThanOrEqualNumber(received, value) {
    return received.lten(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be less than or equal to ${value}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be less than or equal to ${value}`, pass: false }
  }
})

expect.extend({
  toEqualNumber(received, value) {
    return received.eqn(value) ?
      { message: () => `expected BN ${received.toString(10)} not to equal to ${value}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to equal to ${value}`, pass: false }
  }
})



expect.extend({
  toBeGreaterThanOrEqualNumber(received, value) {
    return received.gten(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be greater than or equal to ${value}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be greater than or equal to ${value}`, pass: false }
  }
})

expect.extend({
  toBeGreaterThanNumber(received, value) {
    return received.gtn(value) ?
      { message: () => `expected BN ${received.toString(10)} not to be greater than ${value}`, pass: true } :
      { message: () => `expected BN ${received.toString(10)} to be greater than ${value}`, pass: false }
  }
})
