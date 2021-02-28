/* global describe,test,expect */
import { mockInnerHTML } from '../helpers'
import sortable from '../../src/html5sortable'
import store from '../../src/store'
/* eslint-env jest */

describe('_removeItemData', () => {
  let ul, allLiElements, li
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    store(ul).config = {
      hoverClass: 'hover-class'
    }
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul, null)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })
  test('should remove the role, draggable, and aria-grabbed attributes', () => {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li'
    })
    sortable.__testing.removeItemData(li)
    expect(li.getAttribute('role')).toBeNull()
    expect(li.getAttribute('draggable')).toBeNull()
    expect(li.getAttribute('aria-grabbed')).toBeNull()
  })
})
