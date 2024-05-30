import { test } from 'bun:test'
import { bytes } from '@/index'

function test_hamming(iterations: number) {
	const a = bytes.random(32)
	const b = bytes.random(32)

	console.time('hamming')
	for (let i = 0; i < iterations; i++) {
		const _ = bytes.hamming(a, b)
	}
	console.timeEnd('hamming')
}

// 40ms / 1_000_000 iterations = 40ns per comparison
// 0.08ms / 1_000 iterations = 80ns per comparison
test('hamming', async () => {
	const iterations = 1_000
	test_hamming(iterations)
	test_hamming(iterations)
	test_hamming(iterations)
})
