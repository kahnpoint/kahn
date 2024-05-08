// Compose promise-returning & async functions into a reusable pipeline
import pPipe from 'p-pipe'
export { pPipe as pipe }

// Run promise-returning & async functions in series, each passing its result to the next
import pWaterfall from 'p-waterfall'
export { pWaterfall as chain }

// While a condition returns true, calls a function repeatedly, and then resolves the promise
import pWhilst from 'p-whilst'
export { pWhilst as while }

// Run promise-returning & async functions until you end it
import pForever from 'p-forever'
export { pForever as forever }

// start a promise chain
import pTry from 'p-try'
export { pTry as then }

// Run promise-returning & async functions in series
import pSeries from 'p-series'
export { pSeries as serial }

// Break out of a promise chain
import pBreak from 'p-break'
export { pBreak as break }

// Conditional promise chains
import pIf from 'p-if'
export { pIf as if }

// Tap into a promise chain without affecting its value or state
import pTap from 'p-tap'
export { pTap as peek }

// Log the value/error of a promise, shortcut for peek(console.log)
import pLog from 'p-log'
export { pLog as log }

// check if a value is a promise
import isPromise from 'p-is-promise'
export { isPromise }
