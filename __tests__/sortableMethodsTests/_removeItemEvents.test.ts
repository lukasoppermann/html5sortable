/* global describe,test,expect */
import { mockInnerHTML } from '../helpers'
import sortable from '../../src/html5sortable'
import store from '../../src/store'
/* eslint-env jest */

describe('_removeItemEvents', () => {
  document.body.innerHTML = mockInnerHTML
  let ul = document.body.querySelector('.sortable')
  let li = ul.querySelector('.li-first')
  sortable(ul, null)

  test('_removeItemEvents', () => {
    expect(typeof store(li).getData('eventdragover')).toBe('function')
    expect(typeof store(li).getData('eventdragenter')).toBe('function')
    // remove item events
    sortable.__testing.removeItemEvents(li)
    // assert
    expect(typeof store(li).getData('eventdragover')).toBe('undefined')
    expect(typeof store(li).getData('eventdragenter')).toBe('undefined')
  })
})
