const {List, Map} = require('immutable')

/*
  Base HD Path:  m/44'/60'/0'/0/{account_index}
 */
const mnemonic = 'trim laundry torch canal knee owner amount zero steel erode hood section'
const accounts = [
  '0x5b6879bc73aa755ff8b9e59ddd511ae0a8d95986',
  '0x8d4f35e410344712e13f4822b02a21eda5f5bf87',
  '0x75f4589d8b794ce6b49b8486b94d42f6afd6f99c',
  '0x02621a71efc46a7b5fed71805e7854a945c85114',
  '0x5533fed490ffed0a9abeb6c8da7189f32472664c',
  '0xa8a8b594a9a2929e17f9ca15a8618fe3bb5f9f25',
  '0x1c12a43e3d3b0012705e8f720b9973d3933d47b1',
  '0xdb14ef134e9ebca58b3177bd0bd5d6b524c3411e',
  '0x7c83ef119a483569af7c32b5b2e9af604cbe61ec',
  '0x17a61704a5dfdc6815fd891124ff07c8308afedf',
]
const privateKeys = [
  '0xfbf2e9541123f519f12368b63dde2602d077fb55144640ec18edba2ceec28943',
  '0x205039cf40ed070334f1d2824eaebb067e6dcd9101268a6cb6f9d7f413c7a1a0',
  '0xe10914f4ee5f3d7115da5f55457d54628cef2ee29a06755c29397e19fc04bbc3',
  '0xf18896807dbec8366df4e167312545b74287ae464c1a74e8969badd21fc770bf',
  '0x58973bfe1f86c990ca2812dd6e10edfdffe67e2f844e170c6d53bfd3cfa03982',
  '0xb5eb85297f7788549888797ddef2b4f6b711b1952f5cca70df90f052fafac93c',
  '0x85807bd490d0d8721efd9d01e9bb8562a45f68670f7069eb9ff633ca37dd7f6f',
  '0x8b1749b852423de9c0cdc3d4d4bed22296064b09f83e8b47e66f33ce6819d7e1',
  '0x0d4b1354647d590a651a95c6f831239da6f6710451d5c6ed50090d61ae03332f',
  '0x78bfa2bf4c658f1a86cc4ef52d9b5cab8bd3ac8bb5445418e4188b1024fe31e0',
]
const secrets = Map(List(accounts).zip(List(privateKeys)).toArray())

module.exports = {
  mnemonic,
  accounts,
  privateKeys,
  secrets,
}
