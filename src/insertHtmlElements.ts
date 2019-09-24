/* eslint-env browser */
/**
 * Insert node before or after target
 * @param {HTMLElement} referenceNode - reference element
 * @param {HTMLElement} newElement - element to be inserted
 * @param {String} position - insert before or after reference element
 */
const insertNode = (referenceNode: HTMLElement, newElement: HTMLElement, position: String) => {
  if (!(referenceNode instanceof HTMLElement) || !(referenceNode.parentElement instanceof HTMLElement)) {
    throw new Error('target and element must be a node')
  }
  referenceNode.parentElement.insertBefore(
    newElement,
    (position === 'before' ? referenceNode : referenceNode.nextElementSibling)
  )
}
/**
 * Insert before target
 * @param {HTMLElement} target
 * @param {HTMLElement} element
 */
const insertBefore = (target: HTMLElement, element: HTMLElement) => insertNode(target, element, 'before')
/**
 * Insert after target
 * @param {HTMLElement} target
 * @param {HTMLElement} element
 */
const insertAfter = (target: HTMLElement, element: HTMLElement) => insertNode(target, element, 'after')

export { insertBefore, insertAfter }
