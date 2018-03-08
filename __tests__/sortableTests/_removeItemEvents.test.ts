/* global describe,test,expect */
import { mockInnerHTML } from '../testHelpers'
import sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_removeItemEvents', () => {
  let ul, allLiElements, li
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    li = ul.querySelector('.li-first')
  })
  test('should remove all events attached to a list', () => {
    // remove general jQuery event object
    sortable.__testing._removeItemEvents(li)
    expect(li.h5s.events).toEqual({})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    sortable(ul)
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
