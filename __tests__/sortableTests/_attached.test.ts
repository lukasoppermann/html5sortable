/* global describe,test,expect */
import { mockInnerHTML } from '../testHelpers.ts'
import sortable from '../../src/html5sortable'

describe('_attached', () => {
  let ul, li, allLiElements
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
  })

  test.skip('_attached', () => {
  })
})
