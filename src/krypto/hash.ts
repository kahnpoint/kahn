import { bytes } from '@/index'
import type { Bytes } from '@/index'
import { blake3 } from '@noble/hashes/blake3'
import { VersionedBytes } from '@/bytes'
import { argon2id, argon2Verify } from 'hash-wasm'
import { Salt } from './salt'

/**
 * Fast Hash
 */
export class FastHash extends VersionedBytes<FastHash> {
	static digest(data: Bytes): FastHash {
		return new FastHash({
			bytes: blake3(data),
		})
	}

	verify(hashedData: Bytes): boolean {
		return bytes.isEqual(this.bytes, blake3(hashedData))
	}
}

/**
 * SaltHash (Salted Fast Hash)
 */
const SALT_HASH_SALT_LENGTH_BYTES = 32
export class SaltHash extends VersionedBytes<SaltHash> {
	static digest(data: Bytes, salt?: Salt): SaltHash {
		salt = salt ?? new Salt({ saltLength: SALT_HASH_SALT_LENGTH_BYTES })

		// Check if salt is valid
		if (salt && salt.bytes.length !== SALT_HASH_SALT_LENGTH_BYTES) {
			throw new Error(`Salt must be ${SALT_HASH_SALT_LENGTH_BYTES} bytes long`)
		}

		return new SaltHash({
			bytes: bytes.concat(salt.bytes, blake3(bytes.concat(salt.bytes, data))),
		})
	}

	verify(data: Bytes, salt: Salt): boolean {
		return bytes.isEqual(
			this.bytes,
			bytes.concat(salt.bytes, blake3(bytes.concat(salt.bytes, data)))
		)
	}
}

/**
 * Slow Hash (Salted Slow Hash)
 */
const SLOW_HASH_SALT_LENGTH_BYTES = 32
export class SlowHash extends VersionedBytes<SlowHash> {
	static async digestAsync(data: Bytes, salt?: Salt): Promise<SlowHash> {
		salt = salt ?? new Salt({ saltLength: SLOW_HASH_SALT_LENGTH_BYTES })

		// Check if salt is valid
		if (salt && salt.bytes.length !== SLOW_HASH_SALT_LENGTH_BYTES) {
			throw new Error(`Salt must be ${SLOW_HASH_SALT_LENGTH_BYTES} bytes long`)
		}

		return argon2id({
			password: bytes.toString(data),
			salt: salt.bytes,
			parallelism: 1,
			iterations: 256,
			memorySize: 512, // use 512KB memory
			hashLength: 32, // output size = 32 bytes
			outputType: 'encoded', // return standard encoded string containing parameters needed to verify the key
		})
			.then((hash) => {
				return new SlowHash({ bytes: bytes.fromString(hash) })
			})
			.catch((err) => {
				throw new Error(err)
			})
	}

	async verifyAsync(data: Bytes): Promise<boolean> {
		return argon2Verify({
			password: bytes.toString(data),
			hash: bytes.toString(this.bytes),
		})
			.then((valid) => {
				return valid
			})
			.catch((err) => {
				throw new Error(err)
			})
	}
}
