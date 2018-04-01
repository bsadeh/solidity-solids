"use strict";

const child_process = require('child_process')
const process = require('process')
const ganache = require("ganache-cli")
const secrets = require('./test/secrets')
const { networks } = require('./truffle')

const options = {
  mnemonic: secrets.mnemonic,
  debug: true,
  // logger: console,
  port: networks.development.port,
}
ganache.server(options).listen(networks.development.port)

const truffle = child_process.spawn('truffle', ['test'])
truffle.stdout.on('data', (data) => process.stdout.write(data.toString()))
truffle.stderr.on('data', (data) => process.stdout.write(data.toString()))
truffle.on('exit', (code) => process.exit(code))
