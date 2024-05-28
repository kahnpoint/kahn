// For Uint8
export function fromUint8(n: number): Uint8Array {
	const buffer = new ArrayBuffer(1)
	new DataView(buffer).setUint8(0, n)
	return new Uint8Array(buffer)
}

export function toUint8(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getUint8(0)
}

// For Int8
export function fromInt8(n: number): Uint8Array {
	const buffer = new ArrayBuffer(1)
	new DataView(buffer).setInt8(0, n)
	return new Uint8Array(buffer)
}

export function toInt8(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getInt8(0)
}

// For Uint16
export function fromUint16(n: number): Uint8Array {
	const buffer = new ArrayBuffer(2)
	new DataView(buffer).setUint16(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toUint16(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getUint16(0, false) // false for big-endian
}

// For Int16
export function fromInt16(n: number): Uint8Array {
	const buffer = new ArrayBuffer(2)
	new DataView(buffer).setInt16(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toInt16(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getInt16(0, false) // false for big-endian
}

// For Uint32
export function fromUint32(n: number): Uint8Array {
	const buffer = new ArrayBuffer(4)
	new DataView(buffer).setUint32(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toUint32(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getUint32(0, false) // false for big-endian
}

// For Int32
export function fromInt32(n: number): Uint8Array {
	const buffer = new ArrayBuffer(4)
	new DataView(buffer).setInt32(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toInt32(bytes: Uint8Array): number {
	return new DataView(bytes.buffer).getInt32(0, false) // false for big-endian
}

// For BigInt64
export function fromBigInt64(n: bigint): Uint8Array {
	const buffer = new ArrayBuffer(8)
	new DataView(buffer).setBigInt64(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toBigInt64(bytes: Uint8Array): bigint {
	return new DataView(bytes.buffer).getBigInt64(0, false) // false for big-endian
}

// For BigUint64
export function fromBigUint64(n: bigint): Uint8Array {
	const buffer = new ArrayBuffer(8)
	new DataView(buffer).setBigUint64(0, n, false) // false for big-endian
	return new Uint8Array(buffer)
}

export function toBigUint64(bytes: Uint8Array): bigint {
	return new DataView(bytes.buffer).getBigUint64(0, false) // false for big-endian
}
