/* eslint-env browser */
/**
 * create a placeholder element
 * @param {HTMLElement} sortableElement a single sortable
 * @param {string|undefined} placeholder a string representing an html element
 * @param {string} placeholderClasses a string representing the classes that should be added to the placeholder
 */
export default (sortableElement: HTMLElement, placeholder?: HTMLElement, placeholderClass: string = 'sortable-placeholder') => {
  if (!(sortableElement instanceof HTMLElement)) {
    throw new Error('You must provide a valid element as a sortable.')
  }
  // if placeholder is not an element
  if (!(placeholder instanceof HTMLElement) && placeholder !== undefined) {
    throw new Error('You must provide a valid element as a placeholder or set ot to undefined.')
  }
  // if no placeholder element is given
  if (placeholder === undefined) {
    if (['UL', 'OL'].includes(sortableElement.tagName)) {
      placeholder = document.createElement('li')
    } else if (['TABLE', 'TBODY'].includes(sortableElement.tagName)) {
      placeholder = document.createElement('tr')
      // set colspan to always all rows, otherwise the item can only be dropped in first column
      placeholder.innerHTML = '<td colspan="100"></td>'
    } else {
      placeholder = document.createElement('div')
    }
  }
  // add classes to placeholder
  if (typeof placeholderClass === 'string') {
    placeholder.classList.add(...placeholderClass.split(' '))
  }

  return placeholder
}
