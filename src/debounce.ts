/**
 * Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed
 * @param {fn} Function to debounce
 * @param {delay} time to wait before calling function with latest arguments, 0 - no debounce
 * @param {context} time to wait before calling function with latest arguments, 0 - no debounce
 * @returns {function} - debounced function
 */
export default (func, wait) => {
  let timeout;

  if (wait === 0) {
    return func
  }

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
