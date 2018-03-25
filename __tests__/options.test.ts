/* global describe,test,expect */
/* eslint-env jest */
import sortable from '../src/html5sortable'
import defaultConfig from '../src/defaultConfiguration'

describe('Test options from sortable', () => {
  test('options: undefined', () => {
    let div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, undefined)[0]
    // test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts).toEqual(defaultConfig)
  })

  test('options: method string', () => {
    let div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, null)
    sortableElement = sortable(div, 'enable')[0]
    // test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('sortable-dragging')
  })

  test('options: object', () => {
    // fake sortable
    let div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, {
      maxItems: 5
    })[0]
    // assert
    expect(sortableElement.h5s.data.opts.maxItems).toEqual(5)
    // also test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('sortable-dragging')
  })
})
