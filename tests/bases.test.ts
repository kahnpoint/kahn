import { test, expect } from 'bun:test'
import { bytes, krypto } from '@/index'

test('bases', async () => {
	const keypair = new krypto.KeyPair()

	const encodedKeypair = keypair.toString()
	const encodedPublic = keypair.publicKey.toString()

	console.log(encodedKeypair)
	console.log(encodedPublic)

	const decodedKeypair = new krypto.KeyPair().fromString(encodedKeypair)
	const decodedPublic = new krypto.PublicKey().fromString(encodedPublic)

	expect(decodedKeypair.toBytes()).toEqual(keypair.toBytes())
	expect(decodedPublic.toBytes()).toEqual(keypair.publicKey.toBytes())
})

test('signatures', async () => {
	const randomData = bytes.random(32)

	const keypair = new krypto.KeyPair()

	const signature = keypair.sign(randomData)

	const verified = signature.verify(randomData, keypair.publicKey)

	expect(verified).toBe(true)

	const verifiedFalse = signature.verify(bytes.random(32), keypair.publicKey)

	expect(verifiedFalse).toBe(false)
})
