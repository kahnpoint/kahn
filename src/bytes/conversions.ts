import type { Bytes } from './types'
import {
	bytesToHex,
	numberToBytesBE,
	bytesToNumberBE,
	bytesToUtf8,
	hexToBytes,
	utf8ToBytes,
} from '@noble/ciphers/utils'
import { base58xmr as base58, base64urlnopad as base64, base32 } from '@scure/base'

// buffer
export function toBuffer(bytes: Bytes): ArrayBuffer {
	return bytes.buffer
}
export function fromBuffer(buffer: ArrayBuffer): Uint8Array {
	return new Uint8Array(buffer)
}

// hex
export function toHex(bytes: Uint8Array): string {
	return bytesToHex(bytes)
}
export function fromHex(hex: string): Bytes {
	return hexToBytes(hex)
}

// numbers
export function toNumber(bytes: Bytes): bigint {
	return bytesToNumberBE(bytes)
}
export function fromNumber(n: number | bigint, len: number): Uint8Array {
	return numberToBytesBE(n, len)
}

/*
// strings (reuses textDecoder and textEncoder)
const textDecoder = new TextDecoder()
export function toString(bytes: Bytes): string {
	return textDecoder.decode(bytes)
}
const textEncoder = new TextEncoder()
export function fromString(str: string): Bytes {
	return textEncoder.encode(str)
}
*/

// strings (threadsafe)
export function toString(bytes: Bytes): string {
	return new TextDecoder().decode(bytes)
}
export function fromString(str: string): Bytes {
	return new TextEncoder().encode(str)
}

// base32 strings
export function toBase32(bytes: Bytes): string {
	return base32.encode(bytes).toLowerCase()
}
export function fromBase32(str: string): Bytes {
	return base32.decode(str.toUpperCase())
}
export function alphabetBase32() {
	return 'abcdefghijklmnopqrstuvwxyz234567'
}

// base58 strings
export function toBase58(bytes: Bytes): string {
	return base58.encode(bytes)
}
export function fromBase58(str: string): Bytes {
	return base58.decode(str)
}
export function alphabetBase58() {
	return '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
}

// base64 strings
export function toBase64(bytes: Bytes): string {
	return base64.encode(bytes)
}
export function fromBase64(str: string): Bytes {
	return base64.decode(str)
}
export function alphabetBase64() {
	return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
}

// binary strings (not recommended)
export function toBinaryString(bytes: Bytes): string {
	return [...bytes].map((b) => b.toString(2).padStart(8, '0')).join('')
}
export function fromBinaryString(str: string): Bytes {
	const bytes = new Uint8Array(str.length / 8)
	for (let i = 0; i < str.length; i += 8) {
		bytes[i / 8] = parseInt(str.slice(i, i + 8), 2)
	}
	return bytes
}

// timestamps
export function fromTimestamp(timestamp: number) {
	const buffer = new ArrayBuffer(8) // an Int64 uses 8 bytes
	const view = new DataView(buffer)
	view.setBigUint64(0, BigInt(timestamp), true)
	return new Uint8Array(buffer)
}
export function toTimestamp(bytes: Bytes) {
	const view = new DataView(bytes.buffer)
	// return date object
	return new Date(Number(view.getBigUint64(0, true)))
}
export function nowTimestamp() {
	return toTimestamp(fromNumber(Date.now(), 8))
}

// objects
export function fromObject(object: object): Bytes {
	return utf8ToBytes(JSON.stringify(object))
}
export function toObject(bytes: Bytes): object {
	return JSON.parse(bytesToUtf8(bytes))
}
