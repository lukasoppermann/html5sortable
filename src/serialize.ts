/* eslint-env browser */
import { addData } from './data' // yuk, data really needs to be refactored
import filter from './filter'
import getIndex from './getIndex'
/**
 * Filter only wanted nodes
 * @param {HTMLElement} sortableContainer
 * @param {Function} customSerializer
 * @returns {Array}
 */
export default (sortableContainer: HTMLElement, customItemSerializer: Function = (serializedItem: serializedItem, sortableContainer: HTMLElement) => serializedItem, customContainerSerializer: Function = (serializedContainer: object) => serializedContainer): object => {
  // check for valid sortableContainer
  if (!(sortableContainer instanceof HTMLElement) || !sortableContainer.isSortable === true) {
    throw new Error('You need to provide a sortableContainer to be serialized.')
  }
  // check for valid serializers
  if (typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
    throw new Error('You need to provide a valid serializer for items and the container.')
  }
  // get options
  const options = addData(sortableContainer, 'opts')

  const item: string|undefined = options.items

  // serialize container
  const items = filter(sortableContainer.children, item)
  const serializedItems: serializedItem[] = items.map((item) => {
    return {
      parent: sortableContainer,
      node: item,
      html: item.outerHTML,
      index: getIndex(item, items)
    }
  })
  // serialize container
  const container = {
    node: sortableContainer,
    itemCount: serializedItems.length
  }

  return {
    container: customContainerSerializer(container),
    items: serializedItems.map((item: object) => customItemSerializer(item, sortableContainer))
  }
}
