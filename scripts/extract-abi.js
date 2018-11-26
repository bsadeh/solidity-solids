const fs = require('fs')

const source = './build/contracts'
const target = './src/contracts/abi'
const contracts = [
  'LoggableExample',
  'RoleBasedExample',
  'SwitchableExample',
]
contracts.forEach(_ => {
  const contract = JSON.parse(fs.readFileSync(`${source}/${_}.json`, 'utf8'))
  const contractWithJustAbi = { contractName: contract.contractName, abi: contract.abi }
  fs.writeFileSync(`${target}/${_}.json`, JSON.stringify(contractWithJustAbi, null, 2))
  console.log('extracting abi for:', contract.contractName)
})
const indexed = contracts.map(_ => `${_}: require('./${_}.json')`)
fs.writeFileSync(`${target}/index.js`, `module.exports = {\n\t${indexed.join(',\n\t')}\n}`)
