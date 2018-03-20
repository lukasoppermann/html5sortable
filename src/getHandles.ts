/* eslint-env browser */
/**
 * get handle or return item
 * @param {NodeList|HTMLCollection|Array} items
 * @param {string} selector
 */
export default (items: HTMLCollection|NodeList|Array<HTMLElement>, selector: string): Array<HTMLElement> => {
  if (!(items instanceof NodeList || items instanceof HTMLCollection || items instanceof Array)) {
    throw new Error('You must provide a nodeList/HTMLCollection/Array of elements to be filtered.')
  }

  if (typeof selector !== 'string') {
    return Array.from(items)
  }

  return Array.from(items)
  // remove items without handle from array
    .filter((item) => {
      return item.querySelector(selector) instanceof HTMLElement
    })
    // replace item with handle in array
    .map((item) => {
      return item.querySelector(selector)
    })
}
