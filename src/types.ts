// bytes
export type Bytes = Uint8Array
export type EncryptedBytes = Uint8Array
export type DecryptedBytes = Uint8Array
export type HashedBytes = Uint8Array
export type SignedBytes = Uint8Array
export type ChunkedBytes = Bytes[]
export type ByteLength = number // the length of a Bytes array


// comparisons
export enum Ternary {
	False = -1,
	Unknown = 0,
	True = 1
}
export enum Comparison {
	LessThan = -1,
	Equal = 0,
	GreaterThan = 1
}