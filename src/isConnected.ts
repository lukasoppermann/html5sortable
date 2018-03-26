import store from './store'
/**
 * Check if two lists are connected
 * @param {HTMLElement} curList
 * @param {HTMLElement} destList
 */
 function _isSortable (element) {
   return element !== undefined && element != null && typeof store(element).config !== 'object'
 }
export default (curList, destList) => {
  // check if valid sortable
  if (_isSortable(curList)) {
    const acceptFrom = store(curList).getConfig('acceptFrom')
    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
        return sel.length > 0 && destList.matches(sel)
      }).length > 0
    }
    if (curList === destList) {
      return true
    }
    if (store(curList).getConfig('connectWith') !== undefined && store(curList).getConfig('connectWith') !== null) {
      return store(curList).getConfig('connectWith') === store(destList).getConfig('connectWith')
    }
  }
  return false
}
