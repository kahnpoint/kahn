import * as bytes from '../bytes'

// create a random base32 string
export function random(len: number): string {
	return bytes.toBase32(bytes.random(len))
}
