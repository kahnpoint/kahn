import type { Bytes } from '@/index'
import { proto } from '@/index'

@proto.type('VersionedBytes')
export class VersionedBytes<T> extends proto.Typed<VersionedBytes<T>> {
	// append the version in order to allow for vanity prefixes
	@proto.field(1, 'uint32', 'optional', 0)
	version: number

	@proto.field(0, 'bytes', 'required')
	bytes: Bytes
}
