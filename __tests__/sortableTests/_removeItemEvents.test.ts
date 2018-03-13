/* describe,test,expect */
import { mockInnerHTML } from '../helpers'
import sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_removeItemEvents', () => {
  let ul, allLiElements, li
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul, null)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })
  test('_removeItemEvents', () => {
    // remove general jQuery event object
    sortable.__testing._removeItemEvents(li)
    expect(li.h5s.events).toEqual({})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    sortable(ul, null)
    sortable.__testing._removeItemEvents(li)
    // test individual events
    expect((li.h5s.events || {}).hasOwnProperty('dragover')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragenter')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('drop')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragstart')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragend')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('mousedown')).toBe(false)
  })
})
