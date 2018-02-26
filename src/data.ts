/**
 * Get or set data on element
 * @param {Element} element
 * @param {string} key
 * @param {*} value
 * @return {*}
 */
function addData (element, key, value) {
  if (value === undefined) {
    return element && element.h5s && element.h5s.data && element.h5s.data[key]
  } else {
    element.h5s = element.h5s || {}
    element.h5s.data = element.h5s.data || {}
    element.h5s.data[key] = value
  }
}
/**
 * Remove data from element
 * @param {Element} element
 */
function removeData (element) {
  if (element.h5s) {
    delete element.h5s.data
  }
}

export { addData, removeData }
