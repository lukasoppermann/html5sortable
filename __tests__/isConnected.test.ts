/* global describe,test,expect */
import { mockInnerHTML } from './helpers'
import isConnected from '../src/isConnected'
import sortable from '../src/html5sortable'
/* eslint-env jest */

describe('Testing isConnected modules', () => {
  let sortableElement, secondSortable
  // setup
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    sortableElement = document.body.querySelector('.sortable')
    secondSortable = document.body.querySelector('.second-sortable')
  })

  test('each sortable ul should connect with itself by default', () => {
    sortable(sortableElement, {})
    // test if sortable is connected to itself (should be true)
    expect(isConnected(sortableElement, sortableElement)).toEqual(true)
  })

  test('acceptFrom fails when invalid selector is given', () => {
    sortable(sortableElement, {
      acceptFrom: secondSortable
    })
    sortable(secondSortable, {
      acceptFrom: true
    })
    // assert
    expect(() => { isConnected(sortableElement, sortableElement) }).toThrowError('HTML5Sortable: Wrong argument, "acceptFrom" must be "null", "false", or a valid selector string.')
    expect(() => { isConnected(secondSortable, sortableElement) }).toThrowError('HTML5Sortable: Wrong argument, "acceptFrom" must be "null", "false", or a valid selector string.')
  })

  test('acceptFrom does not accept when empty selector is given', () => {
    sortable(sortableElement, {
      acceptFrom: ''
    })
    expect(isConnected(sortableElement, secondSortable)).toEqual(false)
    expect(isConnected(sortableElement, sortableElement)).toEqual(false)
  })

  test('acceptFrom is disconnected to itself if set to false', () => {
    sortable(sortableElement, {
      acceptFrom: false
    })
    // assert
    expect(isConnected(sortableElement, secondSortable)).toEqual(false)
    expect(isConnected(sortableElement, sortableElement)).toEqual(false)
  })

  test('acceptFrom is connected to itself if set to null & disconnecte from other sortables', () => {
    sortable(sortableElement, {
      acceptFrom: null
    })
    // assert
    expect(isConnected(sortableElement, secondSortable)).toEqual(false)
    expect(isConnected(sortableElement, sortableElement)).toEqual(true)
  })

  test('acceptFrom is connected to other sortables if set to selector & disconnected from itself', () => {
    sortable(sortableElement, {
      acceptFrom: '.second-sortable'
    })
    // assert
    expect(isConnected(sortableElement, secondSortable)).toEqual(true)
    expect(isConnected(sortableElement, sortableElement)).toEqual(false)
    // one direction connected only
    expect(isConnected(secondSortable, sortableElement)).toEqual(false)
  })

  test('acceptFrom is connected to other sortables including itself if selector matches', () => {
    sortable(sortableElement, {
      acceptFrom: '.all-sortables'
    })
    // assert
    expect(isConnected(sortableElement, secondSortable)).toEqual(true)
    expect(isConnected(sortableElement, sortableElement)).toEqual(true)
    // one direction connected only
    expect(isConnected(secondSortable, sortableElement)).toEqual(false)
  })

  test('⚠️  [deprecated] connectWith: sortables are connected in all way', () => {
    // disable warnings in console
    global.console.warn = (input) => {}
    // setup
    sortable(sortableElement, {
      connectWith: 'someValue'
    })
    sortable(secondSortable, {
      connectWith: 'someValue'
    })
    // because ul was never instantiated with connectWith: '.sortable' they are not connected, so all should be false
    expect(isConnected(sortableElement, secondSortable)).toEqual(true)
    expect(isConnected(sortableElement, sortableElement)).toEqual(true)
    expect(isConnected(secondSortable, secondSortable)).toEqual(true)
    expect(isConnected(secondSortable, sortableElement)).toEqual(true)
  })

  test('⚠️  [deprecated] connectWith: if one sortable misses value, they are not connected', () => {
    // disable warnings in console
    global.console.warn = (input) => {}
    sortable(sortableElement, {
      connectWith: 'someValue'
    })
    sortable(secondSortable, {})
    // because ul was never instantiated with connectWith: '.sortable' they are not connected, so all should be false
    expect(isConnected(sortableElement, secondSortable)).toEqual(false)
    expect(isConnected(sortableElement, sortableElement)).toEqual(true)
    expect(isConnected(secondSortable, secondSortable)).toEqual(true)
    expect(isConnected(secondSortable, sortableElement)).toEqual(false)
  })
})
