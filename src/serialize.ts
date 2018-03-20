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

  // Type guard to check if opts key/value was recieved
  function isOpts (object: any): object is opts {
    return 'items' in object
  }

  let item: string|undefined
  if (isOpts(options)) {
    item = options.items
  }

  // serialize container
  let items = filter(sortableContainer.children, item)
  let serializedItems: serializedItems[] = items.map((item) => {
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
