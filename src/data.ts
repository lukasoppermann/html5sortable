/* eslint-env */
/**
 * Get or set data on element
 * @param {CustomElement} element
 * @param {string} key
 * @param {*} value
 * @return {*}
 */
function addData (element, key: string, value?: any) {
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
 * @param {CustomElement} element
 */
function removeData (element) {
  if (element.h5s) {
    delete element.h5s.data
  }
}

export { addData, removeData }
