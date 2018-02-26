/**
 * @param {Element} element
 * @returns {{left: *, top: *}}
 */
export default (element) => {
  var rect = element.getClientRects()[0]
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  }
}
