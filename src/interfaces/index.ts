import type { Bytes } from '@/index'

export interface Stringable<T> {
	toString(): string
	fromString(str: string): T
}

export interface Byteable<T> {
	toBytes(): Bytes
	fromBytes(bytes: Bytes): T
}

export interface Hashable<T> {
	create(data: Bytes): T
	verify(data: Bytes): boolean	
}

export interface Derivable<T> {
	derive(salt: Bytes): T
}

export interface Randomable<T> {
	random(): T
}

