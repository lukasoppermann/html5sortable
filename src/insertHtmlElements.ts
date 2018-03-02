/**
 * Insert before target
 * @param {Element} target
 * @param {Element} element
 */
let insertBefore = (target, element) => {
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
