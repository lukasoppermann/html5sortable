/**
 * Convert HTML string into DOM element.
 * @param {Element|string} html
 * @param {string} tagname
 * @returns {Element}
 */
let makeElement = (html, tagName) => {
  if (typeof html !== 'string') {
    return html
  }
  var parentElement = document.createElement(tagName)
  parentElement.innerHTML = html
  return parentElement.firstChild
}

/**
 * Insert before target
 * @param {Element} target
 * @param {Element} element
 */
let insertBefore = (target, element) => {
  if (!target || target.nodeType !== 1 || !element || element.nodeType !== 1) {
    throw new Error('target and element must be a node')
  }

  target.parentElement.insertBefore(
    element,
    target
  )
}
/**
 * Insert after target
 * @param {Element} target
 * @param {Element} element
 */
let insertAfter = (target, element) => {
  target.parentElement.insertBefore(
    element,
    target.nextElementSibling
  )
}

export { makeElement, insertBefore, insertAfter }
