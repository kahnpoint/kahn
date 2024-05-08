// Promisify a callback-style function
// const data = await pify(fs.readFile)('package.json', 'utf8');
import pify from 'pify'
export { pify as Callback }

/*

const mutex = new Mutex();

const sharedArray = [];

async function addToSharedArray(item) {
	await mutex.withLock(async () => {
		const item = await getItem();
		sharedArray.push(item);
	});
}

addToSharedArray('A');
addToSharedArray('B');
*/
import Mutex from 'p-mutex'
export { Mutex as Mutex }

// Memoize promise-returning & async functions
import pMemoize from 'p-memoize'
export { pMemoize as Memoize }

// create a promise that can be canceled
import PCancelable from 'p-cancelable'
export { PCancelable as Cancelable }

// Create a promise that reports progress
import pProgress from 'p-progress'
export { pProgress as Progess }

// Create a lazy promise that defers execution until it's awaited or when .then() or .catch() is called
import pLazy from 'p-lazy'
export { pLazy as Lazy }

// Returns a promise resolved in the next event loop - think setImmediate()
import pImmediate from 'p-immediate'
export { pImmediate as Immediately }

// Promise queue with concurrency control
import pQueue from 'p-queue'
export { pQueue as Queue }

// wait for the next emission in the stream
import { pEvent } from 'p-event'
export { pEvent as Event }

// Run multiple promise-returning & async functions with limited concurrency
import pLimit from 'p-limit'
export { pLimit as Limit }
