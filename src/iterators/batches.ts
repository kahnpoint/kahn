// Searches Uint8Arrays emitted by an (async)iterable for a delimiter and yields chunks split by that delimiter.
/*
const encoder = new TextEncoder()

// This can also be an iterator, generator, etc
const values = [
  encoder.encode('hello\nwor'),
  encoder.encode('ld')
]

const arr = all(split(values))

console.info(arr) // [encoder.encode('hello'), encoder.encode('world')]
*/
import split from "it-split";
export { split };

// Takes an async iterator that emits things and emits them as fixed size batches
/*
const values = [0, 1, 2, 3, 4]
const batchSize = 2

const result = all(batch(values, batchSize))

console.info(result) // [0, 1], [2, 3], [4]
*/
import batch from "it-batch";
export { batch };

// Takes an async iterator that emits byte arrays and emits them as fixed size batches
import batchBytes from "it-batched-bytes";
export { batchBytes };

// Takes an async iterator that emits variable length arrays and emits them as fixed size batches
/*
import batch from 'it-flat-batch'
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values = [[0, 1, 2], [3], [4]]
const batchSize = 2

const result = all(batch(values, batchSize))

console.info(result) // [0, 1], [2, 3], [4]
*/
import rebatch from "it-flat-batch";
export { rebatch };

// recursively flatten an async iterable
// it.flatten([1, [2, [3, 4], 5], 6]) -> 1, 2, 3, 4, 5, 6
export const flatten = async function* <T>(
  itr: AsyncIterable<T | AsyncIterable<T>>,
): AsyncGenerator<T, void, undefined> {
  for await (const item of itr) {
    if (Symbol.asyncIterator in Object(item)) {
      yield* flatten(item as AsyncIterable<T>);
    } else {
      yield item as T;
    }
  }
};

/**
 * Process incoming async(iterable) functions in parallel
 * Takes an async iterator that emits promise-returning functions, invokes them in parallel and emits the results in the same order as the input.
 * The final batch may be smaller than the batch size.
 * @param source - a list of functions to process
 * @param concurrency - number of operations to be done in parallel
 * @param ordered - if true, results will be returned in the order of input
 * @param batchSize - size of the batch to be processed
 * @returns an async generator that yields the results
 */
import parallel from "it-parallel";
import parallelBatch from "it-parallel-batch";
export type ProcessOptions = {
  concurrency: number;
  ordered: boolean;
  batchSize: number;
};
export const process = async function* (
  source: Iterable<() => Promise<T>> | AsyncIterable<() => Promise<T>>,
  options: ProcessOptions = { concurrency: 1, ordered: true, batchSize: 0 },
): AsyncGenerator<T, void, undefined> {
  if (options.batchSize > 0) {
    return yield parallelBatch(source, options.batchSize);
  } else {
    return yield parallel(source, {
      concurrency: options.concurrency,
      ordered: options.ordered,
    });
  }
};
