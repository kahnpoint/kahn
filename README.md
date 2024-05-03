# Kahn

This package holds my commonly used utility functions and classes. 

# Packages

### Reexports
```javascript
import {_} from 'kahn' // lodash
import {id} from 'kahn' // nanoid
import {cache} from 'kahn' // lib0/cache
```

### Bytes
Byte manipulation functions.
```javascript
import {bytes} from 'kahn'

// conversions
// buffer
bytes.fromBuffer(buffer: ArrayBuffer): Bytes
bytes.toBuffer(b: Bytes): ArrayBuffer
// hex
bytes.fromHex(hex: string): Bytes
bytes.toHex(b: Bytes): string
// number
bytes.fromNumber(num: number): Bytes
bytes.toNumber(b: Bytes): number
// string
bytes.fromString(str: string): Bytes
bytes.toString(b: Bytes): string
// base58 (xmr)
bytes.fromBase58(base58: string): Bytes
bytes.toBase58(b: Bytes): string
// timestamps
bytes.fromTimestamp(date: Date): Bytes
bytes.toTimestamp(b: Bytes): Date
bytes.nowTimestamp(): Bytes
// objects (JSON)
bytes.fromObject(obj: object): Bytes
bytes.toObject(b: Bytes): object

// comparisons
bytes.xor(b1: Bytes, b2: Bytes)
bytes.hamming(b1: Bytes, b2: Bytes)
bytes.equal(b1: Bytes, b2: Bytes): boolean
bytes.compare(b1: Bytes, b2: Bytes): Comparison

// manipulation
bytes.concat(...b: Bytes[])
bytes.chunk(b: Bytes, chunkSize: number): ChunkedBytes
bytes.unchunk(b: ChunkedBytes): Bytes

// misc
bytes.random(length: number)
bytes.ByteMap<V>: Map<Bytes, V> // a map that uses Bytes as keys, not recommended due to serialization performance
```

 
### Krypto 
*(named weirdly to avoid conflict with node's crypto package)*
Cryptographic functions.



### Encoder and Decoder
Mostly the same as (lib0)[https://www.npmjs.com/package/lib0], but with an additional `repeated` function that allows for decoding sequences of the same type, similar to the `repeated` function in (protobufjs)[https://www.npmjs.com/package/protobufjs].

```javascript
import {encoder} from 'kahn'

const randomBytes = [bytes.random(10), bytes.random(10), bytes.random(20)]

// Encode
const encoding = encoder.create()
encoder.repeated(encoder.writeBytes, encoding, randomBytes)
const serialized = encoder.toBytes(encoding)

// Decode
const decoding = decoder.create(serialized)
const decodedBytes = decoder.repeated(decoder.readBytes, decoding)
const deserialized = decoder.toBytes(decoding)

randomBytes === decodedBytes // true
```

### It
Renamed iterator functions from (it)[https://github.com/achingbrain/it].
```javascript
import {it} from 'kahn'

/* Create */

// Create an iterable that can be pushed to
//const iter = it.pushable().push(0)
it.pushable(): Pushable<T>

/* Actions */

// Collects all the values into an array
it.collect(iterable: Iterable<T>): Promise<T[]>

// Empties the iterable
it.drain(iterable: Iterable<T>): Promise<void>

// Returns the next value
it.first(iterable: Iterable<T>): Promise<T>

// Returns the last value
it.last(iterable: Iterable<T>): Promise<T>

// Takes the first n items from an iterable
it.take(iterable: Iterable<T>, n: number): AsyncIterable<T>

// Skip n items
it.skip(iterable: Iterable<T>, n: number): AsyncIterable<T>

// Merges multiple iterables into a single iterable
it.merge(...iterables: Iterable<T>[]): AsyncIterable<T>

// Empties and counts the number of items in an iterable
it.count(iterable: Iterable<T>): Promise<number>

/* Flow */

// Filters the passed iterable by the filter function
it.filter(iterable: Iterable<T>, filter: (value: T) => boolean): AsyncIterable<T>

// Maps the values by a function 
it.map(iterable: Iterable<T>, map: (value: T) => U): AsyncIterable<U>

// Reduces the values by a function
it.reduce(
	iterable: Iterable<T>, 
	reducer: (acc: U, curr: T, index: number) => U, 
	initialValue: U
	): Promise<U>

// Sorts the values by a function
it.sort(iterable: Iterable<T>, sorter: (a: T, b: T) => number): AsyncIterable<T>

// Applies a function to each item in the iterable
it.apply(source: Iterable<T>, 
	fn: (thing: T, index: number) => Promise<void>
): AsyncGenerator<T> 

// Invokes each incoming function in parallel
// Batched jobs are always ordered and ignore concurrency
it.process(
	source: Iterable<() => Promise<T>> | AsyncIterable<() => Promise<T>>,
  options: {concurrency: 1, ordered: true, batchSize: 0}): AsyncIterable<T>

/* Pipes */

// Pipes (tees) the iterable into multiple sinks
it.pipe(source: Iterable<T>, ...sinks: Iterable<T>[]): AsyncIterable<T>

// Get two linked duplex streams
const [orange, blue] = it.portals()

/* Batches */

// Split the values by a delimiter
it.split(iterable: Iterable<Uint8Array>, delimiter?: Uint8Array): AsyncIterable<Uint8Array>

// Batch values into chunks of a certain size
// it.batch([0, 1, 2, 3, 4], 2) => [[0, 1], [2, 3], [4]]
it.batch(iterable: Iterable<T>, size: number): AsyncIterable<T[]>

// Regularize values into chunks of a certain size
// it.rebatch([[0, 1, 2], [3], [4]], 2) => [[0, 1], [2, 3], [4]]
it.rebatch(iterable: Iterable<T[]>): AsyncIterable<T>

/* Modifiers */

// allow for peeking at the next value
// const nextValue = it.peekable([0, 1, 2]).peek()
it.peekable(iterable: Iterable<T>): AsyncIterable<T>

// allow for recovering from errors
it.recoverable(err => {
  // Called with no error when the iteration starts
  if (!err) {
    return myIterable
  } else {
    throw err // or return a new iterable
  }
})

// emits events for each value
const emitter = it.emitter(iterable: AsyncIterable<any>)
// emitter.on('value', (v) => console.log(v))
// emitter.on('end', () => console.log('done'))
// emitter.on('error', (err) => console.error(err))
// await emitter.cancel() // to end early


```

### Misc
```javascript
import {wait} from 'kahn'
await wait(1000) // wait for 1 second
```