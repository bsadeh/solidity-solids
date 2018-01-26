const expect = require('expect.js');

const Contract = artifacts.require('RoleBasedExample')


contract('RoleBased > owner', (accounts) => {
  const owner = accounts[1], maybeOwner = accounts[2], notOwner = accounts[3]
  let contract

  before(async () => {
    contract = await Contract.new([owner])
  })

  it('ownership: should have all the owners', async () => {
    expect(await contract.getOwners()).to.eql([owner])
    expect(await contract.isOwner(owner)).to.eql(true)
    expect(await contract.isOwner(maybeOwner)).to.eql(false)
    expect(await contract.isOwner(maybeOwner)).to.eql(false)
    expect(await contract.isOwner(notOwner)).to.eql(false)
  })

  it('ownership: only owners can add new owners', async () => {
    expect(await contract.getOwners()).to.eql([owner])
    try {
      await contract.addOwner(maybeOwner, {from: notOwner});
      fail('sender is not an owner');
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.isOwner(maybeOwner)).to.eql(false)
    }

    expect(await contract.isOwner(owner)).to.eql(true)
    await contract.addOwner(maybeOwner, {from: owner});
    expect(await contract.isOwner(maybeOwner))
    expect(await contract.getOwners()).to.eql([owner, maybeOwner])
  })

  it('ownership: only owners can remove an owner', async () => {
    await contract.addOwner(maybeOwner, {from: owner});
    expect(await contract.getOwners()).to.eql([owner, maybeOwner])

    try {
      await contract.removeOwner(maybeOwner, {from: notOwner});
      fail('sender must be an owner');
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.isOwner(maybeOwner))
    }

    expect(await contract.getOwners()).to.eql([owner, maybeOwner])
    await contract.removeOwner(notOwner, {from: owner});
    // removing a non-owner has no effect
    expect(await contract.getOwners()).to.eql([owner, maybeOwner])

    await contract.removeOwner(maybeOwner, {from: owner});
    expect(await contract.isOwner(maybeOwner)).to.eql(false)
    expect(await contract.getOwners()).to.eql([owner])

    try {
      await contract.removeOwner(owner, {from: owner});
      fail('should never be left with no owners');
    } catch (e) {
      expect(e.message, 'VM Exception while processing transaction: revert')
      expect(await contract.getOwners()).to.eql([owner])
    }
  })
})
