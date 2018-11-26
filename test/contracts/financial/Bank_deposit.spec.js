import expect from 'expect'
import {ETH} from '../../../src'
import {getBalance, extractEvents, isRevertException, newERC20Token} from '..'


const Contract = artifacts.require('Bank')


contract('[Bank > deposit]', ([, nominator, owner, banker, accountA, accountB, accountAB]) => {
  let contract, coinA, coinB

  beforeEach(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, {from: nominator})
    await contract.addBanker(banker, {from: nominator})
    expect(await contract.getOwners()).toEqual([owner])
    expect(await contract.getBankers()).toEqual([banker])

    coinA = await newERC20Token(1000000000, 'test coin A', 9, 'A9A')
    coinB = await newERC20Token(1000000, 'test coin B', 6, 'B6B')
    await Promise.all([accountA, accountAB].
      map(account => coinA.transfer(account, 1000).then(coinA.approve(contract.address, 100, { from: account }))))
    await Promise.all([accountB, accountAB].
      map(account => coinB.transfer(account, 100).then(coinB.approve(contract.address, 100, { from: account }))))
  })

  it('has no ether balance to begin with', async () => {
    await Promise.all([contract.address, coinA.address, coinB.address].
      map(_ => coinA.balanceOf(_).then(_ => expect(_).toEqualBN(0))))
    await Promise.all([accountA, accountB, accountAB].
      map(_ => getBalance(_).then(x => expect(x > 1e+19).toBe(true))))
    expect(await Promise.all([accountA, accountB, accountAB].
    map(_ => coinA.balanceOf(_).then(_ => _.toNumber())))).toEqual([1000, 0, 1000])
    expect(await Promise.all([accountA, accountB, accountAB].
    map(_ => coinB.balanceOf(_).then(_ => _.toNumber())))).toEqual([0, 100, 100])
  })

  it('is able to deposit ether: via payable fallback', async () => {
    await contract.sendTransaction({ from: accountA, to: contract.address, value: 2 }).then(_ => {
      const events = extractEvents('Deposit', _)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity).toEqualBN(2)
      expect(deposit.balance).toEqualBN(2)
    })
    expect(await getBalance(contract.address)).toEqualBN(2)
    expect(await contract.balanceOf(accountA, ETH)).toEqualBN(2)
  })

  it('is able to deposit ether: via depositEther', async () => {
    await contract.depositEther({ value: 2, from: accountA }).then(_ => {
      const events = extractEvents('Deposit', _)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity).toEqualBN(2)
      expect(deposit.balance).toEqualBN(2)
    })
    expect(await getBalance(contract.address)).toEqualBN(2)
    expect(await contract.balanceOf(accountA, ETH)).toEqualBN(2)

    await contract.depositEther({ value: 10, from: accountB })
    await contract.depositEther({ value: 2, from: accountAB })
    await contract.depositEther({ value: 3, from: accountAB })
    expect(await getBalance(contract.address)).toEqualBN(17)

    await contract.depositEther({ value: 4, from: accountB }).then(_ => {
      const events = extractEvents('Deposit', _)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountB)
      expect(deposit.quantity).toEqualBN(4)
      expect(deposit.balance).toEqualBN(14)
    })
    expect(await getBalance(contract.address)).toEqualBN(21)
    expect(await contract.balanceOf(accountA, ETH)).toEqualBN(2)
    expect(await contract.balanceOf(accountB, ETH)).toEqualBN(14)
    expect(await contract.balanceOf(accountAB, ETH)).toEqualBN(5)
  })

  it('is able to deposit coins', async () => {
    await contract.depositToken(coinA.address, 10, { from: accountA }).then(_ => {
      const events = extractEvents('Deposit', _)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(coinA.address)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity).toEqualBN(10)
      expect(deposit.balance).toEqualBN(10)
    })
    expect(await contract.balanceOf(accountA, coinA.address)).toEqualBN(10)

    await contract.depositToken(coinA.address, 20, { from: accountAB })
    await contract.depositToken(coinB.address, 30, { from: accountB })
    await contract.depositToken(coinB.address, 40, { from: accountAB })
    await contract.depositToken(coinB.address, 10, { from: accountAB }).then(_ => {
      const events = extractEvents('Deposit', _)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(coinB.address)
      expect(deposit.account).toBe(accountAB)
      expect(deposit.quantity).toEqualBN(10)
      expect(deposit.balance).toEqualBN(50)
    })
    expect(await contract.balanceOf(accountA, coinA.address)).toEqualBN(10)
    expect(await contract.balanceOf(accountAB, coinA.address)).toEqualBN(20)
    expect(await contract.balanceOf(accountB, coinB.address)).toEqualBN(30)
    expect(await contract.balanceOf(accountAB, coinB.address)).toEqualBN(50)
  })

  it('prevents using depositToken to deposit ether', async () => {
    const accountEtherBalance = await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())
    const contractEtherBalance = await getBalance(contract.address)
    try {
      await contract.depositToken(ETH, 1, { from: accountA })
      fail('depositToken to deposit ether; no can do!')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
      expect(await contract.balanceOf(accountA, ETH)).toEqualBN(accountEtherBalance)
      expect(await getBalance(contract.address)).toEqual(contractEtherBalance)
    }
  })
})
