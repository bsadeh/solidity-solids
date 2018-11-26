require('./monkey-patching').bless([
  [Map.prototype, 'map', function (λ) { return Array.from(this, λ) }],
])
