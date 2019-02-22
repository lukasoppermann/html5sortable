/**
 * @param {Event} event
 * @returns {HTMLElement}
 */
export default (event: Event): HTMLElement => {
  return (event.composedPath && event.composedPath()[0]) || event.target
}
