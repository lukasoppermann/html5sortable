/**
 * Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed
 * @param {func} Function to debounce
 * @param {wait} time to wait before calling function with latest arguments, 0 - no debounce
 * @returns {function} - debounced function
 */
export default (func, wait = 0) => {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
