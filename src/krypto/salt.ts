import type { Bytes } from '@/index'
import { bytes, proto } from '@/index'

export class Salt extends proto.VersionedBytes<Salt> {
	constructor(options?: { bytes?: Bytes; saltLength?: number }) {
		options = options || {}
		options.bytes = options.bytes || bytes.random(options.saltLength || 32)

		super(options)
	}
}
