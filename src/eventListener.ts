import store from './store'
/**
 * @param {Array|HTMLElement} element
 * @param {Function} callback
 * @param {string} event
 */
function addEventListener (element: Array<HTMLElement>|HTMLElement, eventName:string, callback: () => void) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      addEventListener(element[i], eventName, callback)
    }
    return
  }
  element.addEventListener(eventName, callback)
  store(element).setData(`event${eventName}`, callback)
}
/**
 * @param {Array<HTMLElement>|HTMLElement} element
 * @param {string} eventName
 */
function removeEventListener (element: Array<HTMLElement>|HTMLElement, eventName: string) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      removeEventListener(element[i], eventName)
    }
    return
  }
  element.removeEventListener(eventName, store(element).getData(`event${eventName}`))
  delete store(element).deleteData(`event${eventName}`)
}

export { addEventListener, removeEventListener }
