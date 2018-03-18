export interface offsetObject { // eslint-disable-line no-undef
  'left': number,
  'right': number,
  'top': number,
  'bottom': number
}
/**
 * @param {Element} element
 * @returns {Object}
 */
export default (element: Element): offsetObject => {
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
