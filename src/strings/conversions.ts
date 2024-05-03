import {Bytes, ByteLength} from '@mootline/types'
import * as b from '../bytes'

	
// bytes
export function toBytes(str: string): Bytes {
	return b.fromString(str)
}

export function fromBytes(bytes: Bytes): string {
	return b.toString(bytes)
}