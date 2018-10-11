/* eslint-env browser */
import { addData as _data } from './data' // yuk, data really needs to be refactored
import filter from './filter'
import index from './index'
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
  let options = _data(sortableContainer, 'opts')

  let item: string|undefined = options.items

  // serialize container
  let items = filter(sortableContainer.children, item)
  let serializedItems: serializedItem[] = items.map((item) => {
    return {
      parent: sortableContainer,
      node: item,
      html: item.outerHTML,
      index: index(item, items)
    }
  })
  // serialize container
  let container = {
    node: sortableContainer,
    itemCount: serializedItems.length
  }

  return {
    container: customContainerSerializer(container),
    items: serializedItems.map((item: object) => customItemSerializer(item, sortableContainer))
  }
}
