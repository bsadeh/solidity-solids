import {toChecksumAddress, ETH, uint} from '../web3'


/**
 * a dynamic system-wide registry for supported ERC20 tokens
 */
class TokenRegistry {
  static create(tokens) { return this.from(tokens.concat([ether, none])) }
  static from(assets) {
    const registry = new TokenRegistry()
    assets.forEach(_ => registry.add(_))
    const handler = {
      get: (target, property, receiver) => target.hasSymbol(property) ?
        target.findBySymbol(property) :
        Reflect.get(target, property, receiver)
    }
    return new Proxy(registry, handler)
  }

  constructor() {
    this.byName = new Map()
    this.byAddress = new Map()
  }

  get tokens() { return Array.from(this.byName.values()) }

  add(token) {
    this.byName.set(token.tokenSymbol, token)
    this.byAddress.set(toChecksumAddress(token.address), token)
  }

  hasSymbol(symbol) { return this.byName.has(symbol) }
  findBySymbol(symbol) { return this.byName.get(symbol) }

  hasAddress(address) { return !!this.byAddress.get(toChecksumAddress(address)) }
  findByAddress(address) { return this.byAddress.get(toChecksumAddress(address)) }

  toObject() { return this.tokens.map(_ => _.toObject()) }
}

/**
 * If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a ... Token
 *
 * use this class to extract info of known deployed ERC20 tokens, thenregister it map a TokenRegistry
 */
class TokenLike {
  constructor(address, tokenName, decimalUnits, tokenSymbol) {
    this.address = toChecksumAddress(address)
    this.tokenName = tokenName
    this.decimalUnits = decimalUnits
    this.tokenSymbol = tokenSymbol
  }

  async name() { return this.tokenName }
  async symbol() { return this.tokenSymbol }
  async decimals() { return uint(this.decimalUnits) }

  toObject() {
    return {
      address: this.address,
      name: this.tokenName,
      symbol: this.tokenSymbol,
      decimals: this.decimalUnits,
    }
  }
}

const ether = new TokenLike(ETH, 'Ether', 0, 'ETH')
const none = new TokenLike('0x'+'f'.repeat(40), 'None', 0, '空')


/**
 * If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a ... Token
 *
 * use this class to "cache" info & enhance already deployed ERC20 tokens, then register map a TokenRegistry
 */
class ERC20TokenWrapper extends TokenLike {
  static async from(token) {
    return new ERC20TokenWrapper(token, token.address, await token.name(), await token.decimals(), await token.symbol())
  }

  constructor(token, address, tokenName, decimalUnits, tokenSymbol) {
    super(address, tokenName, decimalUnits.toNumber(), tokenSymbol)
    this.token = token
  }

  async transfer(_to, _value, msg = {})  { return this.token.transfer(_to, _value, msg) }
  async transferFrom(_from, _to, _value, msg = {}) { return this.token.transferFrom(_from, _to, _value, msg) }
  async balanceOf(_owner) { return this.token.balanceOf(_owner) }
  async approve(_spender, _value, msg = {}) { return this.token.approve(_spender, _value, msg ) }
  async allowance(_owner, _spender) { return this.token.allowance(_owner, _spender) }
}


module.exports = {TokenRegistry, TokenLike, ERC20TokenWrapper}
