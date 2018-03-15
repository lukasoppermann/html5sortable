/* eslint-env browser */
/**
 * get handle or return item
 * @param {NodeList|HTMLCollection|Arra} items
 * @param {string} selector
 */
export default (items: NodeList|HTMLCollection|Array, selector: string): Array<Element> => {
  if (!(items instanceof NodeList || items instanceof HTMLCollection || items instanceof Array)) {
    throw new Error('You must provide a nodeList/HTMLCollection/Array of elements to be filtered.')
  }

  if (typeof selector !== 'string') {
    return items
  }

  return Array.from(items)
  // remove items without handle from array
    .filter((item) => {
      return item.querySelector(selector) instanceof Element
    })
    // replace item with handle in array
    .map((item) => {
      return item.querySelector(selector)
    })
}
