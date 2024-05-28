import { VersionedBytes } from "@/bytes"
import type { Bytes, EncryptedBytes, Milliseconds } from "@/index"
import {sha256} from '@noble/hashes/sha256'
import { hkdf } from "@noble/hashes/hkdf"
import type { Derivable } from "@/interfaces"
import {
	ed25519 as ed,
	edwardsToMontgomeryPriv,
	edwardsToMontgomeryPub,
	x25519 as xd,
} from '@noble/curves/ed25519'
import { bytes, proto } from "@/index"
import { chacha20poly1305 } from '@noble/ciphers/chacha'
import { managedNonce } from '@noble/ciphers/webcrypto'
import { ProtoType } from "@/protos/protoType"
import type { Salt } from "./salt"
import { blake3 } from "@noble/hashes/blake3"
const chacha = managedNonce(chacha20poly1305)


/**
 * Signature
*/
interface Signable {
	// create(data: Bytes, privateKey: PrivateKey): Signature
	verify(data: Bytes, publicKey: PublicKey): boolean
	
}
export class Signature extends VersionedBytes<Signature> implements Signable {
	
	static sign(data: Bytes, keyPair: KeyPair): Signature {
		const signature = ed.sign(data, keyPair.privateKey.bytes)
		return new Signature({ bytes: signature })
	}
	
	verify(data: Bytes, publicKey: PublicKey): boolean {
		return ed.verify(this.bytes, data, publicKey.bytes)
	}
}



/**
 * Key
*/
export class Key extends VersionedBytes<Key> implements Derivable<Key> {
	
	constructor(options?: { bytes: Bytes }) {
		super(options)
	}
	
	derive(salt: Bytes): Key {
		const key = hkdf(sha256, this.bytes, undefined, salt, 32)
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

export class PublicKey extends Key implements PublicKeyable, Montgomeryable<MontgomeryPublicKey> {
	
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
export class PrivateKey extends Key implements PrivateKeyable, Montgomeryable<MontgomeryPrivateKey> {
	
	_montgomery: Bytes | null = null
	
	constructor(options?: { bytes: Bytes }) {
		options = options ?? {bytes: ed.utils.randomPrivateKey()}	
		
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
interface SharedKeyable{
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



/**
 * KeyPair
*/

interface KeyPairable {
	sign(data: Bytes): Signature
	sharedKey(publicKey: PublicKey): SharedKey
}

@proto.type('KeyPair')
export class KeyPair extends ProtoType<KeyPair> implements KeyPairable{
	
	@proto.field(0, Key, 'required')
	public publicKey: PublicKey
	
	@proto.field(1, Key, 'required')
	public privateKey: PrivateKey
	
	constructor(options?: { privateKey?: PrivateKey, privateKeyBytes?: Bytes }) {
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
		const sharedKey = xd.getSharedSecret(this.privateKey.toMontgomery(), publicKey.toMontgomery())
		return new SharedKey({ bytes: blake3(bytes.concat(sharedKey, salt ? salt.bytes : bytes.create(0))) })
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