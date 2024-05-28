import { decoding, encoding } from '../src'
import { test, expect } from 'vitest'

test.skip('repeatedEncoder', () => {
	const encoder = new encoding.Encoder()
	encoding.writeUint8(encoder, 1)
	encoding.repeated(encoding.writeUint8, encoder, [1, 2, 3, 4, 5])
	expect(encoding.toUint8Array(encoder)).toEqual(
		Uint8Array.from([1, 5, 1, 2, 3, 4, 5])
	)

	const decoder = new decoding.Decoder(encoding.toUint8Array(encoder))
	expect(decoding.readUint8(decoder)).toBe(1)
	expect(decoding.repeated(decoder, decoding.readUint8)).toEqual([
		1, 2, 3, 4, 5,
	])
})

test('empty repeatedEncoder', () => {
	const encoder = new encoding.Encoder()
	encoding.writeUint8(encoder, 1)
	encoding.repeated(encoding.writeUint8, encoder, [])
	expect(encoding.toUint8Array(encoder)).toEqual(Uint8Array.from([1, 0]))

	const decoder = new decoding.Decoder(encoding.toUint8Array(encoder))
	expect(decoding.readUint8(decoder)).toBe(1)
	expect(decoding.repeated(decoder, decoding.readUint8)).toEqual([])
})

test('null repeatedEncoder', () => {
	const encoder = new encoding.Encoder()
	encoding.writeUint8(encoder, 1)
	encoding.repeated(encoding.writeUint8, encoder, null)
	expect(encoding.toUint8Array(encoder)).toEqual(Uint8Array.from([1, 0]))

	const decoder = new decoding.Decoder(encoding.toUint8Array(encoder))
	expect(decoding.readUint8(decoder)).toBe(1)
	expect(decoding.repeated(decoder, decoding.readUint8)).toEqual([])
})
