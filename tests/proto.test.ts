import { test, expect } from 'bun:test'
import { proto } from '../src'

@proto.type('Test')
class Test extends proto.Typed<Test> {
	@proto.field(0, 'string', 'required')
	public name: string

	@proto.field(1, 'int32', 'required')
	public age: number

	@proto.field(2, proto.Timestamp, 'required')
	public timestamp: proto.Timestamp
}

test('proto', async () => {
	const test = new Test({
		name: 'test',
		age: 10,
		timestamp: proto.Timestamp.fromNow(),
	})

	expect(test.name).toBe('test')

	expect(test.timestamp.toDate().getTime()).toBeLessThan(Date.now())
})
