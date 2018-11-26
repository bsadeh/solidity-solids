import _ from 'lodash/function'


require('./monkey-patching').bless([
  [Function, 'bundle', function () {
    const functions = Array.from(arguments)
    return function () {
      const args = arguments
      return functions.map(function (λ) { return λ.apply(this, args) }.bind(this))
    }
  }],
  [Function, 'enslave', function (λ) {
    return function () { return λ.bind(null, this).apply(null, arguments) }
  }],
  [Function, 'liberate', Function.prototype.bind.bind(Function.prototype.call)],
  [Function, 'memoize', function (λ, keyGen) {
    const cache = {}
    keyGen = keyGen || ((args) => JSON.stringify(args))
    return function () {
      const args = Array.from(arguments), key = keyGen(args)
      if (cache[key] === undefined) cache[key] = λ.apply(null, args)
      return cache[key]
    }
  }],

  // [Function.prototype, '∘', function (other) {
  [Function.prototype, 'compose', function (other) {
    const chain = [this].concat(Array.from(arguments))
    return function () {
      return chain.reduceRight((prev, curr) => [curr.apply(null, prev)], Array.from(arguments)).pop()
    }
  }],
  [Function.prototype, 'curry', function (arity) { return _.curry(this, arity || this.length) }],
  [Function.prototype, 'curryRight', function (arity) { return _.curryRight(this, arity || this.length) }],
  [Function.prototype, 'delay', function (wait, ...args) { return _.delay(this, wait, args) }],
  [Function.prototype, 'iterate', function (last) {
    const that = this
    return function () { return last = that(last) }
  }],
  [Function.prototype, 'memoize', function (resolver) { return _.memoize(this, resolver) }],
  [Function.prototype, 'then', function (λ) {
    const that = this
    return () => λ(that.apply(null, arguments))
  }],
  [Function.prototype, 'reducerify', function (initialValue) {
    const λ = this
    return arguments.length ?
      function () { return Array.from(arguments).reduce(λ, initialValue) } :
      function () { return Array.from(arguments).reduce(λ) }
  }],
])
