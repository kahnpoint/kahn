# Kahn

My current collection of Typescript utility functions.
Some of these will be stripped out as I find what functions I use the most.
*In the future I plan to make the exports more modular, like how lodash has `lodash/` for individual functions.*

## Categories
- [Reexports](#reexports)
- [Bytes](#bytes)
- [Crypto](#krypto)
- [Encoding and Decoding](#encoding-and-decoding)
- [Iterating](#iterating)
- [Constants](#constants)
- [Types](#types)

## Packages

### Reexports

```javascript
import { _ } from "kahn"; // lodash
import { id } from "kahn"; // nanoid
import { cache } from "kahn"; // lib0/cache
import { ky } from "kahn"; // ky
```

### Bytes

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
bytes.xor(b1: Bytes, b2: Bytes): Bytes
bytes.hamming(b1: Bytes, b2: Bytes): number
bytes.equal(b1: Bytes, b2: Bytes): boolean
bytes.compare(b1: Bytes, b2: Bytes): Comparison // -1, 0, 1

// manipulation
bytes.concat(...b: Bytes[]): Bytes
bytes.chunk(b: Bytes, chunkSize: number): ChunkedBytes
bytes.unchunk(b: ChunkedBytes): Bytes

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

Keys are Base58 strings. Even though they need to be converted to Bytes for use in the cryptographic functions from [@noble/curves](https://www.npmjs.com/package/@noble/curves), they are stored as strings to be able to be used as keys in objects. _If it becomes a performance issue, I will give the Keypair objects cached Bytes fields._

```javascript
import { krypto } from "kahn";

// Hash - SHA256
krypto.createHash(b: Bytes): Hash
krypto.verifyHash(b: Bytes, hash: Hash): boolean

// Checksum - CRC32
krypto.createChecksum(b: Bytes): Checksum
krypto.verifyChecksum(b: Bytes, checksum: Checksum): boolean

// Symmetric Encryption - ChaCha20
krypto.encrypt(sharedKey: SharedKey, b: Bytes): EncryptedBytes
krypto.decrypt(sharedKey: SharedKey, b: Bytes): DecryptedBytes

// Asymmetric Encryption - ed25519
krypto.createKeyPair(privateKey?: PrivateKey): KeyPair
krypto.verifyKeyPair(keyPair: KeyPair): boolean

krypto.createSignature(privateKey: PrivateKey, b: Bytes): Signature
krypto.verifySignature(publicKey: PublicKey, b: Bytes, signature: Signature): boolean

// Key Exchange - x25519
krypto.createSharedKey(privateKey: PrivateKey, publicKey: PublicKey): SharedKey
krypto.verifySharedKey(privateKey: PrivateKey, publicKey: PublicKey, sharedKey: SharedKey): boolean

// Types
type Hash = string;
type Signature = string;
type Checksum = number;
type AnyKey = string;
type PublicKey = AnyKey;
type PrivateKey = AnyKey;
type SharedKey = AnyKey;
type PublicKeyBytes = Bytes;
type PrivateKeyBytes = Bytes;
type SharedKeyBytes = Bytes;
type KeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};
type JoinedKeyPair = `${PublicKey}:${PrivateKey}`;
```

### Encoding and Decoding

Mostly the same as [lib0/encoding](https://www.npmjs.com/package/lib0) and  [lib0/decoding](https://www.npmjs.com/package/lib0), but with an additional `repeated` function that allows for decoding sequences of the same type, similar to the `repeated` function in [protobufjs](https://www.npmjs.com/package/protobufjs).

```javascript
const randomBytes = [bytes.random(10), bytes.random(10), bytes.random(20)];

// Encode
import { encoding } from "kahn";
const encoder = encoding.create();
encoding.repeated(encoding.writeBytes, encoder, randomBytes);
const serialized = encoding.toBytes(encoder);

// Decode
import { decoding } from "kahn";
const decoder = decoding.create(serialized);
const decodedBytes = decoding.repeated(decoding.readBytes, decoder);
const deserialized = decoding.toBytes(decoder);

randomBytes === decodedBytes; // true
```

### Iterating

Renamed iterator functions from [it](https://github.com/achingbrain/it).

```javascript
import {iterating} from 'kahn'

/* Create */

// Create an iterable that can be pushed to
//const iter = iterating.pushable().push(0)
iterating.Pushable(): Pushable<T>

// allow for peeking at the next value
// const nextValue = iterating.peekable([0, 1, 2]).peek()
iterating.Peekable(iterable: Iterable<T>): AsyncIterable<T>

// allow for recovering from errors
iterating.Recoverable(err => {
  // Called with no error when the iteration starts
  if (!err) {
    return myIterable
  } else {
    throw err // or return a new iterable
  }
})

// emits events for each value
iterating.Emitter(iterable: AsyncIterable<any>)
// emitter.on('value', (v) => console.log(v))
// emitter.on('end', () => console.log('done'))
// emitter.on('error', (err) => console.error(err))
// await emitter.cancel() // to end early

// Unidirecctional duplex stream
// const [sink, source] = iterating.portal()
iterating.Portal()

// Bidirectional duplex streams
// const [orange, blue] = iterating.portals()
iterating.Portals()

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
iterating.sort(iterable: Iterable<T>, sorter: (a: T, b: T) => number): AsyncIterable<T>

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
// iterating.batch([0, 1, 2, 3, 4], 2) => [[0, 1], [2, 3], [4]]
iterating.batch(iterable: Iterable<T>, size: number): AsyncIterable<T[]>

// Regularize values into chunks of a certain size
// iterating.rebatch([[0, 1, 2], [3], [4]], 2) => [[0, 1], [2, 3], [4]]
iterating.rebatch(iterable: Iterable<T[]>): AsyncIterable<T>
```

### Constants

```javascript
export const B = 1;
export const KB = 1024;
export const MB = 1024 * KB;
export const GB = 1024 * MB;
export const TB = 1024 * GB;
export const PB = 1024 * TB;
```

### Types

```javascript
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
```
