const expect = require('expect.js')
const { isRevertException } = require('./web3_provider_help')

const Contract = artifacts.require('RoleBasedExample')


contract('RoleBased > owner', ([, nominator, maybeNominator, notNominator, maybeOwner, notOwner]) => {
  let contract

  before(async () => {
    contract = await Contract.new(nominator)
  })

  describe('nominating', () => {
    it('in the beginning, there are no owners only nominators', async () => {
      expect(await contract.getNominators()).to.eql([nominator])
      expect(await contract.getOwners()).to.eql([])
    })
  
    it('only nominators can add a nominator', async () => {
      expect(await contract.getNominators()).to.eql([nominator])
      try {
        await contract.nominate(maybeNominator, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        expect(e.message, 'VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).to.eql([nominator])
      }
  
      await contract.nominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
    })
  
    it('only nominators can remove a nominator', async () => {
      await contract.nominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
  
      try {
        await contract.denominate(maybeNominator, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        expect(e.message, 'VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
      }
  
      await contract.denominate(notNominator, { from: nominator })
      // removing a non-nominator has no effect
      expect(await contract.getNominators()).to.eql([nominator, maybeNominator])
  
      await contract.denominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).to.eql([nominator])
  
      try {
        await contract.denominate(nominator, { from: nominator })
        fail('should never be left with no nominators')
      } catch (e) {
        expect(e.message, 'VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).to.eql([nominator])
      }
    })
  })

  describe('ownership', () => {
    it('only nominators can add an owner', async () => {
      expect(await contract.getOwners()).to.eql([])
      try {
        await contract.addOwner(maybeOwner, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        assert(isRevertException(e))
        assert.isFalse(await contract.isOwner(maybeOwner))
      }
  
      await contract.addOwner(maybeOwner, { from: nominator })
      assert.isTrue(await contract.isOwner(maybeOwner))
      assert.isFalse(await contract.isOwner(nominator))
      expect(await contract.getOwners()).to.eql([maybeOwner])
    })
  
    it('only nominators can remove an owner', async () => {
      await contract.addOwner(maybeOwner, { from: nominator })
      expect(await contract.getOwners()).to.eql([maybeOwner])
  
      try {
        await contract.removeOwner(maybeOwner, { from: notNominator })
        fail('sender must be an owner')
      } catch (e) {
        assert(isRevertException(e))
        assert(await contract.isOwner(maybeOwner))
      }
  
      expect(await contract.getOwners()).to.eql([maybeOwner])
      await contract.removeOwner(notOwner, { from: nominator })
      // removing a non-owner has no effect
      expect(await contract.getOwners()).to.eql([maybeOwner])
  
      await contract.removeOwner(maybeOwner, { from: nominator })
      assert.isFalse(await contract.isOwner(maybeOwner))
      expect(await contract.getOwners()).to.eql([])
    })
  
    it('scoping by role: onlyOwner', async () => {
      await contract.addOwner(maybeOwner, { from: nominator })
      assert((await contract.counter()).toNumber() === 1)

      try {
        await contract.increment({ from: notOwner })
        fail('sender must be an owner')
      } catch (e) {
        assert(isRevertException(e))
        assert((await contract.counter()).toNumber() === 1)
      }

      await contract.increment({ from: maybeOwner })
      assert((await contract.counter()).toNumber() === 2)
    })
  })
})
