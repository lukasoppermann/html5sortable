/**
 * @param {Array|Element} element
 * @param {string} attribute
 * @param {*} value
 */
function addAttribute (element, attribute, value) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      addAttribute(element[i], attribute, value)
    }
    return
  }
  element.setAttribute(attribute, value)
}
/**
 * @param {Array|Element} element
 * @param {string} attribute
 */
function removeAttribute (element, attribute) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      removeAttribute(element[i], attribute)
    }
    return
  }
  element.removeAttribute(attribute)
}

export { addAttribute, removeAttribute }
