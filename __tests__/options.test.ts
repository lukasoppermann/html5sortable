/* global describe,test,expect */
import sortable from '../src/html5sortable'

describe('Test options from sortable', () => {
  test('options: undefined', () => {
    let div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div, undefined)[0]
    // test a default value to check if they stay the same
    expect(sortableElement.h5s.data.opts).toEqual({
      connectWith: false,
      acceptFrom: null,
      copy: false,
      placeholder: null,
      disableIEFix: false,
      placeholderClass: 'sortable-placeholder',
      draggingClass: 'sortable-dragging',
      hoverClass: false,
      debounce: 0,
      maxItems: 0,
      itemSerializer: undefined,
      containerSerializer: undefined
    })
  })

  test('options: method string', () => {
    let div = window.document.createElement('div')
    // init sortable & get first one
    let sortableElement = sortable(div)
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
