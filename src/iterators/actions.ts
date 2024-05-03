// Collects all values from an (async) iterable and returns them as an array
import collect from "it-all";
export { collect };

// Empties an async iterator
import drain from "it-drain";
export { drain };

// Filters the passed iterable by the filter function
import filter from "it-filter";
export { filter };

// Returns the next result from an async iterator
import first from "it-first";
export { first };

// Maps the values yielded by an async iterator
import map from "it-map";
export { map };

// Merges multiple async iterators into a single async iterator
import merge from "it-merge";
export { merge };

// Reduces the values yielded from an async iterator
/*
const values = [0, 1, 2, 3, 4]

const result = reduce(values, (acc, curr, index) => acc + curr, 0)
*/
import reduce from "it-reduce";
export { reduce };

// Skip items from an iterable
/*
const values = [0, 1, 2, 3, 4]

const arr = all(skip(values, 2))
*/
import skip from "it-skip";
export { skip };

//Consumes all values from an (async)iterable and returns them sorted by the passed sort function.
/*
const sorter = (a, b) => {
  return a.localeCompare(b)
}

// This can also be an iterator, generator, etc
const values = ['foo', 'bar']

const arr = all(sort(values, sorter))
*/
import sort from "it-sort";
export { sort };

//Returns the last result from an async iterator
import last from "it-last";
export { last };

// Counts the number of items in an async iterable
import length from "it-length";
export { length as count };

// Invokes the passed function for each item in an iterable
import forEach from "it-foreach";
export { forEach as apply };

// Takes the first n items from an async iterator
/*
import take from 'it-take'
import all from 'it-all'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = all(take(values, 2))

console.info(arr) // 0, 1
*/
import take from "it-take";
export { take };

// tees an async iterator into two or more identical iterators
import { pipe } from "it-pipe";
export { pipe };

import { pair as push } from "it-pair";
export { push };

import { duplexPair as portals } from "it-pair/duplex";
export { portals };
