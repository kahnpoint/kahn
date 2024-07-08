import type { Bytes } from './types'

// hamming distance

// create a lookup table of bit counts for 0-255
const lookup = createLookup()
function createLookup() {
	const lookup = new Uint8Array(256)
	for (let i = 0; i < 256; i++) {
		let c = 0
		for (let j = i; j; j >>= 1) if (j & 1) c++
		lookup[i] = c
	}
	return lookup
}

// calculate the hamming distance between two ByteArrays
export function hamming(a: Bytes, b: Bytes) {
	let distance = 0
	for (let i = 0; i < a.length; i++) {
		distance += lookup[a[i] ^ b[i]]
	}
	return distance
}