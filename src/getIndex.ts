/* eslint-env browser */
/**
 * Get position of the element relatively to its sibling elements
 * @param {HTMLElement} element
 * @returns {number}
 */
export default (element: HTMLElement, elementList: HTMLCollection | NodeList | Array<HTMLElement>): number => {
  if (!(element instanceof HTMLElement) || !(elementList instanceof NodeList || elementList instanceof HTMLCollection || elementList instanceof Array)) {
    throw new Error('You must provide an element and a list of elements.')
  }

  return Array.from(elementList).indexOf(element)
}
