/* describe,test,expect */
import { mockInnerHTML } from '../helpers'
import sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_removeSortableEvents', () => {
  let ul
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul, null)
  })
  test('_removeSortableEvents', () => {
    // remove events object
    sortable.__testing._removeSortableEvents(ul)
    // check that events are gone
    expect(ul.h5s.events.dragover).not.toBeDefined()
    expect(ul.h5s.events.dragenter).not.toBeDefined()
    expect(ul.h5s.events.drop).not.toBeDefined()
  })
})
