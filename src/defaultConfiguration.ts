/**
 * default configurations
 */
export default {
  items: null,
  // deprecated
  connectWith: null,
  // deprecated
  disableIEFix: null,
  acceptFrom: null,
  copy: false,
  placeholder: null,
  placeholderClass: 'sortable-placeholder',
  draggingClass: 'sortable-dragging',
  hoverClass: false,
  debounce: 0,
  throttleTime: 100,
  maxItems: 0,
  itemSerializer: undefined,
  containerSerializer: undefined,
  customDragImage: null,
  /*
  * Checks if the dragging element is allowed to be dropped
  * in sortableElement. If false is returned, it acts as if
  * the sortableElement did not have a dropzone.
  * @param: {Element} dragging
  * @param: {Element} sortableElement
  */
  isValidTarget: function (dragging, sortableElement) { return true }
}
