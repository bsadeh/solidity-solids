import ethUtil from 'ethereumjs-util'
import {account} from 'eth-lib'
import Web3 from 'web3'

export let web3
web3 = new Web3(typeof web3 === 'undefined' ?
  new Web3.providers.HttpProvider('http://localhost:8545') :
  web3.currentProvider)


export const toBuffer = ethUtil.toBuffer
export const bufferToHex = (...buffers) => ethUtil.bufferToHex(Buffer.concat(buffers))

export const uint = web3.utils.toBN
export const bytes32 = (val) => web3.utils.fromAscii(val).padEnd(66, '0')
export const ether = (value) => web3.utils.toWei(value, 'ether')
export const keccak256 = web3.utils.soliditySha3

export const sign = account.sign
export const recover = (hash, signature) => account.recover(hash, signature).toLowerCase()
