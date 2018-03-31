import expect from 'expect'
import {isRevertException} from './help/evm'


const Contract = artifacts.require('SwitchableExample')

contract('Switchable', ([anyone, nominator, owner]) => {
  let contract

  before(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, { from: nominator })
  })

  it('it is switched on in the beginning', async () => {
    expect(await contract.getNominators()).toEqual([nominator])
    expect(await contract.getOwners()).toEqual([owner])
    expect(await contract.isOn()).toBe(true)
  })

  it('can be switched on/off', async () => {
    expect(await contract.isOn()).toBe(true)

    try {
      await contract.switchOff()
      fail('only owners can switch on/off')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    try {
      await contract.switchOff({ from: nominator })
      fail('only owners can switch on/off')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    expect(await contract.isOn()).toBe(true)
    await contract.switchOff({ from: owner })
    expect(await contract.isOn()).toBe(false)

    try {
      await contract.switchOn()
      fail('only owners can switch on/off')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    try {
      await contract.switchOn({ from: nominator })
      fail('only owners can switch on/off')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    expect(await contract.isOn()).toBe(false)

    await contract.switchOn({ from: owner })
  })

  it('can increment only when switched on', async () => {
    expect(await contract.isOn()).toBe(true)

    const count = await contract.counter().then(_ => _.toNumber())
    await contract.increment()
    expect(await contract.counter().then(_ => _.toNumber())).toBe(count + 1)

    try {
      await contract.decrement()
      fail('only when switch off')
    } catch (e) {
      expect(await contract.counter().then(_ => _.toNumber())).toBe(count + 1)
    }
  })

  it('can decrement only when switched off', async () => {
    await contract.switchOff({ from: owner })
    expect(await contract.isOn()).toBe(false)

    const count = (await contract.counter()).toNumber()
    await contract.decrement()
    expect(await contract.counter().then(_ => _.toNumber())).toBe(count - 1)

    try {
      await contract.increment()
      fail('only when switch on')
    } catch (e) {
      expect(await contract.counter().then(_ => _.toNumber())).toBe(count - 1)
    }

    await contract.switchOn({ from: owner })
    expect(await contract.isOn()).toBe(true)
  })
})
