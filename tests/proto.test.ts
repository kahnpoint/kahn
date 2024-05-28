import { test, expect } from 'bun:test'
import { proto, ProtoType, Timestamp } from '../src'

@proto.type('Test')
class Test extends ProtoType<Test> {
	@proto.field(0, 'string', 'required')
	public name: string

	@proto.field(1, 'int32', 'required')
	public age: number

	@proto.field(2, Timestamp, 'required')
	public timestamp: Timestamp
}

test('proto', async () => {
	const test = new Test({
		name: 'test',
		age: 10,
		timestamp: Timestamp.fromNow(),
	})

	expect(test.name).toBe('test')

	expect(test.timestamp.toDate().getTime()).toBeLessThan(Date.now())
})
