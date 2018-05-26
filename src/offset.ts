/**
 * @param {HTMLElement} element
 * @returns {Object}
 */
export default (element: HTMLElement): offsetObject => {
  if (!element.parentElement || element.getClientRects().length === 0) {
    throw new Error('target element must be part of the dom')
  }

  let rect = element.getClientRects()[0]
  return {
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY
  }
}
