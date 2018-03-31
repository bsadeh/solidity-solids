module.exports = {
  testCommand: 'truffle test --network coverage',
  testrpcOptions: `--port 8555 -i coverage --noVMErrorsOnRPCResponse`,
  skipFiles: ['external/*.sol']
}