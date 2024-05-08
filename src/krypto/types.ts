//crypto
import { Bytes } from '../bytes/types'
export type Checksum = number
export type Key = {
	string: string
	bytes: Bytes
}
export type Hash = Key
export type Signature = Key

export type PublicKey = Key
export type PrivateKey = Key
export type SharedKey = Key

export type KeyPair = {
	publicKey: PublicKey
	privateKey: PrivateKey
}
