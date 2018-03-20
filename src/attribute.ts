/* eslint-env */

/**
 * @param {Array|Element} element
 * @param {string} attribute
 * @param {string} value
 */
function addAttribute (element: Element, attribute: string, value?: string) {
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
function removeAttribute (element: Element, attribute: string) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      removeAttribute(element[i], attribute)
    }
    return
  }
  element.removeAttribute(attribute)
}

export { addAttribute, removeAttribute }
