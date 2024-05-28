import type { Bytes, Milliseconds } from '@/index'
import { bytes, proto } from '@/index'
import { ProtoType } from '@/protos/protoType'
import { ed25519 as ed, x25519 as xd } from '@noble/curves/ed25519'
import { blake3 } from '@noble/hashes/blake3'
import type { Salt } from './salt'
import { PublicKey, PrivateKey, SharedKey, Key } from './keys'
import { Signature } from './signature'

/**
 * KeyPair
 */
interface KeyPairable {
	sign(data: Bytes): Signature
	sharedKey(publicKey: PublicKey): SharedKey
}

@proto.type('KeyPair')
export class KeyPair extends ProtoType<KeyPair> implements KeyPairable {
	@proto.field(0, Key, 'required')
	public publicKey: PublicKey

	@proto.field(1, Key, 'required')
	public privateKey: PrivateKey

	constructor(options?: { privateKey?: PrivateKey; privateKeyBytes?: Bytes }) {
		super()

		if (!options) {
			options = { privateKeyBytes: ed.utils.randomPrivateKey() }
		}

		if (options.privateKeyBytes) {
			options.privateKey = new PrivateKey({ bytes: options.privateKeyBytes })
		}

		if (!options.privateKey) {
			options.privateKey = new PrivateKey()
		}

		const publicKey = options.privateKey.toPublicKey()

		this.publicKey = publicKey
		this.privateKey = options?.privateKey ?? new PrivateKey()
	}

	sign(data: Bytes): Signature {
		return Signature.sign(data, this)
	}

	sharedKey(publicKey: PublicKey, salt?: Salt): SharedKey {
		const sharedKey = xd.getSharedSecret(
			this.privateKey.toMontgomery(),
			publicKey.toMontgomery()
		)
		return new SharedKey({
			bytes: blake3(
				bytes.concat(sharedKey, salt ? salt.bytes : bytes.create(0))
			),
		})
	}

	static vanity(prefix: string, timeout: Milliseconds): KeyPair {
		prefix = prefix.toLowerCase()

		/**
		 * Check that the prefix is valid
		 */
		const alphabet = bytes.alphabetBase32()
		for (let i = 0; i < prefix.length; i++) {
			if (!alphabet.includes(prefix[i])) {
				throw new Error(`Invalid prefix character: ${prefix[i]}`)
			}
		}

		const prefixBytes = bytes.fromString(prefix)
		const prefixLength = prefixBytes.length

		let privateKey = ed.utils.randomPrivateKey()
		let publicKey = ed.getPublicKey(privateKey)

		const startTime = Date.now()
		while (true) {
			// check if the prefix matches
			if (bytes.compare(publicKey.slice(0, prefixLength), prefixBytes) === 0) {
				return new KeyPair({
					privateKeyBytes: privateKey,
				})
			}

			if (timeout !== null) {
				if (Date.now() - startTime > timeout!) {
					throw new Error('Timeout exceeded')
				}
			}
		}
	}
}
