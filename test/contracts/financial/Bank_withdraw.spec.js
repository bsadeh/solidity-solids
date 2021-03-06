import expect from 'expect'
import {List} from 'immutable'
import {ETH} from '../../../src'
import {getBalance, extractEvents, isRevertException, newERC20Token} from '..'


const Contract = artifacts.require('Bank')


contract('[Bank > withdraw]', ([, nominator, owner, banker, accountA, accountB]) => {
  let contract, coinA, coinB

  beforeEach(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, {from: nominator})
    await contract.addBanker(banker, {from: nominator})

    coinA = await newERC20Token(1000000000, 'test coin A', 9, 'A9A')
    coinB = await newERC20Token(1000000, 'test coin B', 6, 'B6B')
    const accounts = List.of(accountA, accountB)
    const coins = List.of(coinA, coinB)
    await Promise.all(accounts.flatMap(account => coins.map(coin => coin.transfer(account, 1000))))
    await Promise.all(accounts.flatMap(account => coins.map(coin => coin.approve(contract.address, 100, { from: account }))))
    await Promise.all(accounts.flatMap(account => coins.map(coin => contract.depositToken(coin.address, 100, { from: account }))))
    await Promise.all(accounts.map(account => contract.depositEther({ value: 10, from: account })))
  })

  it('enables banker to withdraw ether for an account', async () => {
    await Promise.all([accountA, accountB].
      map(account => contract.balanceOf(account, ETH).then(_ => expect(_).toEqualBN(10))))
    expect(await getBalance(contract.address)).toEqualBN(20)

    await contract.withdrawEther(accountA, 2, { from: banker }).then(_ => {
      const events = extractEvents('Withdraw', _)
      const withdraw = events[0]
      assert.lengthOf(events, 1)
      expect(withdraw.coin).toBe(ETH)
      expect(withdraw.account).toBe(accountA)
      expect(withdraw.quantity).toEqualBN(2)
      expect(withdraw.balance).toEqualBN(10 - 2)
    })
    expect(await getBalance(contract.address)).toEqualBN(20 - 2)
    expect(await contract.balanceOf(accountA, ETH)).toEqualBN(10 - 2)
    expect(await contract.balanceOf(accountB, ETH)).toEqualBN(10)

    await contract.withdrawEther(accountA, 3, { from: banker })
    await contract.withdrawEther(accountB, 4, { from: banker })
    expect(await getBalance(contract.address)).toEqualBN(20 - (2 + 3 + 4))
    expect(await contract.balanceOf(accountA, ETH)).toEqualBN(10 - (2 + 3))
    expect(await contract.balanceOf(accountB, ETH)).toEqualBN(10 - 4)
  })

  it('enables banker to withdraw coins for an account', async () => {
    (await Promise.all(List.of(accountA, accountB).flatMap(account => List.of(coinA, coinB).map(coin =>
      contract.balanceOf(account, coin.address)
    )))).forEach(_ => expect(_).toEqualBN(100))

    await contract.withdrawToken(accountA, coinA.address, 20, { from: banker }).then(_ => {
      const events = extractEvents('Withdraw', _)
      const withdraw = events[0]
      assert.lengthOf(events, 1)
      expect(withdraw.coin).toBe(coinA.address)
      expect(withdraw.account).toBe(accountA)
      expect(withdraw.quantity).toEqualBN(20)
      expect(withdraw.balance).toEqualBN(100 - 20)
    })
    expect(await contract.balanceOf(accountA, coinA.address)).toEqualBN(100 - 20)
    expect(await contract.balanceOf(accountB, coinA.address)).toEqualBN(100)
    expect(await contract.balanceOf(accountA, coinB.address)).toEqualBN(100)
    expect(await contract.balanceOf(accountB, coinB.address)).toEqualBN(100)

    await contract.withdrawToken(accountA, coinA.address, 30, { from: banker })
    await contract.withdrawToken(accountA, coinB.address, 40, { from: banker })
    await contract.withdrawToken(accountB, coinB.address, 90, { from: banker })
    expect(await contract.balanceOf(accountA, coinA.address)).toEqualBN(100 - (20 + 30))
    expect(await contract.balanceOf(accountB, coinA.address)).toEqualBN(100)
    expect(await contract.balanceOf(accountA, coinB.address)).toEqualBN(100 - 40)
    expect(await contract.balanceOf(accountB, coinB.address)).toEqualBN(100 - 90)
  })

  it('prevents using withdrawToken to withdraw ether', async () => {
    const accountEtherBalance = await getBalance(accountA)
    const contractEtherBalance = await getBalance(contract.address)
    try {
      await contract.withdrawToken(accountA, ETH, 1, { from: banker })
      fail('withdrawToken to withdraw ether; no can do!')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
      expect(await getBalance(accountA)).toEqual(accountEtherBalance)
      expect(await getBalance(contract.address)).toEqual(contractEtherBalance)
    }
  })

  it('prevents banker from withdrawing for an account when contract is switched off', async () => {
    await contract.switchOff({ from: owner })

    const etherBalance = await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())
    expect(etherBalance > 0).toBe(true)
    try {
      await contract.withdrawEther(accountA, etherBalance, { from: banker })
      fail('closed for withdrawal')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
      expect(await contract.balanceOf(accountA, ETH)).toEqualBN(etherBalance)
    }

    const coinBalance = await contract.balanceOf(accountA, coinA.address).then(_ => _.toNumber())
    expect(coinBalance > 0).toBe(true)
    try {
      await contract.withdrawToken(accountA, coinA.address, coinBalance, { from: banker })
      fail('closed for withdrawal')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
      expect(await contract.balanceOf(accountA, coinA.address)).toEqualBN(coinBalance)
    }

    await contract.switchOn({ from: owner })
  })
})
