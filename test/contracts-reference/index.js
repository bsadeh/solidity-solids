module.exports = Object.assign({},
  require('../../src/help'),
  require('./contracts.create'),
  require('./evm'),
  require('./external/ERC20Token-reference'),
  require('./examples/LoggableExample-reference'),
  require('./examples/RoleBasedExample-reference'),
  require('./examples/SwitchableExample-reference'),
)
