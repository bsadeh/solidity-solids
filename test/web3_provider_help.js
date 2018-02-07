const Web3 = require('web3')
web3 = new Web3(web3.currentProvider)


const extractEvents = (name, result) => result.logs.filter(x => x.event === name).map(x => x.args)

const mineUpToBlock = async (blockNumber) => mineBlocks(blockNumber - await web3.eth.blockNumber)
const mineBlocks = async (howMany) => { for (let i = 0; i < howMany; i++) await web3.currentProvider.send({method: "evm_mine"}) }

const timeTravel = async (time) => web3.currentProvider.send({
  method: 'evm_increaseTime',
  params: [time],
  id: new Date().getTime()
})


module.exports = {
  extractEvents,
  mineUpToBlock,
  mineBlocks,
  timeTravel,
}
