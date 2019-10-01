/**
 * @param {HTMLElement} element
 * @returns {Object}
 */
export default (element: HTMLElement): offsetObject => {
  if (!element.parentElement || element.getClientRects().length === 0) {
    throw new Error('target element must be part of the dom')
  }

  const rect = element.getClientRects()[0]
  return {
    left: rect.left + window.pageXOffset,
    right: rect.right + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    bottom: rect.bottom + window.pageYOffset
  }
}
