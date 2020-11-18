/**
 * @param {Array<HTMLElement>|HTMLElement} element
 * @param {string} attribute
 * @param {string} value
 */
function addAttribute (element: Array<HTMLElement>|HTMLElement, attribute:string, value:string) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      addAttribute(element[i], attribute, value)
    }
    return
  }
  element.setAttribute(attribute, value)
}
/**
 * @param {Array|HTMLElement} element
 * @param {string} attribute
 */
function removeAttribute (element: Array<HTMLElement>|HTMLElement, attribute:string) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      removeAttribute(element[i], attribute)
    }
    return
  }
  element.removeAttribute(attribute)
}

export { addAttribute, removeAttribute }
