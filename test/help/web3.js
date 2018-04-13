import ethUtil from 'ethereumjs-util'
import {account} from 'eth-lib'
import Web3 from 'web3'

export let web3
web3 = new Web3(typeof web3 === 'undefined' ?
  new Web3.providers.HttpProvider('http://localhost:8545') :
  web3.currentProvider)

export const getBalance = (address) => web3.eth.getBalance(address).then(_ => parseInt(_))

export const toBuffer = ethUtil.toBuffer
export const bufferToHex = (...buffers) => ethUtil.bufferToHex(Buffer.concat(buffers))

export const toBN = web3.utils.toBN
export const uint = (value) => new web3.utils.BN(value)
export const bytes32 = web3.utils.fromAscii
export const ether = (value) => web3.utils.toWei(value, 'ether')
export const keccak256 = web3.utils.soliditySha3

export const sign = account.sign
export const recover = (hash, signature) => account.recover(hash, signature).toLowerCase()
