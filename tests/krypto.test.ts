import { expect, test } from 'bun:test'
import { krypto, bytes } from '../src/index'

test('hashes', async () => {
	const testBytes = bytes.fromHex('deadbeef')

	// fast hash
	const fastHash = krypto.FastHash.digest(testBytes)
	expect(fastHash.verify(testBytes)).toBe(true)

	const salt = new krypto.Salt()

	// salt hash
	const saltedHash = krypto.SaltHash.digest(testBytes, salt)
	expect(saltedHash.verify(testBytes, salt)).toBe(true)

	// slow hash
	const slowHash = await krypto.SlowHash.digestAsync(testBytes)
	expect(await slowHash.verifyAsync(testBytes)).toBe(true)

	// checksum
	const checksum = krypto.Checksum.digest(testBytes)
	expect(checksum.verify(testBytes)).toBe(true)
})

test('keys', async () => {
	const testBytes = bytes.fromHex('deadbeef')

	// key exchange

	const alice = new krypto.KeyPair()
	const bob = new krypto.KeyPair()

	const salt = new krypto.Salt()
	const aliceSharedKey = alice.sharedKey(bob.publicKey, salt)
	const bobSharedKey = bob.sharedKey(alice.publicKey, salt)

	expect(aliceSharedKey.bytes).toEqual(bobSharedKey.bytes)

// encrypt/decrypt

let encrypted = aliceSharedKey.encrypt(testBytes)

let decrypted = bobSharedKey.decrypt(encrypted)

	expect(decrypted).toEqual(testBytes)
})
