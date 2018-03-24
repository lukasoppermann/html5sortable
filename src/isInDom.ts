/* eslint-env browser */
/**
 * Test whether element is in DOM
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default (element: HTMLElement): boolean => {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Element is not a node element.')
  }

  return element.parentNode !== null
}
