import BigNumber from 'bignumber.js'
import ethUtil from 'ethereumjs-util'
import Web3 from 'web3'

export let web3
web3 = new Web3(typeof web3 === 'undefined' ? new Web3.providers.HttpProvider('http://localhost:8545') : web3.currentProvider)

export const toBuffer = (value) => ethUtil.toBuffer(value)
export const bufferToHex = (...buffers) => ethUtil.bufferToHex(Buffer.concat(buffers))

export const string = (value) => web3.utils.toHex(value)
export const uint = (value, base) => new BigNumber(value, base)
export const ether = (n) => new BigNumber(web3.toWei(n, 'ether'))

export const keccak256 = (...args) => web3.utils.soliditySha3(...args)
export const sign = (dataToSign, privateKey) => {
  const {v, r, s} = ethUtil.ecsign(toBuffer(dataToSign), toBuffer(privateKey))
  return {
    v: v,
    r: bufferToHex(r),
    s: bufferToHex(s)
  }
}
export const ecrecover = (dataThatWasSigned, v, r, s) => {
  const publicKey = ethUtil.ecrecover(toBuffer(dataThatWasSigned), v, toBuffer(r), toBuffer(s))
  const recovered = ethUtil.publicToAddress(bufferToHex(publicKey))
  return bufferToHex(recovered)
}
