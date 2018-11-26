let patched = false
if (!patched) {
  require('./monkey-patching.Array')
  require('./monkey-patching.Function')
  require('./monkey-patching.Map')
  require('./monkey-patching.Number')
  require('./monkey-patching.String')
  patched = true
}
