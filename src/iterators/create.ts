// creates a pushable async iterator
/*
const source = pushable()
source.push('hello')
source.end()
*/
import { pushable } from "it-pushable";
export { pushable as Pushable };

// Lets you look at the contents of an async iterator and decide what to do
/*
const values = [0, 1, 2, 3, 4]
const it = toPeekable(values)
const first = it.peek()
*/
import peekable from "it-peekable";
export { peekable as Peekable };

/*
const source = recoverable(err => {
  // Called with no error when the iteration starts
  if (!err) {
    // For this example, return the failing iterable initially
    return failingIterable
  } else {
    // Determine if the error is fatal...
    // ...if fatal then throw it...
    // if not, then recreate and return it - note this function can be async
    // and return a promise for delay and backoff if needed.
    return iterable
  }
})
*/
import recoverable from "recoverable-iterator";
export { recoverable as Recoverable };

export {
  abortableSource,
  abortableSink,
  abortableTransform,
  abortableDuplex,
} from "abortable-iterator";

/*
const emitter = it.emitter(asyncIterator)

// emitted for every value in the iterator
emitter.on(it.Value, v => console.log('got value', v))

// emitted only once if the iterator throws
emitter.on(it.Error, err => console.error('error in iterator', err))

// always emitted on end, even after error or cancel
emitter.on(it.End, () => console.log('iterator finished'))

// cancel the iteration AFTER the next value is emitted
await emitter.cancel()
*/

enum EmitterEvent {
  Value = "value",
  Error = "error",
  End = "end",
}

type EmitterEventEmitter = EventEmitter<{
  [EmitterEvent.Value]: [any];
  [EmitterEvent.Error]: [Error];
  [EmitterEvent.End]: [];
}>;

import Emitterator from "emitterator";
import { EventEmitter } from "events";

export const Emitter = (source: AsyncIterable<any>): EmitterEventEmitter =>
  new Emitterator(source);

// One linked async iterator
import { pair } from "it-pair";
export function Portal() {
  const p = pair();
  return p.sink, p.source;
}

// Two linked async iterators
import { duplexPair as Portals } from "it-pair/duplex";
export { Portals };
