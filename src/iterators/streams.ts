/**
 * Browser
 */

// Turns a browser readble stream into an async iterator
import toBrowserStream from 'it-to-browser-readablestream'
/*
import toBrowserStream from 'it-to-browser-readablestream'

// This can also be an iterator, async iterator, generator, etc
const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]

const stream = await toBrowserStream(values)

for await (const buf of stream) {
  console.info(buf) // Buffer[0, 1]
}
*/
export { toBrowserStream }

// Turns a browser readble stream into an async iterator
import fromBrowserStream from 'browser-readablestream-to-it'
export { fromBrowserStream }

/**
 * Bytes
 */

// An async iterator that emits buffers containing bytes up to a certain length
/*
import bufferStream from 'it-buffer-stream'

const totalLength = //... a big number

// all options are optional, defaults are shown
const options = {
  chunkSize: 4096, // how many bytes will be in each buffer
  collector: (buffer) => {
    // will be called as each buffer is generated. the final buffer
    // may be smaller than `chunkSize`
  },
  generator: async (size) => {
    // return a promise that resolves to a buffer of length `size`
    //
    // if omitted, `Promise.resolve(crypto.randomBytes(size))` will be used
  }
}

let buffers = []

for await (buf of bufferStream(totalLength, options)) {
  buffers.push(buf)
}

// `buffers` is an array of Buffers the combined length of which === totalLength
*/
import toChunkedByteStream from 'it-buffer-stream'
export { toChunkedByteStream }

// Read and write arbitrary bytes over a duplex stream
/*import { byteStream } from 'it-byte-stream'

const stream = byteStream(duplex)

// read the next chunk
const bytes = await stream.read()

// read the next five bytes
const fiveBytes = await stream.read(5)

// write individul bytes into the stream
await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))
const fiveBytes = await stream.read(5)
*/
import { byteStream as toSingleByteStream } from 'it-byte-stream'
export { toSingleByteStream }

// Read and write length-prefixed byte arrays over a duplex stream
/*
import { lpStream } from 'it-length-prefixed-stream'

const stream = lpStream(duplex)

// read the next length-prefixed chunk
const bytes = await stream.read()

// write a length-prefixed chunk
await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))

// write several chunks, all individually length-prefixed
await stream.writeV([
  Uint8Array.from([0, 1, 2, 3, 4]),
  Uint8Array.from([5, 6, 7, 8, 9])
])
*/
import { lpStream as toVariableByteStream } from 'it-length-prefixed-stream'
export { toVariableByteStream }

// This module makes it easy to send and receive length-prefixed Protobuf encoded messages over streams.
/*
const stream = pbStream(duplex)

// write a message to the stream
stream.write({
  foo: 'bar'
}, MessageType)

// read a message from the stream
const res = await stream.read(MessageType)
*/
import { pbStream as toProtoStream } from 'it-protobuf-stream'
export { toProtoStream }
