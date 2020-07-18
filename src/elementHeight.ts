/* eslint-env browser */
/**
 * Get height of an element including padding
 * @param {HTMLElement} element an dom element
 */
export default (element: HTMLElement) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error('You must provide a valid dom element')
  }
  // get calculated style of element
  const style = window.getComputedStyle(element)
  // get only height if element has box-sizing: border-box specified
  if (style.getPropertyValue('box-sizing') === 'border-box') {
    return parseInt(style.getPropertyValue('height'), 10)
  }
  // pick applicable properties, convert to int and reduce by adding
  return ['height', 'padding-top', 'padding-bottom']
    .map((key) => {
      const int = parseInt(style.getPropertyValue(key), 10)
      return isNaN(int) ? 0 : int
    })
    .reduce((sum, value) => sum + value)
}
