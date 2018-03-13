/* describe,test,expect */
import { mockInnerHTML } from '../helpers'
import sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_getHandles', () => {
  let ul, li, allLiElements
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul, null)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
  })
  
  test('gets handles array from items', () => {
    let handles = sortable.__testing._getHandles(allLiElements, '.handle')
    expect(handles.length).toEqual(2)
    expect(handles[0].outerHTML).toEqual('<span class="handle"></span>')
  })

  test('gets items if no handle selector is provided', () => {
    let handles = sortable.__testing._getHandles(allLiElements)
    expect(handles.length).toEqual(3)
    expect(handles[0].nodeName).toEqual('LI')
  })
})
