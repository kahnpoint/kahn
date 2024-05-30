import { bytes } from '@/index'
import type { Bytes } from '@/index'
import { proto } from '@/index'

export interface Stringable<T> {
	toString(): string
	fromString(str: string): T
}

export interface Byteable<T> {
	toBytes(): Bytes
	fromBytes(bytes: Bytes): T
}

export interface Emojiable<T> {
	toEmoji(): string
	fromEmoji(emoji: string): T
}

/**
 * A shim that adds serialization methods to a class
 */
export class Typed<T>
	extends proto.Message<Typed<T>>
	implements Byteable<T>, Stringable<T>
{
	constructor(options?: Partial<T>) {
		super(options)
	}

	/**
	 * Byteable
	 */
	toBytes(): Bytes {
		return (this.constructor as typeof Typed).encode(this).finish()
	}

	fromBytes(bytes: Bytes): T {
		return (this.constructor as typeof Typed).decode(bytes) as T
	}

	/**
	 * Stringable
	 */
	toString(): string {
		return bytes.toBase32(this.toBytes())
	}

	fromString(str: string): T {
		return this.fromBytes(bytes.fromBase32(str)) as T
	}

	/**
	 * Emojiable
	 */
	toEmoji(): string {
		return bytes.toEmoji(this.toBytes())
	}

	fromEmoji(emoji: string): T {
		return this.fromBytes(bytes.fromEmoji(emoji)) as T
	}
}
