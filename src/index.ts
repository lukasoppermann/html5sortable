/**
 * Get position of the element relatively to its sibling elements
 * @param {Element} element
 * @returns {number}
 */
export default (element) => {
  if (!element.parentElement) {
    return -1
  }
  return Array.prototype.indexOf.call(element.parentElement.children, element)
}
