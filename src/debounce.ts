/**
 * Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed
 * @param {Function} func to debounce
 * @param {number} time to wait before calling function with latest arguments, 0 - no debounce
 * @returns {function} - debounced function
 */
export default (func: Function, wait: number = 0): Function => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
