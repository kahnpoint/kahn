import { test, expect } from 'bun:test'
import { krypto } from '@/index'

// 1 character - 0s
// 2 characters - .5-1s
// 3 characters - 16-32s
// 4 characters - 512s-1024s (8-17m)
test('vanity', async () => {
	const prefix = '2'

	const vanity = await new krypto.KeyPair().vanityAsync(prefix)

	console.log('vanity', vanity.publicKey.toString())
	console.log(vanity.toString())

	expect(vanity.publicKey.toString().startsWith(prefix)).toBe(true)
}, 1000000)
