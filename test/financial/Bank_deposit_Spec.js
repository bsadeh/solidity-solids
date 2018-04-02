import expect from 'expect'
import {web3} from '../help/web3'
import {extractEvents, isRevertException} from '../help/evm'


const Contract = artifacts.require('Bank')
const ERC20Token = artifacts.require('HumanStandardToken')

contract('[Bank > deposit]', ([, nominator, owner, banker, accountA, accountB, accountAB]) => {
  const ETH = '0x0000000000000000000000000000000000000000'
  let contract, coinA, coinB

  beforeEach(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, {from: nominator})
    await contract.addBanker(banker, {from: nominator})
    expect(await contract.getOwners()).toEqual([owner])
    expect(await contract.getBankers()).toEqual([banker])

    coinA = await ERC20Token.new(1000000000, 'test coin A', 9, 'A9A')
    coinB = await ERC20Token.new(1000000, 'test coin B', 6, 'B6B')
    await Promise.all([accountA, accountAB].
      map(account => coinA.transfer(account, 1000).then(coinA.approve(contract.address, 100, { from: account }))))
    await Promise.all([accountB, accountAB].
      map(account => coinB.transfer(account, 100).then(coinB.approve(contract.address, 100, { from: account }))))
  })

  it('has no ether balance to begin with', async () => {
    await Promise.all([contract.address, coinA.address, coinB.address].
      map(_ => coinA.balanceOf(_).then(_ => _.toNumber()).then(_ => expect(_).toBe(0))))
    await Promise.all([accountA, accountB, accountAB].
      map(_ => web3.eth.getBalance(_).then(x => expect(x > 1e+19).toBe(true))))
    expect(await Promise.all([accountA, accountB, accountAB].
      map(_ => coinA.balanceOf(_).then(_ => _.toNumber())))).toEqual([1000, 0, 1000])
    expect(await Promise.all([accountA, accountB, accountAB].
      map(_ => coinB.balanceOf(_).then(_ => _.toNumber())))).toEqual([0, 100, 100])
  })

  it('is able to deposit ether: via payable fallback', async () => {
    await contract.sendTransaction({ from: accountA, to: contract.address, value: 2 }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity.toNumber()).toBe(2)
      expect(deposit.balance.toNumber()).toBe(2)
    })
    expect(await web3.eth.getBalance(contract.address)).toEqual('2')
    expect(await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())).toBe(2)
  })

  it('is able to deposit ether: via depositEther', async () => {
    await contract.depositEther({ value: 2, from: accountA }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity.toNumber()).toBe(2)
      expect(deposit.balance.toNumber()).toBe(2)
    })
    expect(await web3.eth.getBalance(contract.address)).toEqual('2')
    expect(await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())).toBe(2)

    await contract.depositEther({ value: 10, from: accountB })
    await contract.depositEther({ value: 2, from: accountAB })
    await contract.depositEther({ value: 3, from: accountAB })
    expect(await web3.eth.getBalance(contract.address)).toEqual('17')

    await contract.depositEther({ value: 4, from: accountB }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(ETH)
      expect(deposit.account).toBe(accountB)
      expect(deposit.quantity.toNumber()).toBe(4)
      expect(deposit.balance.toNumber()).toBe(14)
    })
    expect(await web3.eth.getBalance(contract.address)).toEqual('21')
    expect(await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())).toBe(2)
    expect(await contract.balanceOf(accountB, ETH).then(_ => _.toNumber())).toBe(14)
    expect(await contract.balanceOf(accountAB, ETH).then(_ => _.toNumber())).toBe(5)
  })

  it('is able to deposit coins', async () => {
    await contract.depositToken(coinA.address, 10, { from: accountA }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(coinA.address)
      expect(deposit.account).toBe(accountA)
      expect(deposit.quantity.toNumber()).toBe(10)
      expect(deposit.balance.toNumber()).toBe(10)
    })
    expect(await contract.balanceOf(accountA, coinA.address).then(_ => _.toNumber())).toBe(10)

    await contract.depositToken(coinA.address, 20, { from: accountAB })
    await contract.depositToken(coinB.address, 30, { from: accountB })
    await contract.depositToken(coinB.address, 40, { from: accountAB })
    await contract.depositToken(coinB.address, 10, { from: accountAB }).then(result => {
      const events = extractEvents('Deposit', result)
      const deposit = events[0]
      assert.lengthOf(events, 1)
      expect(deposit.coin).toBe(coinB.address)
      expect(deposit.account).toBe(accountAB)
      expect(deposit.quantity.toNumber()).toBe(10)
      expect(deposit.balance.toNumber()).toBe(50)
    })
    expect(await contract.balanceOf(accountA, coinA.address).then(_ => _.toNumber())).toBe(10)
    expect(await contract.balanceOf(accountAB, coinA.address).then(_ => _.toNumber())).toBe(20)
    expect(await contract.balanceOf(accountB, coinB.address).then(_ => _.toNumber())).toBe(30)
    expect(await contract.balanceOf(accountAB, coinB.address).then(_ => _.toNumber())).toBe(50)
  })

  it('prevents using depositToken to deposit ether', async () => {
    const accountEtherBalance = await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())
    const contractEtherBalance = await web3.eth.getBalance(contract.address)
    try {
      await contract.depositToken(ETH, 1, { from: accountA })
      fail('depositToken to deposit ether; no can do!')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
      expect(await contract.balanceOf(accountA, ETH).then(_ => _.toNumber())).toBe(accountEtherBalance)
      expect(await web3.eth.getBalance(contract.address)).toEqual(contractEtherBalance)
    }
  })
})
