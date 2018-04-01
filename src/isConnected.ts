import store from './store'
/**
 * Check if two lists are connected
 * @param {HTMLElement} curList
 * @param {HTMLElement} destList
 */
export default (curList: sortable, destList: sortable) => {
  // check if valid sortable
  if (curList.isSortable === true) {
    const acceptFrom = store(curList).getConfig('acceptFrom')

    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
        return sel.length > 0 && destList.matches(sel)
      }).length > 0
    }
    // drop in same list
    if (curList === destList) {
      return true
    }
    // check if lists are connected with connectWith
    if (store(curList).getConfig('connectWith') !== undefined && store(curList).getConfig('connectWith') !== null) {
      return store(curList).getConfig('connectWith') === store(destList).getConfig('connectWith')
    }
  }
  return false
}
