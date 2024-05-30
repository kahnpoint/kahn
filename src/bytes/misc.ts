import type { Bytes, ChunkedBytes, ByteLength } from './types'
import { Comparison } from '../misc/types'
import { randomBytes } from '@noble/ciphers/crypto'
import { concatBytes, equalBytes } from '@noble/ciphers/utils'

// reverse a byte buffer
export function reverse(bytes: Bytes): Bytes {
	return bytes.reverse()
}

// concat two or more byte buffers
export function concat(...buffers: Bytes[]): Bytes {
	return concatBytes(...buffers)
}

// compare two byte buffers for equality
export function isEqual(a: Bytes, b: Bytes): boolean {
	return equalBytes(a, b)
}

// split a byte buffer at a given index
export function split(bytes: Bytes, index: number): [Bytes, Bytes] {
	return [bytes.subarray(0, index), bytes.subarray(index)]
}

// generate random bytes
export function random(length: ByteLength): Bytes {
	return randomBytes(length)
}

export function chunk(bytes: Bytes, chunkSize: ByteLength): ChunkedBytes {
	const chunkCount = Math.ceil(bytes.byteLength / chunkSize)
	const chunkOutput: Uint8Array[] = []
	for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
		const byteOffset = chunkIndex * chunkSize
		const byteLength = Math.min(bytes.byteLength - byteOffset, chunkSize)

		const chunkBytes = bytes.subarray(byteOffset, byteOffset + byteLength)

		chunkOutput.push(chunkBytes)
	}
	return chunkOutput
}

export function unchunk(chunks: ChunkedBytes): Bytes {
	return concat(...chunks)
}

// uint8buffers

// create a new byte array 	of a given length
import { alloc } from 'uint8arrays/alloc'
export const create = (length: ByteLength): Bytes => alloc(length)

// compare two byte buffers for equality, can be used with Array.sort to sort and array with Uint8Array entries
import { compare as _compare } from 'uint8arrays/compare'
export const compare = (a: Bytes, b: Bytes): Comparison => _compare(a, b)

// xor two byte buffers
import { xor as _xor } from 'uint8arrays/xor'
export const xor = (a: Bytes, b: Bytes): Bytes => _xor(a, b)
