const child_process = require('child_process')
const process = require('process')
const blockchain = require("ganache-cli")

blockchain.server().listen(8545)

const truffle = child_process.spawn('truffle', ['test'])
truffle.stdout.on('data', (data) => process.stdout.write(data.toString()))
truffle.stderr.on('data', (data) => process.stdout.write(data.toString()))
truffle.on('exit', (code) => process.exit(code))
