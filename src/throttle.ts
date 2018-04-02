/**
 * make sure a function is only called once within the given amount of time
 * @param {Function} fn the function to throttle
 * @param {number} threshold time limit for throttling
 */
// must use function to keep this context
export default function (fn: Function, threshold: number = 250) {
  let lastEventTimestamp = null

  return (...args) => {
    let now = Date.now()
    if (lastEventTimestamp === null || now - lastEventTimestamp >= threshold) {
      lastEventTimestamp = now
      fn.apply(this, args)
    }
  }
}
