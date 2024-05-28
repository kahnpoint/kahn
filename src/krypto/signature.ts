import { VersionedBytes } from '@/bytes'
import type { Bytes } from '@/index'
import { ed25519 as ed } from '@noble/curves/ed25519'
import { KeyPair } from './keyPair'
import { PublicKey } from './keys'

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
