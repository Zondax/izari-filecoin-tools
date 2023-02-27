import fs from 'fs'
import path from 'path'

import { Address, AddressActor, AddressBls, AddressId, AddressSecp256k1 } from '../../src/address'
import { Network, ProtocolIndicator } from '../../src/address/constants'
import { InvalidProtocolIndicator } from '../../src/address/errors'

jest.setTimeout(60 * 1000)

const ADDRESSES_VECTOR = './vectors/addresses.json'

type AddressTestCase = {
  string: string
  bytes: string
  network: string
  protocol: number
  payload: string
}

describe('Address', () => {
  describe('Vectors', () => {
    describe('From string', () => {
      const vectors = JSON.parse(fs.readFileSync(path.join(__dirname, ADDRESSES_VECTOR), 'utf-8')) as AddressTestCase[]

      vectors.forEach(({ string, payload, bytes, protocol, network }, index) => {
        test(`Test case ${index}: ${string}`, () => {
          const addr = Address.fromString(string)

          expect(addr.toString()).toBe(string)
          expect(addr.toBytes().toString('hex')).toBe(bytes)
          expect(addr.protocol).toBe(protocol)
          expect(addr.network).toBe(network)
          expect(addr.payload.toString('hex')).toBe(payload)
        })
      })
    })

    describe('From bytes', () => {
      const vectors = JSON.parse(fs.readFileSync(path.join(__dirname, ADDRESSES_VECTOR), 'utf-8')) as AddressTestCase[]

      vectors.forEach(({ string, payload, bytes, protocol, network }, index) => {
        test(`Test case ${index}: 0x${bytes}`, () => {
          const addr = Address.fromBytes(network as Network, Buffer.from(bytes, 'hex'))

          expect(addr.toString()).toBe(string)
          expect(addr.toBytes().toString('hex')).toBe(bytes)
          expect(addr.protocol).toBe(protocol)
          expect(addr.network).toBe(network)
          expect(addr.payload.toString('hex')).toBe(payload)
        })
      })
    })
  })

  describe('Manual', () => {
    describe('Type ID', () => {
      describe('From string', () => {
        test('Testnet', async () => {
          const addr = Address.fromString('t08666')
          expect(addr.toString()).toBe('t08666')
          expect(addr.toBytes().toString('hex')).toBe('00da43')
          expect(addr.protocol).toBe(ProtocolIndicator.ID)
          expect(addr.network).toBe(Network.Testnet)
        })

        test('Mainnet', async () => {
          const addr = Address.fromString('f08666')
          expect(addr.toString()).toBe('f08666')
          expect(addr.toBytes().toString('hex')).toBe('00da43')
          expect(addr.protocol).toBe(ProtocolIndicator.ID)
          expect(addr.network).toBe(Network.Mainnet)
        })
      })

      describe('From bytes', () => {
        test('Testnet', async () => {
          const addr = Address.fromBytes(Network.Testnet, Buffer.from('00da43', 'hex'))
          expect(addr.toString()).toBe('t08666')
          expect(addr.toBytes().toString('hex')).toBe('00da43')
          expect(addr.protocol).toBe(ProtocolIndicator.ID)
          expect(addr.network).toBe(Network.Testnet)
        })

        test('Mainnet', async () => {
          const addr = Address.fromBytes(Network.Mainnet, Buffer.from('00da43', 'hex'))
          expect(addr.toString()).toBe('f08666')
          expect(addr.toBytes().toString('hex')).toBe('00da43')
          expect(addr.protocol).toBe(ProtocolIndicator.ID)
          expect(addr.network).toBe(Network.Mainnet)
        })
      })
    })

    test('Wrong protocol for ID', async () => {
      expect(() => {
        AddressId.fromString('f18666')
      }).toThrow(InvalidProtocolIndicator)
    })

    test('Wrong protocol for BLS', async () => {
      expect(() => {
        AddressBls.fromString('f48666')
      }).toThrow(InvalidProtocolIndicator)
    })

    test('Wrong protocol for SECP256K1', async () => {
      expect(() => {
        AddressSecp256k1.fromString('f08666')
      }).toThrow(InvalidProtocolIndicator)
    })

    test('Wrong protocol for Actor', async () => {
      expect(() => {
        AddressActor.fromString('f08666')
      }).toThrow(InvalidProtocolIndicator)
    })
  })
})
