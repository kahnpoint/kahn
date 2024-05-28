import * as proto from './proto'
import { ProtoType } from './protoType'

/**
 * Timestamp - google.protobuf.Timestamp
 */
@proto.type('Timestamp')
export class Timestamp extends ProtoType<Timestamp> {
	@proto.field(0, 'int64', 'required')
	public seconds: bigint

	@proto.field(1, 'int32', 'optional')
	public nanos: number

	static fromDate(date: Date): Timestamp {
		const seconds = BigInt(Math.floor(date.getTime() / 1000))
		const nanos = (date.getTime() % 1000) * 1e6
		return new Timestamp({ seconds, nanos: Number(nanos) })
	}

	static fromNow(): Timestamp {
		return Timestamp.fromDate(new Date())
	}

	toDate(): Date {
		const date = new Date(Number(this.seconds) * 1000)
		date.setMilliseconds(this.nanos / 1e6)
		return date
	}
}
