/**
 * Insert before target
 * @param {Element} target
 * @param {Element} element
 */
let insertBefore = (target, element) => {
  if ((target || {}).nodeType !== 1 || (element || {}).nodeType !== 1) {
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

export { insertBefore, insertAfter }
