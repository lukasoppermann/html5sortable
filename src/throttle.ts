/**
 * make sure a function is only called once within the given amount of time
 * @param {Function} fn the function to throttle
 * @param {number} threshold time limit for throttling
 */
// must use function to keep this context
export default function (fn: Function, threshold: number = 250) {
  // check function
  if (typeof fn !== 'function') {
    throw new Error('You must provide a function as the first argument for throttle.')
  }
  // check threshold
  if (typeof threshold !== 'number') {
    throw new Error('You must provide a number as the second argument for throttle.')
  }

  let lastEventTimestamp = null

  return (...args) => {
    const now = Date.now()
    if (lastEventTimestamp === null || now - lastEventTimestamp >= threshold) {
      lastEventTimestamp = now
      fn.apply(this, args)
    }
  }
}
