/**
 * @param {Array|elem} element
 * @param {string} attribute
 * @param {*} value
 */
function addAttribute (element: Array<Element>|Element, attribute:string, value:string) {
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
function removeAttribute (element: Array<Element>|Element, attribute:string) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      removeAttribute(element[i], attribute)
    }
    return
  }
  element.removeAttribute(attribute)
}

export { addAttribute, removeAttribute }
