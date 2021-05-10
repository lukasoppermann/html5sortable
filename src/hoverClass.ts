/* eslint-env browser */
import store from './store'
import filter from './filter'
import throttle from './throttle'
import { addEventListener, removeEventListener } from './eventListener'
/**
 * enable or disable hoverClass on mouseenter/leave if container Items
 * @param {sortable} sortableContainer a valid sortableContainer
 * @param {boolean} enable enable or disable event
 */
export default (sortableContainer: sortable, enable: boolean) => {
  if (typeof store(sortableContainer).getConfig('hoverClass') === 'string') {
    const hoverClasses = store(sortableContainer).getConfig('hoverClass').split(' ')
    // add class on hover
    if (enable === true) {
      addEventListener(sortableContainer, 'mousemove', throttle((event) => {
        // check of no mouse button was pressed when mousemove started == no drag
        if (event.buttons === 0) {
          filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
            if (item === event.target || item.contains(event.target)) {
              item.classList.add(...hoverClasses)
            } else {
              item.classList.remove(...hoverClasses)
            }
          })
        }
      }, store(sortableContainer).getConfig('throttleTime')))
      // remove class on leave
      addEventListener(sortableContainer, 'mouseleave', () => {
        filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
          item.classList.remove(...hoverClasses)
        })
      })
    // remove events
    } else {
      removeEventListener(sortableContainer, 'mousemove')
      removeEventListener(sortableContainer, 'mouseleave')
    }
  }
}
