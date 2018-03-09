/* eslint-env browser */
/**
 * Get position of the element relatively to its sibling elements
 * @param {Element} element
 * @returns {number}
 */
export default (element: Element, elementList: HTMLCollection | NodeList | Array): number => {
  if (!(element instanceof Element) || !(elementList instanceof NodeList || elementList instanceof HTMLCollection || elementList instanceof Array)) {
    throw new Error('You must provide an element and a list of elements.')
  }

  return Array.from(elementList).indexOf(element)
}
