import _ from 'lodash/string'


require('./monkey-patching').bless([
  [String.prototype, 'camelCase', function () { return _.camelCase(this) }],
  [String.prototype, 'capitalize', function () { return _.capitalize(this) }],
  [String.prototype, 'deburr', function () { return _.deburr(this) }],
  [String.prototype, 'escapeHtml', function () { return _.escape(this) }],
  [String.prototype, 'escapeRegExp', function () { return _.escapeRegExp(this) }],
  [String.prototype, 'kebabCase', function () { return _.kebabCase(this) }],
  [String.prototype, 'lowerCase', function () { return _.lowerCase(this) }],
  [String.prototype, 'lowerFirst', function () { return _.lowerFirst(this) }],
  [String.prototype, 'pad', function (length=0, chars=' ') { return _.pad(this, length, chars) }],
  [String.prototype, 'parseInt', function () { return _.parseInt(this) }],
  [String.prototype, 'reverse', function () { return this.split('').reverse().join('') }],
  [String.prototype, 'size', function () { return this.length }],
  [String.prototype, 'snakeCase', function () { return _.snakeCase(this) }],
  [String.prototype, 'startCase', function () { return _.startCase(this) }],
  [String.prototype, 'toLower', function () { return _.toLower(this) }],
  [String.prototype, 'toUpper', function () { return _.toUpper(this) }],
  [String.prototype, 'truncate', function (options={length: 30, omission: '...'}) { return _.truncate(this, options) }],
  [String.prototype, 'unescapeHtml', function () { return _.unescape(this) }],
  [String.prototype, 'upperCase', function () { return _.upperCase(this) }],
  [String.prototype, 'upperFirst', function () { return _.upperFirst(this) }],
  [String.prototype, 'words', function () { return _.words(this) }],
])
