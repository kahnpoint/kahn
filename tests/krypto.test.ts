import { expect, test } from "bun:test";
import { krypto, bytes } from '../src/index'

test('hashes', async () => {
	
	const testBytes = bytes.fromHex('deadbeef')
	
	const fastHash = krypto.FastHash.digest(testBytes)
	
	console.log(fastHash.toBytes())

	console.log(fastHash.toString())

})
