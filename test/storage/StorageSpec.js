import expect from 'expect.js'
import { isRevertException, soliditySha3 } from '../web3_provider_help'

const Contract = artifacts.require('Storage')


contract('Storage', (accounts) => {
  const [anyone, nominator, reader, writer, reader_writer] = accounts
  let contract
  const key1 = soliditySha3("string", "truth"), value1 = true
  const key2 = soliditySha3("string", "lie"), value2 = false
  const key3 = soliditySha3("uint", 3), value3 = 3
  const key4 = soliditySha3("string", "four"), value4 = 4
  const key5 = soliditySha3("string", "5"), value5 = "five"
  const key6 = soliditySha3("uint", 6), value6 = "six"
  const key7 = soliditySha3("string", "7"), value7 = accounts[7]
  const key8 = soliditySha3("address", accounts[8]), value8 = accounts[8]

  before(async () => {
    contract = await Contract.new(nominator)
    await contract.addReader(reader, { from: nominator });
    await contract.addReader(reader_writer, { from: nominator });
    await contract.addWriter(writer, { from: nominator });
    await contract.addWriter(reader_writer, { from: nominator });
  })

  it('nominating: readers & writers', async () => {
    expect(await contract.getNominators()).to.eql([nominator])
    expect(await contract.getReaders()).to.eql([reader, reader_writer])
    expect(await contract.getWriters()).to.eql([writer, reader_writer])

    assert.isFalse(await contract.isReader(anyone))
    assert.isTrue(await contract.isReader(reader))
    assert.isFalse(await contract.isReader(writer))
    assert.isTrue(await contract.isReader(reader_writer))

    assert.isFalse(await contract.isWriter(anyone))
    assert.isFalse(await contract.isWriter(reader))
    assert.isTrue(await contract.isWriter(writer))
    assert.isTrue(await contract.isWriter(reader_writer))
  })

  it('writership: only writers can write', async () => {
    await contract.stringSet(key5, value5, { from: writer })
    await contract.stringSet(key6, value6, { from: reader_writer })

    try {
      await contract.uintSet(key3, value3, { from: anyone })
      fail('sender must be an writer')
    } catch (e) {
      assert(isRevertException(e))
    }
    try {
      await contract.uintSet(key3, value3, { from: reader })
      fail('sender must be an writer')
    } catch (e) {
      assert(isRevertException(e))
    }
    await contract.uintSet(key3, value3, { from: reader_writer })
  })

  it('readership: only readers can read', async () => {
    await contract.boolSet(key1, value1, { from: writer })
    await contract.boolSet(key2, value2, { from: writer })
    await contract.uintSet(key3, value3, { from: reader_writer })
    await contract.uintSet(key4, value4, { from: reader_writer })
    await contract.stringSet(key5, value5, { from: writer })
    await contract.stringSet(key6, value6, { from: writer })
    await contract.addressSet(key7, value7, { from: reader_writer })
    await contract.addressSet(key8, value8, { from: reader_writer })

    assert(await contract.boolGet(key1, { from: reader }) === value1)
    assert(await contract.boolGet(key2, { from: reader_writer }) === value2)
    assert((await contract.uintGet(key3, { from: reader })).toNumber() === value3)
    assert((await contract.uintGet(key4, { from: reader_writer })).toNumber() === value4)
    assert(await contract.stringGet(key5, { from: reader }) === value5)
    assert(await contract.stringGet(key6, { from: reader_writer }) === value6)
    assert(await contract.addressGet(key7, { from: reader }) === value7)
    assert(await contract.addressGet(key8, { from: reader_writer }) === value8)

    try {
      await contract.boolGet(key1, { from: anyone })
      fail('sender must be a reader')
    } catch (e) {
      assert(isRevertException(e))
    }
    try {
      await contract.boolGet(key1, { from: writer })
      fail('sender must be a reader')
    } catch (e) {
      assert(isRevertException(e))
    }
  })
})
