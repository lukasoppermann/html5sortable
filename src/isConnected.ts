/**
 * Check if two lists are connected
 * @param {HTMLElement} curList
 * @param {HTMLElement} destList
 */
export default (curList, destList) => {
  // check if valid sortable
  if (_isSortable(curList)) {
    const acceptFrom = _data(curList, 'opts').acceptFrom
    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(',').filter(function (sel) {
        return sel.length > 0 && destList.matches(sel)
      }).length > 0
    }
    if (curList === destList) {
      return true
    }
    if (_data(curList, 'connectWith') !== undefined) {
      return _data(curList, 'connectWith') === _data(destList, 'connectWith')
    }
  }
  return false
}
