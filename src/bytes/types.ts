// Bytes
export type Bytes = Uint8Array
export type EncryptedBytes = Uint8Array
export type DecryptedBytes = Uint8Array
export type HashedBytes = Uint8Array
export type SignedBytes = Uint8Array
export type ChunkedBytes = Uint8Array[]
export type ByteLength = number // the length of a Bytes array
export enum ByteLengthOf {
	Uint8 = 1,
	Uint16 = 2,
	Uint32 = 4,
	Uint64 = 8,
}
