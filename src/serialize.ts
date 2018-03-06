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
  // @TODO: replace sortableContainer.isSortable with typeof Sortable as soon as sortable is changed to a class
  if ( !sortableContainer || sortableContainer.nodeType !== 1 || !sortableContainer.isSortable) {
    throw new Error('You need to provide a sortableContainer to be serialized.')
  }

  let options = _data(sortableContainer, 'opts')
  // serialize container
  let items = filter(sortableContainer.children, options.items).map((item) => {
    return {
      parent: sortableContainer
      node: item,
      html: item.outerHTML,
      index: index(item)
    }
  })
  // serialize container
  let container = {
    element: sortableContainer,
    itemCount: items.length
  }

  return {
    container: customContainerSerializer(container),
    items: items.map((item: object) => customContainerSerializer(item, sortableContainer))
  }
}
