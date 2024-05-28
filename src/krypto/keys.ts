import type { Bytes, EncryptedBytes } from '@/index'
import { chacha20poly1305 } from '@noble/ciphers/chacha'
import { managedNonce } from '@noble/ciphers/webcrypto'
import {
	ed25519 as ed,
	edwardsToMontgomeryPriv,
	edwardsToMontgomeryPub,
} from '@noble/curves/ed25519'
import { hkdf } from '@noble/hashes/hkdf'
import { sha256 } from '@noble/hashes/sha256'
import type { Salt } from './salt'
const chacha = managedNonce(chacha20poly1305)
import { proto } from '@/index'

/**
 * Key
 */
export class Key extends proto.VersionedBytes<Key> {
	constructor(options?: { bytes: Bytes }) {
		super(options)
	}

	derive(salt: Salt): Key {
		const key = hkdf(sha256, this.bytes, undefined, salt.bytes, 32)
		return new Key({ bytes: key })
	}
}

/**
 * Montgomery
 */
export type MontgomeryPublicKey = Bytes
export type MontgomeryPrivateKey = Bytes

interface Montgomeryable<T> {
	toMontgomery(): T
}

/**
 * Public Key
 */
interface PublicKeyable {}

export class PublicKey
	extends Key
	implements PublicKeyable, Montgomeryable<MontgomeryPublicKey>
{
	_montgomery: Bytes | null = null

	/**
	 * Montgomeryable
	 */
	toMontgomery(): MontgomeryPublicKey {
		if (!this._montgomery) {
			this._montgomery = edwardsToMontgomeryPub(this.bytes)
		}
		return this._montgomery
	}
}

/**
 * Private Key
 */
interface PrivateKeyable {
	toPublicKey(): PublicKey
}
export class PrivateKey
	extends Key
	implements PrivateKeyable, Montgomeryable<MontgomeryPrivateKey>
{
	_montgomery: Bytes | null = null

	constructor(options?: { bytes: Bytes }) {
		options = options ?? { bytes: ed.utils.randomPrivateKey() }

		super(options)
	}

	toPublicKey(): PublicKey {
		const key = ed.getPublicKey(this.bytes)
		return new PublicKey({ bytes: key })
	}

	/**
	 * Montgomeryable
	 */
	toMontgomery(): MontgomeryPublicKey {
		if (!this._montgomery) {
			this._montgomery = edwardsToMontgomeryPriv(this.bytes)
		}
		return this._montgomery
	}
}

/**
 * Shared Key
 */
interface SharedKeyable {
	encrypt(data: Bytes): EncryptedBytes
	decrypt(data: EncryptedBytes): Bytes
}
export class SharedKey extends Key implements SharedKeyable {
	encrypt(data: Bytes): EncryptedBytes {
		return chacha(this.bytes).encrypt(data)
	}
	decrypt(data: EncryptedBytes): Bytes {
		return chacha(this.bytes).decrypt(data)
	}
}
