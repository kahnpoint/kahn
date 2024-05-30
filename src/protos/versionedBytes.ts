import type { Bytes } from '@/index'
import { proto } from '@/index'

@proto.type('VersionedBytes')
export class VersionedBytes<T> extends proto.Typed<VersionedBytes<T>> {
	@proto.field(0, 'uint32', 'optional', 0)
	version: number

	@proto.field(1, 'bytes', 'required')
	bytes: Bytes
}
