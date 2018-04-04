/* eslint-env browser */
import store from './store'
import _filter from './filter'
import _throttle from './throttle'
import { addEventListener as _on, removeEventListener as _off } from './eventListener'
/**
 * enable or disable hoverClass on mouseenter/leave if container Items
 * @param {sortable} sortableContainer a valid sortableContainer
 * @param {boolean} enable enable or disable event
 */
// export default (sortableContainer: sortable, enable: boolean) => {
export default (sortableContainer: sortable, enable: boolean) => {
  if (typeof store(sortableContainer).getConfig('hoverClass') === 'string') {
    let hoverClasses = store(sortableContainer).getConfig('hoverClass').split(' ')
    // add class on hover
    if (enable === true) {
      _on(sortableContainer, 'mousemove', _throttle((event) => {
        // check of no mouse button was pressed when mousemove started == no drag
        if (event.buttons === 0) {
          _filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
            if (item !== event.target) {
              item.classList.remove(...hoverClasses)
            } else {
              item.classList.add(...hoverClasses)
            }
          })
        }
      }, store(sortableContainer).getConfig('throttleTime')))
      // remove class on leave
      _on(sortableContainer, 'mouseleave', () => {
        _filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
          item.classList.remove(...hoverClasses)
        })
      })
    // remove events
    } else {
      _off(sortableContainer, 'mousemove')
      _off(sortableContainer, 'mouseleave')
    }
  }
}
