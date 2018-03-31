import expect from 'expect'
import {isRevertException} from './help/evm'


const Contract = artifacts.require('RoleBasedExample')

contract('RoleBased > owner', ([, nominator, maybeNominator, notNominator, maybeOwner, notOwner]) => {
  let contract

  before(async () => { contract = await Contract.new(nominator) })

  describe('nominating', () => {
    it('in the beginning, there are no owners only nominators', async () => {
      expect(await contract.getNominators()).toEqual([nominator])
      expect(await contract.getOwners()).toEqual([])
    })
  
    it('only nominators can add a nominator', async () => {
      expect(await contract.getNominators()).toEqual([nominator])
      try {
        await contract.nominate(maybeNominator, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        expect(e.message).toEqual('VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).toEqual([nominator])
      }
  
      await contract.nominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).toEqual([nominator, maybeNominator])
    })
  
    it('only nominators can remove a nominator', async () => {
      await contract.nominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).toEqual([nominator, maybeNominator])
  
      try {
        await contract.denominate(maybeNominator, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        expect(e.message).toEqual('VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).toEqual([nominator, maybeNominator])
      }
  
      await contract.denominate(notNominator, { from: nominator })
      // removing a non-nominator has no effect
      expect(await contract.getNominators()).toEqual([nominator, maybeNominator])
  
      await contract.denominate(maybeNominator, { from: nominator })
      expect(await contract.getNominators()).toEqual([nominator])
  
      try {
        await contract.denominate(nominator, { from: nominator })
        fail('should never be left with no nominators')
      } catch (e) {
        expect(e.message).toEqual('VM Exception while processing transaction: revert')
        expect(await contract.getNominators()).toEqual([nominator])
      }
    })
  })

  describe('ownership', () => {
    it('only nominators can add an owner', async () => {
      expect(await contract.getOwners()).toEqual([])
      try {
        await contract.addOwner(maybeOwner, { from: notNominator })
        fail('sender is not a nominator')
      } catch (e) {
        expect(isRevertException(e)).toBe(true)
        expect(await contract.isOwner(maybeOwner)).toBe(false)
      }
  
      await contract.addOwner(maybeOwner, { from: nominator })
      expect(await contract.isOwner(maybeOwner)).toBe(true)
      expect(await contract.isOwner(nominator)).toBe(false)
      expect(await contract.getOwners()).toEqual([maybeOwner])
    })
  
    it('only nominators can remove an owner', async () => {
      await contract.addOwner(maybeOwner, { from: nominator })
      expect(await contract.getOwners()).toEqual([maybeOwner])
  
      try {
        await contract.removeOwner(maybeOwner, { from: notNominator })
        fail('sender must be an owner')
      } catch (e) {
        expect(isRevertException(e)).toBe(true)
        expect(await contract.isOwner(maybeOwner)).toBe(true)
      }
  
      expect(await contract.getOwners()).toEqual([maybeOwner])
      await contract.removeOwner(notOwner, { from: nominator })
      // removing a non-owner has no effect
      expect(await contract.getOwners()).toEqual([maybeOwner])
  
      await contract.removeOwner(maybeOwner, { from: nominator })
      expect(await contract.isOwner(maybeOwner)).toBe(false)
      expect(await contract.getOwners()).toEqual([])
    })
  
    it('scoping by role: onlyOwner', async () => {
      await contract.addOwner(maybeOwner, { from: nominator })
      expect(await contract.counter().then(_ => _.toNumber())).toBe(1)

      try {
        await contract.increment({ from: notOwner })
        fail('sender must be an owner')
      } catch (e) {
        expect(isRevertException(e)).toBe(true)
        expect(await contract.counter().then(_ => _.toNumber())).toBe(1)
      }

      await contract.increment({ from: maybeOwner })
      expect(await contract.counter().then(_ => _.toNumber())).toBe(2)
    })
  })
})
