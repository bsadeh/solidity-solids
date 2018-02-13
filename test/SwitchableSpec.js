import expect from 'expect.js'
import { isRevertException } from './web3_provider_help'

const Contract = artifacts.require('SwitchableExample')


contract('Switchable', ([anyone, nominator, owner]) => {
  let contract

  before(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, { from: nominator })
  })

  it('it is switched on in the beginning', async () => {
    expect(await contract.getNominators()).to.eql([nominator])
    expect(await contract.getOwners()).to.eql([owner])
    assert(await contract.isOn())
  })

  it('can be switched on/off', async () => {
    assert.isTrue(await contract.isOn())

    try {
      await contract.switchOff()
      fail('only owners can switch on/off')
    } catch (e) {
      assert(isRevertException(e))
    }
    try {
      await contract.switchOff({ from: nominator })
      fail('only owners can switch on/off')
    } catch (e) {
      assert(isRevertException(e))
    }
    assert.isTrue(await contract.isOn())
    await contract.switchOff({ from: owner })
    assert.isFalse(await contract.isOn())

    try {
      await contract.switchOn()
      fail('only owners can switch on/off')
    } catch (e) {
      assert(isRevertException(e))
    }
    try {
      await contract.switchOn({ from: nominator })
      fail('only owners can switch on/off')
    } catch (e) {
      assert(isRevertException(e))
    }
    assert.isFalse(await contract.isOn())

    await contract.switchOn({ from: owner })
  })

  it('can increment only when switched on', async () => {
    assert.isTrue(await contract.isOn())

    const count = (await contract.counter()).toNumber()
    await contract.increment()
    assert((await contract.counter()).toNumber() === count + 1)

    try {
      await contract.decrement()
      fail('only when switch off')
    } catch (e) {
      assert((await contract.counter()).toNumber() === count + 1)
    }
  })

  it('can decrement only when switched off', async () => {
    await contract.switchOff({ from: owner })
    assert.isFalse(await contract.isOn())

    const count = (await contract.counter()).toNumber()
    await contract.decrement()
    assert((await contract.counter()).toNumber() === count - 1)

    try {
      await contract.increment()
      fail('only when switch on')
    } catch (e) {
      assert((await contract.counter()).toNumber() === count - 1)
    }

    await contract.switchOn({ from: owner })
    assert.isTrue(await contract.isOn())
  })
})
