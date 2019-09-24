/* global describe,test,expect */
/* eslint-env jest */
import sortable from '../src/html5sortable'
import defaultConfig from '../src/defaultConfiguration'

describe('Test options from sortable', () => {
  test('options: undefined', () => {
    const div = window.document.createElement('div')
    // init sortable & get first one
    const sortableElement = sortable(div, undefined)[0]
    // test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts).toEqual(defaultConfig)
  })

  test('options: method string', () => {
    const div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, null)
    sortableElement = sortable(div, 'enable')[0]
    // test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('sortable-dragging')
  })

  test('options: object', () => {
    // fake sortable
    const div = window.document.createElement('div')
    // init sortable & get first one
    const sortableElement = sortable(div, {
      maxItems: 5
    })[0]
    // assert
    expect(sortableElement.h5s.data.opts.maxItems).toEqual(5)
    // also test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('sortable-dragging')
  })

  test("options: don't overwrite on reload", () => {
    const div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, {
      maxItems: 6,
      draggingClass: 'dragging'
    })[0]
    // check whether the options have been set
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('dragging')
    expect(sortableElement.h5s.data.opts.maxItems).toEqual(6)
    // reload sortable
    sortableElement = sortable(div)[0]
    // check whether the options are still the same
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('dragging')
    expect(sortableElement.h5s.data.opts.maxItems).toEqual(6)
    // change an option
    sortableElement = sortable(div, {
      maxItems: 7
    })[0]
    // check whether only that one option changed
    expect(sortableElement.h5s.data.opts.draggingClass).toEqual('dragging')
    expect(sortableElement.h5s.data.opts.maxItems).toEqual(7)
  })
})
