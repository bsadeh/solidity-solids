import etheruemjs_util from 'ethereumjs-util'

const bufferToHex = (...buffers) => etheruemjs_util.bufferToHex(Buffer.concat(buffers))
const toBuffer = etheruemjs_util.toBuffer

const sign = (hash, signer) => {
  const {v, r, s} = etheruemjs_util.ecsign(toBuffer(hash), toBuffer(signer))
  return etheruemjs_util.toRpcSig(v, r, s)
}

const recover = (hash, signature) => {
  const {v, r, s} = etheruemjs_util.fromRpcSig(signature)
  const publicKey = etheruemjs_util.ecrecover(toBuffer(hash), v, r, s)
  return etheruemjs_util.toChecksumAddress(bufferToHex(etheruemjs_util.publicToAddress(publicKey)))
}


module.exports = {bufferToHex, toBuffer, sign, recover}
