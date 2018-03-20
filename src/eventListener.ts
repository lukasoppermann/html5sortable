import store from './store'
/**
 * @param {Array|Element} element
 * @param {string} event
 * @param {Function} callback
 */

function addEventListener (element: Array<Element>|Element, event:string, callback: () => void) {
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
function removeEventListener (element: Element, event: string) {
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
