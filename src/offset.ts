/**
 * @param {Element} element
 * @returns {Object}
 */
export default (element: Element): object => {
  if (!element.parentElement) {
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
