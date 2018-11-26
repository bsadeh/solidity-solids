import expect from 'expect'
import {keccak256} from '../../../src'
import {isRevertException} from '..'


const Contract = artifacts.require('Storage')


contract('Storage', (accounts) => {
  const [anyone, nominator, reader, writer, reader_writer] = accounts
  let contract
  const key1 = keccak256('string', 'truth'), value1 = true
  const key2 = keccak256('string', 'lie'), value2 = false
  const key3 = keccak256('uint', 3), value3 = 3
  const key4 = keccak256('string', 'four'), value4 = 4
  const key5 = keccak256('string', '5'), value5 = 'five'
  const key6 = keccak256('uint', 6), value6 = 'six'
  const key7 = keccak256('string', '7'), value7 = accounts[7]
  const key8 = keccak256('address', accounts[8]), value8 = accounts[8]

  before(async () => {
    contract = await Contract.new(nominator)
    await contract.addReader(reader, { from: nominator });
    await contract.addReader(reader_writer, { from: nominator });
    await contract.addWriter(writer, { from: nominator });
    await contract.addWriter(reader_writer, { from: nominator });
  })

  it('nominating: readers & writers', async () => {
    expect(await contract.getNominators()).toEqual([nominator])
    expect(await contract.getReaders()).toEqual([reader, reader_writer])
    expect(await contract.getWriters()).toEqual([writer, reader_writer])

    expect(await contract.isReader(anyone)).toBe(false)
    expect(await contract.isReader(reader)).toBe(true)
    expect(await contract.isReader(writer)).toBe(false)
    expect(await contract.isReader(reader_writer)).toBe(true)

    expect(await contract.isWriter(anyone)).toBe(false)
    expect(await contract.isWriter(reader)).toBe(false)
    expect(await contract.isWriter(writer)).toBe(true)
    expect(await contract.isWriter(reader_writer)).toBe(true)
  })

  it('writership: only writers can write', async () => {
    await contract.stringSet(key5, value5, { from: writer })
    await contract.stringSet(key6, value6, { from: reader_writer })

    try {
      await contract.uintSet(key3, value3, { from: anyone })
      fail('sender must be an writer')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    try {
      await contract.uintSet(key3, value3, { from: reader })
      fail('sender must be an writer')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
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

    expect(await contract.boolGet(key1, { from: reader })).toBe(value1)
    expect(await contract.boolGet(key2, { from: reader_writer })).toBe(value2)
    expect(await contract.uintGet(key3, { from: reader }).then(_ => _.toNumber())).toBe(value3)
    expect(await contract.uintGet(key4, { from: reader_writer }).then(_ => _.toNumber())).toBe(value4)
    expect(await contract.stringGet(key5, { from: reader })).toBe(value5)
    expect(await contract.stringGet(key6, { from: reader_writer })).toBe(value6)
    expect(await contract.addressGet(key7, { from: reader })).toBe(value7)
    expect(await contract.addressGet(key8, { from: reader_writer })).toBe(value8)

    try {
      await contract.boolGet(key1, { from: anyone })
      fail('sender must be a reader')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
    try {
      await contract.boolGet(key1, { from: writer })
      fail('sender must be a reader')
    } catch (e) {
      expect(isRevertException(e)).toBe(true)
    }
  })
})
