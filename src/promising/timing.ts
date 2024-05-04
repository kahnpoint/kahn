/**
 * Timing
 */

// Retries a promise a number of times
import pRetry from "p-retry";
export { pRetry as retry };

// Wait for a promise to resolve, with a timeout
import delay from "delay";
export { delay as wait };

// debounce a promise
import pDebounce from "p-debounce";
export { pDebounce as debounce };

// rate limit a promise
import pThrottle from "p-throttle";
export { pThrottle as throttle };

// timeout a promise
import pTimeout from "p-timeout";
export { pTimeout as timeout };

// Wait for a condition to be true
import pWaitFor from "p-wait-for";
export { pWaitFor as when };

// Delay a promise a minimum amount of time
import pDelay from "p-min-delay";
export { pDelay as delay };

// Measure the time a promise takes to resolve
import pTime from "p-time";
export { pTime as time };
