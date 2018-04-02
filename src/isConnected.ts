import store from './store'
/**
 * Check if curList accepts items from destList
 * @param {sortable} destination the container an item is move to
 * @param {sortable} origin the container an item comes from
 */
export default (destination: sortable, origin: sortable) => {
  // check if valid sortable
  if (destination.isSortable === true) {
    const acceptFrom = store(destination).getConfig('acceptFrom')
    // check if acceptFrom is valid
    if (acceptFrom !== null && acceptFrom !== false && typeof acceptFrom !== 'string') {
      throw new Error('HTML5Sortable: Wrong argument, "acceptFrom" must be "null", "false", or a valid selector string.')
    }

    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
        return sel.length > 0 && origin.matches(sel)
      }).length > 0
    }
    // drop in same list
    if (destination === origin) {
      return true
    }
    // check if lists are connected with connectWith
    if (store(destination).getConfig('connectWith') !== undefined && store(destination).getConfig('connectWith') !== null) {
      return store(destination).getConfig('connectWith') === store(origin).getConfig('connectWith')
    }
  }
  return false
}
