import store from './store'
/**
 * @param {Array|Element} element
 * @param {Array|string} event
 * @param {Function} callback
 */
function addEventListener (element, event, callback) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      addEventListener(element[i], event, callback)
    }
    return
  }
  element.addEventListener(event, callback)
  store(element).setData(`event${event}`, callback)
}
/**
 * @param {Array|Element} element
 * @param {Array|string} event
 */
function removeEventListener (element, event) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      removeEventListener(element[i], event)
    }
    return
  }
  element.removeEventListener(event, store(element).getData(`event${event}`))
  delete store(element).deleteData(`event${event}`)
}

export { addEventListener, removeEventListener }
