import _ from 'lodash/number'
import math from 'lodash/math'
import {Range} from 'immutable'


require('./monkey-patching').bless([
  [Number.prototype, 'clamp', function (lower, upper) { return _.clamp(this, lower, upper) }],
  [Number.prototype, 'inRange', function (start, end) { return _.inRange(this, start, end) }],
  [Number.prototype, 'limit', function (lower, upper) { return _.clamp(this, lower, upper) }],
  [Number.prototype, 'random', function (lower=0, upper=1, floating=false) { return _.random(this, lower, upper, floating) }],
  [Number.prototype, 'times', function (λ) { return Range(0, this).toArray().map(i => λ(i)) }],
  [Number.prototype, 'to', function (limit) { return Range(this, limit).toArray() }],

  [Number.prototype, 'add', function (that) { return math.add(this, that) }],
  [Number.prototype, 'divide', function (that) { return math.divide(this, that) }],
  [Number.prototype, 'div', function (that) { return math.divide(this, that) }],
  [Number.prototype, 'multiply', function (that) { return math.multiply(this, that) }],
  [Number.prototype, 'mul', function (that) { return math.multiply(this, that) }],
  [Number.prototype, 'subtract', function (that) { return math.subtract(this, that) }],
  [Number.prototype, 'sub', function (that) { return math.subtract(this, that) }],

  [Number.prototype, 'ceil', function (precision=0) { return math.ceil(this, precision) }],
  [Number.prototype, 'floor', function (precision=0) { return math.floor(this, precision) }],
  [Number.prototype, 'round', function (precision=0) { return math.round(this, precision) }],
])
