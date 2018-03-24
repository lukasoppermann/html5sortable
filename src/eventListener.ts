import store from './store'
/**
 * @param {Array|HTMLElement} element
 * @param {Function} callback
 * @param {string} event
 */

function addEventListener (element: Array<HTMLElement>|HTMLElement, event:string, callback: () => void) {
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
 * @param {Array<HTMLElement>|HTMLElement} element
 * @param {Array<HTMLElement>|string} event
 */
function removeEventListener (element: HTMLElement, event: string) {
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
