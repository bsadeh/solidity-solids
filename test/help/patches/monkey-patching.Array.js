import _ from 'lodash/array'
import math from 'lodash/math'


require('./monkey-patching').bless([
  [Array, 'rotateLeft', function (A, n=1) { for(let i = 0; i < n % A.length; i++) A.push(A.shift()); return A }],
  [Array, 'rotateRight', function (A, n=1) { for(let i = 0; i < n % A.length; i++) A.splice(0, 0, A.pop()); return A }],
  [Array, 'zipWith', function (zipper, ...args) { return _.zipWith(...args, zipper) }],

  [Array.prototype, 'addOne', function (element) { this.push(element); return this }],
  [Array.prototype, 'all', function (λ) { return this.every(λ) }],
  [Array.prototype, 'any', function (λ) { return this.some(λ) }],
  [Array.prototype, 'chunk', function (size=1) { return _.chunk(this, size) }],
  [Array.prototype, 'compact', function () { return _.compact(this) }],
  [Array.prototype, 'copy', function () { return [].concat(this) }],
  [Array.prototype, 'countBy', function (that, λ) { return _.countBy(this, that, λ) }],
  [Array.prototype, 'difference', function (that) { return _.difference(this, that) }],
  [Array.prototype, 'differenceBy', function (that, λ) { return _.differenceBy(this, that, λ) }],
  [Array.prototype, 'drop', function (n=1) { return _.drop(this, n) }],
  [Array.prototype, 'dropWhile', function (λ) { return _.dropWhile(this, λ) }],
  [Array.prototype, 'dropRight', function (n=1) { return _.dropRight(this, n) }],
  [Array.prototype, 'dropRightWhile', function (λ) { return _.dropRightWhile(this, λ) }],
  [Array.prototype, 'filterNot', function (λ) { return _.reject(this, λ) }],
  [Array.prototype, 'findLast', function (λ) { return this[_.findLastIndex(this, λ)] }],
  [Array.prototype, 'first', function () { return _.first(this) }],
  [Array.prototype, 'forEachRight', function (λ) { return _.forEachRight(this, λ) }],
  [Array.prototype, 'flatMap', function (λ) { return _.flatten(this.map(λ)) }],
  [Array.prototype, 'flattenDeep', function () { return _.flattenDeep(this) }],
  [Array.prototype, 'flattenDepth', function (depth) { return _.flattenDepth(this, depth) }],
  [Array.prototype, 'get', function (i) { return this[i] }],
  [Array.prototype, 'groupBy', function (λ) { return _.groupBy(this, λ) }],
  [Array.prototype, 'has', function (value) { return this.includes(value) }],
  [Array.prototype, 'head', function () { return _.head(this) }],
  [Array.prototype, 'initial', function () { return _.initial(this) }],
  [Array.prototype, 'intersection', function (that) { return _.intersection(this, that) }],
  [Array.prototype, 'intersectionBy', function (that, λ) { return _.intersectionBy(this, that, λ) }],
  [Array.prototype, 'last', function () { return _.last(this) }],
  [Array.prototype, 'nth', function (n=0) { return _.nth(this, n) }],
  [Array.prototype, 'orderBy', function (properties, orders) { return _.orderBy(this, properties, orders) }],
  [Array.prototype, 'partition', function (λ) { return _.partition(this, λ) }],
  [Array.prototype, 'product', function(that) { return this.reduce((_, _1) => _.concat(that.map(_2 => [_1, _2])), []) }],
  [Array.prototype, 'reject', function (λ) { return _.reject(this, λ) }],
  [Array.prototype, 'remove', function (λ) { return _.remove(this, λ) }],
  [Array.prototype, 'reversed', function () { return this.copy().reverse() }],
  [Array.prototype, 'rotateLeft', function (n=1) { return Array.rotateLeft(this.copy(), n) }],
  [Array.prototype, 'rotateRight', function (n=1) { return Array.rotateRight(this.copy(), n) }],
  [Array.prototype, 'sample', function () { return _.sample(this) }],
  [Array.prototype, 'sampleSize', function (n=1) { return _.sampleSize(this, n) }],
  [Array.prototype, 'shuffle', function () { return _.shuffle(this) }],
  [Array.prototype, 'size', function () { return this.length }],
  [Array.prototype, 'skip', function (n=1) { return this.drop(n) }],
  [Array.prototype, 'sortBy', function (λ) { return _.sortBy(this, λ) }],
  [Array.prototype, 'tail', function () { return _.tail(this) }],
  [Array.prototype, 'take', function (n=1) { return _.take(this, n) }],
  [Array.prototype, 'takeWhile', function (λ) { return _.takeWhile(this, λ) }],
  [Array.prototype, 'takeRight', function (n=1) { return _.takeRight(this, n) }],
  [Array.prototype, 'takeRightWhile', function (λ) { return _.takeRightWhile(this, λ) }],
  [Array.prototype, 'unique', function () { return _.uniq(this) }],
  [Array.prototype, 'uniqueBy', function (that, λ) { return _.uniqBy(this, that, λ) }],
  [Array.prototype, 'union', function (that) { return _.union(this, that) }],
  [Array.prototype, 'unionBy', function (that, λ) { return _.unionBy(this, that, λ) }],
  [Array.prototype, 'unzip', function () { return _.unzip(this) }],
  [Array.prototype, 'without', function (that) { return _.without(this, that) }],
  [Array.prototype, 'xor', function (that) { return _.xor(this, that) }],
  [Array.prototype, 'xorBy', function (that, λ) { return _.xorBy(this, that, λ) }],
  [Array.prototype, 'zip', function (that) { return _.zip(this, that) }],

  [Array.prototype, 'max', function () { return math.max(this) }],
  [Array.prototype, 'maxBy', function (λ) { return math.maxBy(this, λ) }],
  [Array.prototype, 'mean', function () { return math.mean(this) }],
  [Array.prototype, 'meanBy', function (λ) { return math.meanBy(this, λ) }],
  [Array.prototype, 'min', function () { return math.min(this) }],
  [Array.prototype, 'minBy', function (λ) { return math.minBy(this, λ) }],
  [Array.prototype, 'sum', function () { return math.sum(this) }],
  [Array.prototype, 'sumBy', function (λ) { return math.sumBy(this, λ) }],
])
