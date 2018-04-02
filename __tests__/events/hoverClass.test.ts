/* global describe,test,expect,beforeEach,CustomEvent */
import sortable from '../../src/html5sortable'
import {mockInnerHTML} from '../helpers'

describe('Testing mouseenter and mouseleave events for hoverClass', () => {
  let ul, li
  // setup html
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.querySelector('.sortable')
    li = ul.querySelector('li')
  })

  test('should not add class on hover event', () => {
    // setup sortable with no hoverClass
    sortable(ul, {
      items: 'li',
      hoverClass: false
    })
    // get inital class list length
    let classListLength = li.classList.length
    // trigger mouseenter event
    li.dispatchEvent(new CustomEvent('mouseenter'))
    // assert that class list lenght did not change
    expect(li.classList.length).toBe(classListLength)
  })

  test('should correctly add class on hover event', () => {
    // setup sortable with hoverClass
    sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over'
    })
    // trigger mouseenter event
    li.dispatchEvent(new CustomEvent('mouseenter'))
    // assert that class was added
    expect(li.classList.contains('sortable-item-over')).toBe(true)
    // trigger mouseleave event
    li.dispatchEvent(new CustomEvent('mouseleave'))
    // assert that class was removed
    expect(li.classList.contains('sortable-item-over')).toBe(false)
  })

  test('should correctly add and remove both classes on hover event', () => {
    // setup sortable with multiple hoverClasses
    sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over sortable-item-over-second'
    })
    // trigger mouseenter event
    li.dispatchEvent(new CustomEvent('mouseenter'))
    // assert that class were added
    expect(li.classList.contains('sortable-item-over')).toBe(true)
    expect(li.classList.contains('sortable-item-over-second')).toBe(true)
    // trigger mouseleave event
    li.dispatchEvent(new CustomEvent('mouseleave'))
    // assert that class was removed
    expect(li.classList.contains('sortable-item-over')).toBe(false)
    expect(li.classList.contains('sortable-item-over-second')).toBe(false)
  })
})
