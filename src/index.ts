/* eslint-env browser */
/**
 * Get position of the element relatively to its sibling elements
 * @param {Element} element
 * @returns {number}
 */
export default (element: Element, elementList: HTMLCollection | NodeList): number => {
  if (!(element instanceof Element) || !(elementList instanceof NodeList || elementList instanceof HTMLCollection)) {
    throw new Error('You must provide an element and a list of elements.')
  }

  return Array.prototype.indexOf.call(elementList, element)
}
