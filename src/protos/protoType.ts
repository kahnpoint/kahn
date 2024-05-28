import { bytes, proto } from '@/index'
import type { Bytes } from '@/index'
import type { Stringable, Byteable } from '@/interfaces'

/**
 * A shim that adds the toBytes and fromBytes methods to a class
 */
export class ProtoType<T>
	extends proto.Message<ProtoType<T>>
	implements Byteable<T>, Stringable<T>
{
	constructor(options?: Partial<T>) {
		super(options)
	}

	/**
	 * Byteable
	 */
	toBytes(): Bytes {
		return (this.constructor as typeof ProtoType).encode(this).finish()
	}

	fromBytes(bytes: Bytes): T {
		return (this.constructor as typeof ProtoType).decode(bytes) as T
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
}
