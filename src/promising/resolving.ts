/**
 * Resolving
 */

// Wait for all promises to be resolved
import pAll from 'p-all'
export { pAll as collect }

// get the first promise that resolves
import pAny from 'p-any'
export { pAny as first }

// get the first n promises that resolve
import pSome from 'p-some'
export { pSome as firstCount }

// Get the first fulfilled promise that satisfies the provided testing function
import pLocate from 'p-locate'
export { pLocate as firstMatch }
