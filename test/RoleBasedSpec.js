const expect = require('expect.js')

const Contract = artifacts.require('RoleBasedExample')


contract('RoleBased > owner', (accounts) => {
  const nominator = accounts[1], maybeNominator = accounts[2], notNominator = accounts[3]
  const maybeOwner = accounts[4], notOwner = accounts[5]
  let contract

  before(async () => {
    contract = await Contract.new(nominator)
  })

  it('nominating: in the beginning, there are no owners only nominators', async () => {
    expect(await contract.getNominators()).to.eql([nominator])
    expect(await contract.getOwners()).to.eql([])
  })

  it('nominating: only nominators can add a nominator', async () => {
    expect(await contract.getNominators()).to.eql([nominator])
    try {
      await contract.nominate(maybeNominator, {from: notNominator})
      fail('sender is not a nominator')
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.getNominators()).to.eql([nominator])
    }

    await contract.nominate(maybeNominator, {from: nominator})
    expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
  })

  it('nominating: only nominators can remove a nominator', async () => {
    await contract.nominate(maybeNominator, {from: nominator})
    expect(await contract.getNominators()).to.eql([nominator, maybeNominator])

    try {
      await contract.denominate(maybeNominator, {from: notNominator})
      fail('sender is not a nominator')
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
    }

    await contract.denominate(notNominator, {from: nominator})
    // removing a non-nominator has no effect
    expect(await contract.getNominators()).to.eql([nominator, maybeNominator])

    await contract.denominate(maybeNominator, {from: nominator})
    expect(await contract.getNominators()).to.eql([nominator])

    try {
      await contract.denominate(nominator, {from: nominator})
      fail('should never be left with no nominators')
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.getNominators()).to.eql([nominator])
    }
  })

  it('ownership: only nominators can add an owner', async () => {
    expect(await contract.getOwners()).to.eql([])
    try {
      await contract.addOwner(maybeOwner, {from: notNominator})
      fail('sender is not a nominator')
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.isOwner(maybeOwner)).to.eql(false)
    }

    await contract.addOwner(maybeOwner, {from: nominator})
    expect(await contract.isOwner(maybeOwner)).to.eql(true)
    expect(await contract.isOwner(nominator)).to.eql(false)
    expect(await contract.getOwners()).to.eql([maybeOwner])
  })

  it('ownership: only nominators can remove an owner', async () => {
    await contract.addOwner(maybeOwner, {from: nominator})
    expect(await contract.getOwners()).to.eql([maybeOwner])

    try {
      await contract.removeOwner(maybeOwner, {from: notNominator})
      fail('sender must be an owner')
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.isOwner(maybeOwner)).to.eql(true)
    }

    expect(await contract.getOwners()).to.eql([maybeOwner])
    await contract.removeOwner(notOwner, {from: nominator})
    // removing a non-owner has no effect
    expect(await contract.getOwners()).to.eql([maybeOwner])

    await contract.removeOwner(maybeOwner, {from: nominator})
    expect(await contract.isOwner(maybeOwner)).to.eql(false)
    expect(await contract.getOwners()).to.eql([])
  })

  it.only('scoping by role: onlyOwner', async () => {
    await contract.addOwner(maybeOwner, {from: nominator})
    expect((await contract.counter()).toNumber()).to.eql(1)

    await contract.increment({from: notOwner})
    expect((await contract.counter()).toNumber()).to.eql(1)

    await contract.increment({from: maybeOwner})
    expect((await contract.counter()).toNumber()).to.eql(2)
  })
})
