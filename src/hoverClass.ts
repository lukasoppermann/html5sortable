/* eslint-env browser */
import store from './store'
import filter from './filter'
import throttle from './throttle'
import { addEventListener as on, removeEventListener as off } from './eventListener'
/**
 * enable or disable hoverClass on mouseenter/leave if container Items
 * @param {sortable} sortableContainer a valid sortableContainer
 * @param {boolean} enable enable or disable event
 */
// export default (sortableContainer: sortable, enable: boolean) => {
export default (sortableContainer: sortable, enable: boolean) => {
  if (typeof store(sortableContainer).getConfig('hoverClass') === 'string') {
    const hoverClasses = store(sortableContainer).getConfig('hoverClass').split(' ')
    // add class on hover
    if (enable === true) {
      on(sortableContainer, 'mousemove', throttle((event) => {
        // check of no mouse button was pressed when mousemove started == no drag
        if (event.buttons === 0) {
          filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
            if (item !== event.target) {
              item.classList.remove(...hoverClasses)
            } else {
              item.classList.add(...hoverClasses)
            }
          })
        }
      }, store(sortableContainer).getConfig('throttleTime')))
      // remove class on leave
      on(sortableContainer, 'mouseleave', () => {
        filter(sortableContainer.children, store(sortableContainer).getConfig('items')).forEach(item => {
          item.classList.remove(...hoverClasses)
        })
      })
    // remove events
    } else {
      off(sortableContainer, 'mousemove')
      off(sortableContainer, 'mouseleave')
    }
  }
}
