require('@babel/register')
// require('./test/help/patches')
require('./test/help/expectations')
// global.Promise = require('bluebird')

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 21,
      showTimeSpent: true,
    }
  }
}
