import { bytes } from '@/index'
import type { Bytes } from '@/index'
import crc32 from 'crc-32'
import { proto } from '@/index'

export class Checksum extends proto.VersionedBytes<Checksum> {
	static digest(data: Bytes): Checksum {
		return new Checksum({ bytes: bytes.fromUint32(crc32.buf(data)) })
	}

	verify(data: Bytes): boolean {
		return bytes.isEqual(this.bytes, bytes.fromUint32(crc32.buf(data)))
	}
}
