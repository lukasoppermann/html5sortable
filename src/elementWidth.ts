/* eslint-env browser */
/**
 * Get width of an element including padding
 * @param {HTMLElement} element an dom element
 */
export default (element: HTMLElement) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error('You must provide a valid dom element')
  }
  // get calculated style of element
  const style = window.getComputedStyle(element)
  // pick applicable properties, convert to int and reduce by adding
  return ['width', 'padding-left', 'padding-right']
    .map((key) => {
      const int = parseInt(style.getPropertyValue(key), 10)
      return isNaN(int) ? 0 : int
    })
    .reduce((sum, value) => sum + value)
}
