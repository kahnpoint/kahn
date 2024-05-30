import type { Bytes, Milliseconds } from '@/index'
import { bytes, proto } from '@/index'
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
export class KeyPair extends proto.Typed<KeyPair> implements KeyPairable {
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

	vanityAsync(prefix: string, timeout?: Milliseconds): Promise<KeyPair> {
		return new Promise((resolve, reject) => {
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

			const startTime = Date.now()

			const generateKey = () => {
				const randomKeypair = new KeyPair()

				if (randomKeypair.publicKey.toString().startsWith(prefix)) {
					resolve(randomKeypair)
				} else {
					if (timeout !== null) {
						if (Date.now() - startTime > timeout!) {
							reject('Timeout exceeded')
						} else {
							setImmediate(generateKey)
						}
					} else {
						setImmediate(generateKey)
					}
				}
			}

			generateKey()
		})
	}
}
