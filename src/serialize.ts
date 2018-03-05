import {addData as _data} from './data' // yuk, data really needs to be refactored
import _filter from './filter'
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
  // serialize container
  let items = [{
    parent: Element
  }]
  // get the items in this sortable
  let sortableItems = _filter(sortableContainer.children, _data(sortableContainer, 'items'))
  // serialize container
  let container = {
    element: Element,
    itemCount: items.length
  }

  return {
    container: customContainerSerializer(container),
    items: items.map((item: object) => customContainerSerializer(item, sortableContainer))
  }
}
