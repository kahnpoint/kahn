import {bytes} from '@/index'
import type { Bytes } from '@/index'
import { VersionedBytes } from '@/bytes'

export class Salt extends VersionedBytes<Salt> {

	constructor(options?: { bytes?: Bytes, saltLength?: number}) {
		options = options || {}
		options.bytes = options.bytes || bytes.random(options.saltLength || 32)
		
		super(options)
	}
}