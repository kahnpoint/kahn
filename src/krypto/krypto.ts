import {
	ed25519 as ed,
	edwardsToMontgomeryPriv,
	edwardsToMontgomeryPub,
	x25519 as xd,
} from '@noble/curves/ed25519'
import * as bytes from '../bytes'
import { Bytes, DecryptedBytes, EncryptedBytes } from '../bytes/types'
import {
	Key,
	Checksum,
	Hash,
	KeyPair,
	PrivateKey,
	PublicKey,
	SharedKey,
	Signature,
} from './types'

/**
 * Hash
 */
import { sha256 } from '@noble/hashes/sha256'
export const createHash = (data: Bytes): Hash => {
  const hashBytes = sha256(data)
  return {
    string: bytes.toBase58(hashBytes),
    bytes: hashBytes,
  }
}
  
export function verifyHash(data: Bytes, hash: Hash): boolean {
	return bytes.compare(sha256(data), hash.bytes) === 0
}

/**
 * HKDF
 */
import { hkdf as _hkdf } from '@noble/hashes/hkdf'
export function hkdf(initialKey: Key, salt: Bytes): Key {
	const key = _hkdf(sha256, initialKey.bytes, undefined, salt, 32)

	return {
		string: bytes.toBase58(key),
		bytes: key,
	}
}

/**
 * Chacha
 */
import { chacha20poly1305 } from '@noble/ciphers/chacha'
import { managedNonce } from '@noble/ciphers/webcrypto'
const chacha = managedNonce(chacha20poly1305)

export function encrypt(sharedKey: SharedKey, data: Bytes): EncryptedBytes {
	return chacha(sharedKey.string).encrypt(data)
}

export function decrypt(sharedKey: SharedKey, data: Bytes): DecryptedBytes {
	return chacha(sharedKey.string).decrypt(data)
}

/**
 * Crc
 */
import * as crc32 from 'crc-32'
export const createChecksum = (digest: Bytes): Checksum => crc32.buf(digest)
export const verifyChecksum = (digest: Bytes, checksum: Checksum) =>
	crc32.buf(digest) === checksum

/**
 * Ed25519
 */

type CreatePrivateKeyOptions =
	| {
			privateKeyString: string
	  }
	| {
			privateKeyBytes: Bytes
	  }
export function createPrivateKey(
	options?: CreatePrivateKeyOptions
): PrivateKey {
	if (!options) {
		const privateKeyBytes = ed.utils.randomPrivateKey()
		return createPrivateKey({ privateKeyBytes })
	} else if ('privateKeyBytes' in options) {
		return {
			string: bytes.toBase58(options.privateKeyBytes),
			bytes: options.privateKeyBytes,
		}
	} else if ('privateKeyString' in options) {
		return {
			string: options.privateKeyString,
			bytes: bytes.fromBase58(options.privateKeyString),
		}
	} else {
		throw new Error('Invalid options')
	}
}

type CreatePublicKeyOptions =
	| {
			publicKeyString: string
	  }
	| {
			publicKeyBytes: Bytes
	  }
export function createPublicKey(options: CreatePublicKeyOptions): PublicKey {
	if ('publicKeyString' in options) {
		return {
			string: options.publicKeyString,
			bytes: bytes.fromBase58(options.publicKeyString),
		}
	} else if ('publicKeyBytes' in options) {
		return {
			string: bytes.toBase58(options.publicKeyBytes),
			bytes: options.publicKeyBytes,
		}
	} else {
		throw new Error('Invalid options')
	}
}

type CreateKeyPairOptions =
	| {
			privateKey: PrivateKey
	  }
    | {
			privateKeyString: string
	  }
	| {
			privateKeyBytes: Bytes
	  }
export function createKeyPair(options?: CreateKeyPairOptions): KeyPair {
	if (!options) {
		return createKeyPair({ privateKeyBytes: ed.utils.randomPrivateKey() })
	} else if ('privateKeyBytes' in options) {
		return createKeyPair({
			privateKey: createPrivateKey({
				privateKeyBytes: options.privateKeyBytes,
			}),
		})
  } else if ('privateKeyString' in options) {
    return createKeyPair({
      privateKey: createPrivateKey({
        privateKeyString: options.privateKeyString,
      }),
    })
	} else if ('privateKey' in options) {
		return {
			publicKey: createPublicKey({
				publicKeyBytes: ed.getPublicKey(options.privateKey.bytes),
			}),
			privateKey: options.privateKey,
		}
	} else {
		throw new Error('Invalid options')
	}
}

export function verifyKeyPair(keyPair: KeyPair): boolean {
	return (
		bytes.compare(
			ed.getPublicKey(keyPair.privateKey.bytes),
			keyPair.publicKey.bytes
		) === 0
	)
}

type CreateSignatureOptions = 
  | {
      signatureString: string
    }
  | {
      signatureBytes: Bytes
    }
  | {
    privateKey: PrivateKey,
    data: Bytes
  }

export function createSignature(
options: CreateSignatureOptions
): Signature {
  if ("signatureString" in options) {
    return {
      string: options.signatureString,
      bytes: bytes.fromBase58(options.signatureString),
    }
  } else if ("signatureBytes" in options) {
    return {
      string: bytes.toBase58(options.signatureBytes),
      bytes: options.signatureBytes,
    }
  } else {
    const signatureBytes = ed.sign(options.privateKey.bytes, options.data)
	  return createSignature({ signatureBytes })
  }
}

export function verifySignature(
	publicKey: PublicKey,
	data: Bytes,
	signature: Signature
): boolean {
	return ed.verify(publicKey.bytes, data, signature.bytes)
}

/**
 * X25519
 */
export function createSharedKey(
	privateKey: PrivateKey,
	publicKey: PublicKey,
	context: Bytes = new Uint8Array([])
): SharedKey {
	const sharedKey = sha256(
		bytes.concat(
			xd.getSharedSecret(
				edwardsToMontgomeryPriv(privateKey.bytes),
				edwardsToMontgomeryPub(publicKey.bytes)
			),
			context
		)
	)

	return {
		string: bytes.toBase58(sharedKey),
		bytes: sharedKey,
	}
}
export function verifySharedKey(
	privateKey: PrivateKey,
	publicKey: PublicKey,
	sharedKey: SharedKey
): boolean {
	return sharedKey === createSharedKey(privateKey, publicKey)
}
