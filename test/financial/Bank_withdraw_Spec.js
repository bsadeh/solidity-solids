import { List } from 'immutable'
import { extractEvents, isRevertException } from '../web3_provider_help'

const Contract = artifacts.require('Bank')
const ERC20Token = artifacts.require('HumanStandardToken')

contract('[Bank > withdraw]', ([, nominator, owner, banker, accountA, accountB]) => {
  const ETH = '0x0000000000000000000000000000000000000000'
  let contract, coinA, coinB

  beforeEach(async () => {
    contract = await Contract.new(nominator)
    await contract.addOwner(owner, {from: nominator})
    await contract.addBanker(banker, {from: nominator})

    coinA = await ERC20Token.new(1000000000, 'test coin A', 9, 'A9A')
    coinB = await ERC20Token.new(1000000, 'test coin B', 6, 'B6B')
    const accounts = List.of(accountA, accountB)
    const coins = List.of(coinA, coinB)
    await Promise.all(accounts.flatMap(account => coins.map(coin => coin.transfer(account, 1000))))
    await Promise.all(accounts.flatMap(account => coins.map(coin => coin.approve(contract.address, 100, { from: account }))))
    await Promise.all(accounts.flatMap(account => coins.map(coin => contract.depositToken(coin.address, 100, { from: account }))))
    await Promise.all(accounts.map(account => contract.depositEther({ value: 10, from: account })))
  })

  it('enables banker to withdraw ether for an account', async () => {
    (await Promise.all([accountA, accountB].map(account =>
      contract.balanceOf(account, ETH)
    ))).forEach(each => assert(each.toNumber() === 10))
    assert(web3.eth.getBalance(contract.address).toNumber() === 20)

    await contract.withdrawEther(accountA, 2, { from: banker }).then(result => {
      const events = extractEvents('Withdraw', result)
      const withdraw = events[0]
      assert.lengthOf(events, 1)
      assert(withdraw.coin === ETH)
      assert(withdraw.account === accountA)
      assert(withdraw.quantity.toNumber() === 2)
      assert(withdraw.balance.toNumber() === 10 - 2)
    })
    assert(web3.eth.getBalance(contract.address).toNumber() === 20 - 2)
    assert((await contract.balanceOf(accountA, ETH)).toNumber() === 10 - 2)
    assert((await contract.balanceOf(accountB, ETH)).toNumber() === 10)

    await contract.withdrawEther(accountA, 3, { from: banker })
    await contract.withdrawEther(accountB, 4, { from: banker })
    assert(web3.eth.getBalance(contract.address).toNumber() === 20 - (2 + 3 + 4))
    assert((await contract.balanceOf(accountA, ETH)).toNumber() === 10 - (2 + 3))
    assert((await contract.balanceOf(accountB, ETH)).toNumber() === 10 - 4)
  })

  it('enables banker to withdraw coins for an account', async () => {
    (await Promise.all(List.of(accountA, accountB).flatMap(account => List.of(coinA, coinB).map(coin =>
      contract.balanceOf(account, coin.address)
    )))).forEach(each => assert(each.toNumber() === 100))

    await contract.withdrawToken(accountA, coinA.address, 20, { from: banker }).then(result => {
      const events = extractEvents('Withdraw', result)
      const withdraw = events[0]
      assert.lengthOf(events, 1)
      assert(withdraw.coin === coinA.address)
      assert(withdraw.account === accountA)
      assert(withdraw.quantity.toNumber() === 20)
      assert(withdraw.balance.toNumber() === 100 - 20)
    })
    assert((await contract.balanceOf(accountA, coinA.address)).toNumber() === 100 - 20)
    assert((await contract.balanceOf(accountB, coinA.address)).toNumber() === 100)
    assert((await contract.balanceOf(accountA, coinB.address)).toNumber() === 100)
    assert((await contract.balanceOf(accountB, coinB.address)).toNumber() === 100)

    await contract.withdrawToken(accountA, coinA.address, 30, { from: banker })
    await contract.withdrawToken(accountA, coinB.address, 40, { from: banker })
    await contract.withdrawToken(accountB, coinB.address, 90, { from: banker })
    assert((await contract.balanceOf(accountA, coinA.address)).toNumber() === 100 - (20 + 30))
    assert((await contract.balanceOf(accountB, coinA.address)).toNumber() === 100)
    assert((await contract.balanceOf(accountA, coinB.address)).toNumber() === 100 - 40)
    assert((await contract.balanceOf(accountB, coinB.address)).toNumber() === 100 - 90)
  })

  it('prevents using withdrawToken to withdraw ether', async () => {
    const accountEtherBalance = await contract.balanceOf(accountA, ETH)
    const contractEtherBalance = web3.eth.getBalance(contract.address)
    try {
      await contract.withdrawToken(accountA, ETH, 1, { from: banker })
      fail('withdrawToken to withdraw ether; no can do!')
    } catch (e) {
      assert(isRevertException(e))
      assert((await contract.balanceOf(accountA, ETH)).toNumber() === accountEtherBalance.toNumber())
      assert(web3.eth.getBalance(contract.address).toNumber() === contractEtherBalance.toNumber())
    }
  })

  it('prevents banker from withdrawing for an account when contract is switched off', async () => {
    await contract.switchOff({ from: owner })

    const etherBalance = (await contract.balanceOf(accountA, ETH)).toNumber()
    assert(etherBalance > 0)
    try {
      await contract.withdrawEther(accountA, etherBalance, { from: banker })
      fail('closed for withdrawal')
    } catch (e) {
      assert(isRevertException(e))
      assert((await contract.balanceOf(accountA, ETH)).toNumber() === etherBalance)
    }

    const coinBalance = (await contract.balanceOf(accountA, coinA.address)).toNumber()
    assert(coinBalance > 0)
    try {
      await contract.withdrawToken(accountA, coinA.address, coinBalance, { from: banker })
      fail('closed for withdrawal')
    } catch (e) {
      assert(isRevertException(e))
      assert((await contract.balanceOf(accountA, coinA.address)).toNumber() === coinBalance)
    }

    await contract.switchOn({ from: owner })
  })
})
