/* global describe,test,expect */
import { mockInnerHTML } from '../testHelpers.ts'
import sortable from '../../src/html5sortable'

describe('_removeItemData', () => {
  let ul, allLiElements, li
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })
  test('should remove the role, draggable, and aria-grabbed attributes', () => {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeItemData(li)
    expect(li.getAttribute('role')).toBeNull()
    expect(li.getAttribute('draggable')).toBeNull()
    expect(li.getAttribute('aria-grabbed')).toBeNull()
  })
})
