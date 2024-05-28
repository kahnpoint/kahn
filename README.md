# Kahn

My current collection of Typescript utility functions.
Some of these will be stripped out as I find what functions I use the most.
_In the future I plan to make the exports more modular, like how lodash has `lodash/` for individual functions._

## Categories

- [Reexports](#reexports)
- [Bytes](#bytes)
- [Crypto](#krypto)
- [Protobufs](#protobufs)
- [Iterating](#iterating)
- [Promising](#promising)
- [Constants](#constants)
- [Types](#types)

## Packages

### Reexports

```javascript
import { _ } from 'kahn' // lodash
import { id } from 'kahn' // nanoid
import { ky } from 'kahn' // ky
```

<!-- import { cache } from 'kahn' // lib0/cache-->

### Bytes

```javascript
import { bytes } from 'kahn'

// conversions
// buffer
bytes.fromBuffer(buffer: ArrayBuffer): Bytes
bytes.toBuffer(data: Bytes): ArrayBuffer
// hex
bytes.fromHex(hex: string): Bytes
bytes.toHex(data: Bytes): string
// number
bytes.fromNumber(num: number): Bytes
bytes.toNumber(data: Bytes): number
// string
bytes.fromString(str: string): Bytes
bytes.toString(data: Bytes): string
// base32
bytes.fromBase32(base32: string): Bytes
bytes.toBase32(data: Bytes): string
// base58 (xmr)
bytes.fromBase58(base58: string): Bytes
bytes.toBase58(data: Bytes): string
bytes.alphabetBase58(): string
// base64 (url-safe, no padding)
bytes.fromBase64(base64: string): Bytes
bytes.toBase64(data: Bytes): string
bytes.alphabetBase64(): string
// timestamps
bytes.fromTimestamp(date: Date): Bytes
bytes.toTimestamp(data: Bytes): Date
bytes.nowTimestamp(): Bytes
// objects (JSON)
bytes.fromObject(obj: object): Bytes
bytes.toObject(data: Bytes): object

// comparisons
bytes.xor(b1: Bytes, b2: Bytes): Bytes
bytes.hamming(b1: Bytes, b2: Bytes): number
bytes.isEqual(b1: Bytes, b2: Bytes): boolean
bytes.compare(b1: Bytes, b2: Bytes): Comparison // -1, 0, 1

// manipulation
bytes.concat(...data: Bytes[]): Bytes
bytes.chunk(data: Bytes, chunkSize: number): ChunkedBytes
bytes.unchunk(data: ChunkedBytes): Bytes

// misc
bytes.random(length: number): Bytes
bytes.ByteMap<V>: Map<Bytes, V> // a map that uses Bytes as keys, not recommended due to having to convert to strings

// Types
type Bytes = Uint8Array;
type EncryptedBytes = Uint8Array;
type DecryptedBytes = Uint8Array;
type HashedBytes = Uint8Array;
type SignedBytes = Uint8Array;
type ChunkedBytes = Uint8Array[];
type ByteLength = number; // the length of a Bytearray
enum ByteLengthOf {
	Uint8 = 1,
	Uint16 = 2,
	Uint32 = 4,
	Uint64 = 8,
}
```

### Krypto

_(named weirdly to avoid conflict with Node/browser crypto packages)_

#### Checksums

```javascript
import { krypto } from "kahn";

// Checksum - CRC32
krypto.Checksum.digest(data: Bytes): Checksum
krypto.Checksum({value: number}).verify(data: Bytes): boolean
```

#### Hashes

```javascript
import { krypto } from "kahn";

// FastHash - Blake3
krypto.FastHash.digest(data: Bytes): FastHash
krypto.FastHash({bytes: Bytes}).verify(data: Bytes): boolean

// SaltHash - Blake3
krypto.SaltHash.digest(data: Bytes, salt?: Salt): SaltHash
krypto.SaltHash({bytes: Bytes}).verify(data: Bytes): boolean

// SlowHash - Argon2 (always salted, has to be async because it's slow)
krypto.SlowHash.digestAsync(data: Bytes): Promise<SlowHash>
krypto.SlowHash({bytes: Bytes}).verifyAsync(data: Bytes): Promise<boolean>
```

#### Signatures

```javascript
import { krypto } from "kahn";

// Signatures
krypto.Signature.sign(data: Bytes, keyPair: KeyPair): Signature
krypto.Signature({bytes: Bytes}).verify(data: Bytes, publicKey: PublicKey): boolean
```

#### Keys

```javascript
import { krypto } from 'kahn'

// HKDF - sha256
// Key is extended by PublicKey, PrivateKey, and SharedKey
krypto.Key({bytes: Bytes}).derive(salt: Salt): SharedKey

// Public Key - curve25519
krypto.PublicKey({bytes: Bytes}): PublicKey

// Private Key - leave empty to generate a new private key
krypto.PrivateKey({bytes: Bytes}): PrivateKey
krypto.PrivateKey().toPublicKey()

// Keypair - leave empty to generate a new keypair
krypto.KeyPair({
  privateKey?: PrivateKey,
  privateKeyBytes?: Bytes
  })
// generate a keypair with a specific prefix in base32
krypto.Keypair.vanityAsync(prefix: string, timeout? Milliseconds): Promise<KeyPair>

// Signatures
krypto.Keypair().sign(data: Bytes): Signature // wraps Signature.sign
krypto.Keypair().sharedKey(publicKey: PublicKey, salt?: Salt): SharedKey

// Shared Key - Stream Cipher - ChaCha20
krypto.SharedKey({bytes: Bytes}).encrypt(data: Bytes): EncryptedBytes
krypto.SharedKey({bytes: Bytes}).decrypt(data: EncryptedBytes): Bytes
```

<!--
### Encoding and Decoding

Mostly the same as [lib0/encoding](https://www.npmjs.com/package/lib0) and [lib0/decoding](https://www.npmjs.com/package/lib0), but with an additional `repeated` function that allows for decoding sequences of the same type, similar to the `repeated` function in [protobufjs](https://www.npmjs.com/package/protobufjs).

```javascript
const randomBytes = [bytes.random(10), bytes.random(10), bytes.random(20)]

// Encode
import { encoding } from 'kahn'
const encoder = encoding.create()
encoding.repeated(encoding.writeBytes, encoder, randomBytes)
const serialized = encoding.toBytes(encoder)

// Decode
import { decoding } from 'kahn'
const decoder = decoding.create(serialized)
const decodedBytes = decoding.repeated(decoding.readBytes, decoder)
const deserialized = decoding.toBytes(decoder)

randomBytes === decodedBytes // true
```
-->

### Protobufs

This is mostly just a reexport of [protobufjs](https://www.npmjs.com/package/protobufjs) with a few extra functions.

```javascript
import { proto } from 'kahn'

// proto reexports from protobufjs/light
// it has the following aliases for decorators
proto.type // proto.Type.d
proto.field // proto.Field.d
proto.oneOf // proto.OneOf.d
proto.map // proto.MapField.d

// proto.Typed<T> is a shim for proto.Message<T>
// it adds the following serialization and deserialization functions:
//   - toBytes() and fromBytes() - Bytes
//   - toString() and fromString() - base32 string
proto.Typed<T>

// proto.versionedBytes is a base struct for bytes need to have a version number
// many krypto classes, such as keys, use this
proto.VersionedBytes({bytes: Bytes, version?: number})

// proto.Timestamp is a representation of google.protobuf.Timestamp
// it has the following serializion and deserializion functions:
proto.Timestamp.fromDate()
proto.Timestamp.fromNow()
proto.Timestamp().toDate()
```

### Iterating

Renamed iterator functions from [it](https://github.com/achingbrain/it).

```javascript
import { iterating } from 'kahn'

/* Create */

// Create an iterable that can be pushed to
iterating.Pushable(): Pushable<T>
/*
  const iter = iterating.Pushable().push(0)
*/

// Allows peeking at the next value
iterating.Peekable(iterable: Iterable<T>): AsyncIterable<T>
/*
  const nextValue = iterating.Peekable([0, 1, 2]).peek()
*/

// Allows recovering from errors
iterating.Recoverable(err => {
  // Called with no error when the iteration starts
  if (!err) {
    return myIterable
  } else {
    throw err // or return a new iterable
  }
})

// Emits events for each value
iterating.Emitter(iterable: AsyncIterable<any>)
/*
  const emitter = iterating.Emitter([0, 1, 2])
  emitter.on('value', (v) => console.log(v))
  emitter.on('end', () => console.log('done'))
  emitter.on('error', (err) => console.error(err))
  await emitter.cancel() // to end early
*/

// Unidirecctional duplex stream
iterating.Portal()
/*
  const [orange, blue] = iterating.portal()
  iterating.pipe(emitter, orange)
  iterating.pipe(blue, consumer)

*/

// Bidirectional duplex streams
iterating.Portals()
/*
  const [orange, blue] = iterating.portals()

  iterating.pipe(emitter, orange)
  iterating.pipe(blue, consumer)
  // and
  iterating.pipe(emitter, blue)
  iterating.pipe(orange, consumer)

*/

/* Actions */

// Collects all the values into an array
iterating.collect(iterable: Iterable<T>): Promise<T[]>

// Empties the iterable
iterating.drain(iterable: Iterable<T>): Promise<void>

// Returns the next value
iterating.first(iterable: Iterable<T>): Promise<T>

// Returns the last value
iterating.last(iterable: Iterable<T>): Promise<T>

// Takes the first n items from an iterable
iterating.take(iterable: Iterable<T>, n: number): AsyncIterable<T>

// Skip n items
iterating.skip(iterable: Iterable<T>, n: number): AsyncIterable<T>

// Merges multiple iterables into a single iterable
iterating.merge(...iterables: Iterable<T>[]): AsyncIterable<T>

// Empties and counts the number of items in an iterable
iterating.count(iterable: Iterable<T>): Promise<number>

/* Flow */

// Filters the passed iterable by the filter function
iterating.filter(iterable: Iterable<T>, filter: (value: T) => boolean): AsyncIterable<T>

// Maps the values by a function
iterating.map(iterable: Iterable<T>, map: (value: T) => U): AsyncIterable<U>

// Reduces the values by a function
iterating.reduce(
	iterable: Iterable<T>,
	reducer: (acc: U, curr: T, index: number) => U,
	initialValue: U
	): Promise<U>

// Sorts the values by a function
iterating.sort(iterable: Iterable<T>, sorter: (a: T, data: T) => number): AsyncIterable<T>

// Applies a function to each item in the iterable
iterating.apply(source: Iterable<T>,
	fn: (thing: T, index: number) => Promise<void>
): AsyncGenerator<T>

// Invokes each incoming function in parallel
// Batched jobs are always ordered and ignore concurrency
iterating.process(
	source: Iterable<() => Promise<T>> | AsyncIterable<() => Promise<T>>,
  options: {concurrency: 1, ordered: true, batchSize: 0}): AsyncIterable<T>

/* Pipes */

// Pipes (tees) the iterable into multiple sinks
iterating.pipe(source: Iterable<T>, ...sinks: Iterable<T>[]): AsyncIterable<T>

/* Batches */

// Split the values by a delimiter
iterating.split(iterable: Iterable<Uint8Array>, delimiter?: Uint8Array): AsyncIterable<Uint8Array>

// Batch values into chunks of a certain size
iterating.batch(iterable: Iterable<T>, size: number): AsyncIterable<T[]>
/*
  iterating.batch([0, 1, 2, 3, 4], 2) => [[0, 1], [2, 3], [4]]
*/

// Regularize values into chunks of a certain size
iterating.rebatch(iterable: Iterable<T[]>): AsyncIterable<T>
/*
  iterating.rebatch([[0, 1, 2], [3], [4]], 2) => [[0, 1], [2, 3], [4]]
*/

```

### Promising

Renamed promise functions from [sindresorhus](https://github.com/sindresorhus/) and [wbinnssmith](https://github.com/wbinnssmith/awesome-promises).

```javascript
import { promising } from 'kahn'

/* Create */

// Converts a callback function to a promise
promising.Callback(func: () => Promise<T>): Promise<T>

// Create a mutex
promising.Mutex()
/*
  const mutex = promising.Mutex();
  const sharedArray = [];
  async function addToSharedArray(item) {
    await mutex.withLock(async () => {
      const item = await getItem();
      sharedArray.push(item);
    });
  }
*/

// Memoize promise-returning & async functions
promising.Memoize(func: () => Promise<T>): () => Promise<T>

// create a promise that can be canceled
promising.Cancelable<T>(promise: Promise<T>): CancelablePromise<T>

// Create a lazy promise that defers execution until it's awaited
// or when .then() or .catch() is called
promising.Lazy<T>(func: () => Promise<T>): LazyPromise<T>

// Returns a promise resolved in the next event loop - think setImmediate()
promising.Immediately<T>(func: () => Promise<T>): Promise<T>

// Promise queue with concurrency control
promising.Queue<T>(concurrency: number): Queue<T>

// Wait for the next emission in the stream
promising.Listen<T>(stream: AsyncIterable<T>, event: string): Promise<T>
/*
  const result = await promising.Listen(emitter, 'finish');
*/

// Run multiple promise-returning & async functions with limited concurrency
promising.Limit<T>(concurrency: number, tasks: Function[]): Promise<T[]>
/*
const limit = promising.Limit(1);

const input = [
	limit(() => fetchSomething('foo')),
	limit(() => fetchSomething('bar')),
	limit(() => doSomething())
];

// Only one promise is run at once
const result = await Promise.all(input);
*/

// rate limit a promise
promising.Throttle<T>(func: () => Promise<T>, limit: number, interval: number): Promise<T>
/*
const throttle = promising.Throttle({
	limit: 2,
	interval: 1000
});
const throttled = throttle(async index => {...});
*/

/* Flow */

// Compose promise-returning & async functions into a reusable pipeline
promising.pipe(source: () => Promise<T>, ...sinks: Function[]): () => Promise<T>

// Run promise-returning & async functions in series, each passing its result to the next
promising.chain(tasks: Function[]): () => Promise<T>

// While a condition returns true, calls a function repeatedly, and then resolves the promise
promising.while(condition: () => boolean, func: () => Promise<T>): Promise<T>

// Run promise-returning & async functions until you end it with .end()
promising.forever(condition: () => boolean, func: () => Promise<T>): Promise<T>

// Start a promise chain without needing an initial promise
promising.then(func: () => Promise<T>): Promise<T>

// Run promise-returning & async functions in series
promising.serial(tasks: Function[]): Promise<T>

// Break out of a promise chain, returning a value
promising.break(value: any): Promise<T>
/*
  getData()
    .then(promising.break('done'))
    .catch(promising.break.end)
*/

// Conditional promise chains, for use inside .then()
promising.if(condition: () => boolean, func: () => Promise<T>): Promise<T>
/*
  getData()
    .then(promising.if(process.env.NODE_ENV !== 'production', addDebugInfo))
*/

// Tap into a promise chain without affecting its value or state
promising.peek(func: () => void): Promise<T>
/*
  getData()
    .then(promising.peek(console.log)) // logs the data
    .then(doSomething)
*/

// Log the value/error of a promise, shortcut for peek(console.log)
promising.log(): Promise<T>

// Check if a value is a promise
promising.isPromise(value: any): boolean

/* Mapping */

// Map over promises concurrently
promising.map<T>(iterable: Iterable<T>, func: (item: T) => Promise<T>, options: {concurrency: number}): Promise<T[]>
/*
  await promising.map(sites, mapper, {concurrency: 2});
*/

// Run multiple promises concurrently and keep track of the fulfilled values by name
promising.props(promises: { [key: string]: Promise<T> }): Promise<{ [key: string]: T }>

// Have a promise to fulfill no matter what
promising.anyways<T>(promise: Promise<T>, fallback: T): Promise<T>
/*
const promises = [...];
const results = await Promise.all(promises.map(promising.anyways));
*/

// Filter out values that don't satisfy a condition
promising.filter<T>(iterable: Iterable<T>, func: (item: T) => Promise<boolean>, options: {concurrency: number}): Promise<T[]>

// Reduce a list of values using promises into a promise for a value
promising.reduce<T, U>(iterable: Iterable<T>, func: (acc: U, item: T) => Promise<U>, initialValue: U): Promise<U>

// Create an array of the results of a list of promises
promising.list<T>(iterable: Iterable<Promise<T>>): Promise<T[]>
/*
const promises = [...]
console.log(await promising.collect(files));
*/

// Apply a function to each item in the iterable
promising.apply<T>(source: Iterable<T>, func: (item: T) => Promise<void>): Promise<void>

// Run promise-returning & async functions a specific number of times concurrently
promising.times<T>(count: number, func: () => Promise<T>): Promise<T[]>

/* Resolving */

// Wait for all promises to be resolved
promising.collect<T>(iterable: Iterable<Promise<T>>): Promise<T[]>

// get the first promise that resolves
promising.first<T>(iterable: Iterable<Promise<T>>): Promise<T>

// get the first n promises that resolve
promising.firstCount<T>(iterable: Iterable<Promise<T>>, n: number): Promise<T[]>

// Get the first fulfilled promise that satisfies the provided testing function
promising.firstMatch<T>(iterable: Iterable<Promise<T>>, func: (item: T) => boolean): Promise<T>

/* Timing */
// Retries a promise a number of times
promising.retry<T>(func: (attemptCount: number) => PromiseLike<T> | T, options?: Options): Promise<T>

// Wait for a promise to resolve, with a timeout
promising.wait(milliseconds: number): Promise<T>

// debounce a promise
promising.debounce<T>(func: () => Promise<T>, wait: number): Promise<T>

// timeout a promise
promising.timeout<T>(promise: Promise<T>, milliseconds: number): Promise<T>

// Wait for a condition to be true
promising.when(condition: () => boolean, options?: Options): Promise<void>

// Delay a promise a minimum amount of time
promising.delay<T>(promise: Promise<T>, milliseconds: number): Promise<T>

// Measure the time a promise takes to resolve
promising.time<T>(promise: Promise<T>): Promise<{ value: T, time: number }>k
```

### Constants

```javascript
// Bytes
export const B = 1
export const KB = 1024
export const MB = 1024 * KB
export const GB = 1024 * MB
export const TB = 1024 * GB
export const PB = 1024 * TB

// Time
export const NS = 1
export const MS = 1
export const SECONDS = 1000 * MS
export const MINUTES = 60 * SECONDS
export const HOURS = 60 * MINUTES
export const DAYS = 24 * HOURS
export const WEEKS = 7 * DAYS
export const YEARS = 365 * DAYS
```

### Types

```javascript
// Comparison
enum Comparison {
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1,
}
export enum Ternary {
  False = -1,
  Unknown = 0,
  True = 1,
}

// Time
export type Nanoseconds = number
export type Milliseconds = number
export type Seconds = number
export type Minutes = number
export type Hours = number
export type Days = number
export type Weeks = number
export type Years = number
```
