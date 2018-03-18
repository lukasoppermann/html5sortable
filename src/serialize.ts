/* eslint-env browser */
import {addData as _data} from './data' // yuk, data really needs to be refactored
import filter from './filter'
import index from './index'
/**
 * Filter only wanted nodes
 * @param {Element} sortableContainer
 * @param {Function} customSerializer
 * @returns {Array}
 */

export default (sortableContainer: Element, customItemSerializer: Function = (serializedItem: object, sortableContainer: Element) => serializedItem, customContainerSerializer: Function = (serializedContainer: object) => serializedContainer): object => {
  // check for valid sortableContainer
  if (!(sortableContainer instanceof Element) || !sortableContainer.isSortable === true) {
    throw new Error('You need to provide a sortableContainer to be serialized.')
  }
  // check for valid serializers
  if (typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
    throw new Error('You need to provide a valid serializer for items and the container.')
  }
  // get options
  let options = _data(sortableContainer, 'opts')
  // serialize container
  let items: Element[] | Node[] = filter(sortableContainer.children, options.items)
  let mappedItems: Item[] = items.map((item: Item) => {
    if (item instanceof Element) {
      return {
        parent: sortableContainer,
        node: item,
        html: item.outerHTML,
        index: index(item, items)
      }
    }
  })
  // serialize container
  let container = {
    node: sortableContainer,
    itemCount: mappedItems.length
  }

  return {
    container: customContainerSerializer(container),
    items: mappedItems.map((item: object) => customItemSerializer(item, sortableContainer))
  }
}
