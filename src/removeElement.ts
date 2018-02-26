/**
 * Detach element from DOM
 * @param {Element} element
 */
export default (element) => {
  if (element.parentNode) {
    element.parentNode.removeChild(element)
  }
}
