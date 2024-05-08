/**
 * Mapping
 */

// Map over promises concurrently
// const result = await pMap(sites, mapper, {concurrency: 2});
import pMap from 'p-map'
export { pMap as map }

// Run multiple promises concurrently and keep track of the fulfilled values by name.
import pProps from 'p-props'
export { pProps as props }

//Useful when you want a promise to fulfill no matter what and would rather handle the actual state afterwards.
import pReflect from 'p-reflect'
export { pReflect as anyways }

// filter out values that don't satisfy a condition
import pFilter from 'p-filter'
export { pFilter as filter }

// Reduce a list of values using promises into a promise for a value
import pReduce from 'p-reduce'
export { pReduce as reduce }

// create an array of the results
import pSettle from 'p-settle'
export { pSettle as list }

// Iterate over promises serially
import pEachSeries from 'p-each-series'
export { pEachSeries as apply }

// Run promise-returning & async functions a specific number of times concurrently
import pTimes from 'p-times'
export { pTimes as times }
