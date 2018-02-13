import expect from 'expect.js'
import { List } from 'immutable'
import { extractEvents, isRevertException } from '../web3_provider_help'

const Contract = artifacts.require('Bank')
const ERC20Token = artifacts.require('HumanStandardToken')


contract('[Bank > deposit]', ([, nominator, owner, banker, accountA, accountB, accountAB]) => {
  const ETH = '0x0000000000000000000000000000000000000000'
  let contract, coinA, coinB

  beforeEach(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, {from: nominator})
    await contract.addBanker(banker, {from: nominator})
    expect(await contract.getOwners()).to.eql([owner])
    expect(await contract.getBankers()).to.eql([banker])

    coinA = await ERC20Token.new(1000000000, 'test coin A', 9, 'A9A')
    coinB = await ERC20Token.new(1000000, 'test coin B', 6, 'B6B')
    await Promise.all(List.of(accountA, accountAB).map(account => {
      coinA.transfer(account, 1000)
      coinA.approve(contract.address, 100, { from: account })
    }))
    await Promise.all(List.of(accountB, accountAB).map(account => {
      coinB.transfer(account, 100)
      coinB.approve(contract.address, 100, { from: account })
    }))
  })

  it('has no ether balance to begin with', async () => {
    (await Promise.all(List.of(contract.address, coinA.address, coinB.address).
      map(x => coinA.balanceOf(x)))).map(x => x.toNumber()).forEach(x => assert(x === 0))
    List.of(accountA, accountB, accountAB).
      map(x => web3.eth.getBalance(x)).map(x => x.toNumber()).forEach(x => x > 1e+19)
    expect((await Promise.all([accountA, accountB, accountAB].
      map(x => coinA.balanceOf(x)))).map(x => x.toNumber())).to.eql([1000, 0, 1000])
    expect((await Promise.all([accountA, accountB, accountAB].
      map(x => coinB.balanceOf(x)))).map(x => x.toNumber())).to.eql([0, 100, 100])
  })

  it('is able to deposit ether: via payable fallback', async () => {
    await contract.sendTransaction({ from: accountA, to: contract.address, value: 2 }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      assert(deposit.coin === ETH)
      assert(deposit.account === accountA)
      assert(deposit.quantity.toNumber() === 2)
      assert(deposit.balance.toNumber() === 2)
    })
    assert(web3.eth.getBalance(contract.address).toNumber() === 2)
    assert((await contract.balanceOf(accountA, ETH)).toNumber() === 2)
  })

  it('is able to deposit ether: via depositEther', async () => {
    await contract.depositEther({ value: 2, from: accountA }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      assert(deposit.coin === ETH)
      assert(deposit.account === accountA)
      assert(deposit.quantity.toNumber() === 2)
      assert(deposit.balance.toNumber() === 2)
    })
    assert(web3.eth.getBalance(contract.address).toNumber() === 2)
    assert((await contract.balanceOf(accountA, ETH)).toNumber() === 2)

    await contract.depositEther({ value: 10, from: accountB })
    await contract.depositEther({ value: 2, from: accountAB })
    await contract.depositEther({ value: 3, from: accountAB })
    assert(web3.eth.getBalance(contract.address).toNumber() === 17)

    await contract.depositEther({ value: 4, from: accountB }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      assert(deposit.coin === ETH)
      assert(deposit.account === accountB)
      assert(deposit.quantity.toNumber() === 4)
      assert(deposit.balance.toNumber() === 14)
    })
    assert(web3.eth.getBalance(contract.address).toNumber() === 21)
    assert((await contract.balanceOf(accountA, ETH)).toNumber() === 2)
    assert((await contract.balanceOf(accountB, ETH)).toNumber() === 14)
    assert((await contract.balanceOf(accountAB, ETH)).toNumber() === 5)
  })

  it('is able to deposit coins', async () => {
    await contract.depositToken(coinA.address, 10, { from: accountA }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      assert(deposit.coin === coinA.address)
      assert(deposit.account === accountA)
      assert(deposit.quantity.toNumber() === 10)
      assert(deposit.balance.toNumber() === 10)
    })
    assert((await contract.balanceOf(accountA, coinA.address)).toNumber() === 10)

    await contract.depositToken(coinA.address, 20, { from: accountAB })
    await contract.depositToken(coinB.address, 30, { from: accountB })
    await contract.depositToken(coinB.address, 40, { from: accountAB })
    await contract.depositToken(coinB.address, 10, { from: accountAB }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      assert(deposit.coin === coinB.address)
      assert(deposit.account === accountAB)
      assert(deposit.quantity.toNumber() === 10)
      assert(deposit.balance.toNumber() === 50)
    })
    assert((await contract.balanceOf(accountA, coinA.address)).toNumber() === 10)
    assert((await contract.balanceOf(accountAB, coinA.address)).toNumber() === 20)
    assert((await contract.balanceOf(accountB, coinB.address)).toNumber() === 30)
    assert((await contract.balanceOf(accountAB, coinB.address)).toNumber() === 50)
  })

  it('prevents using depositToken to deposit ether', async () => {
    const accountEtherBalance = await contract.balanceOf(accountA, ETH)
    const contractEtherBalance = web3.eth.getBalance(contract.address)
    try {
      await contract.depositToken(ETH, 1, { from: accountA })
      fail('depositToken to deposit ether; no can do!')
    } catch (e) {
      assert(isRevertException(e))
      assert((await contract.balanceOf(accountA, ETH)).toNumber() === accountEtherBalance.toNumber())
      assert(web3.eth.getBalance(contract.address).toNumber() === contractEtherBalance.toNumber())
    }
  })
})

