/* global describe,test,expect */
import { mockInnerHTML } from '../helpers'
import Sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_removeItemData', () => {
  let ul, allLiElements, li
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    new Sortable(ul, 'destroy')
    // init sortable
    new Sortable(ul, null)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })
  test('should remove the role, draggable, and aria-grabbed attributes', () => {
    // destroy, so it does not use old values
    new Sortable(ul, 'destroy')
    new Sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    Sortable.__testing._removeItemData(li)
    expect(li.getAttribute('role')).toBeNull()
    expect(li.getAttribute('draggable')).toBeNull()
    expect(li.getAttribute('aria-grabbed')).toBeNull()
  })
})
