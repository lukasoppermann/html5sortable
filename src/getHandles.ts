/* eslint-env browser */
/**
 * get handle or return item
 * @param {Array<HTMLElement>} items
 * @param {string} selector
 */

export default (items: Array<HTMLElement>, selector: string): Array<HTMLElement> => {
  if (!(items instanceof Array)) {
    throw new Error('You must provide a Array of HTMLElements to be filtered.')
  }

  if (typeof selector !== 'string') {
    return items
  }

  return items
  // remove items without handle from array
    .filter((item: HTMLElement) => {
      return item.querySelector(selector) instanceof HTMLElement ||
        (item.shadowRoot && item.shadowRoot.querySelector(selector) instanceof HTMLElement)
    })
    // replace item with handle in array
    .map((item: HTMLElement) => {
      return item.querySelector(selector) || (item.shadowRoot && item.shadowRoot.querySelector(selector))
    })
}
