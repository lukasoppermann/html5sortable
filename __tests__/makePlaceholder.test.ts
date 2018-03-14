/* global describe,test,expect */
/* eslint-env jest */

import makePlaceholder from '../src/makePlaceholder'

describe('Testing makePlaceholder function', () => {
  test('undefined as sortable', () => {
    expect(() => { makePlaceholder(undefined, null) }).toThrow('You must provide a valid element as a sortable.')
  })

  test('string as placeholder', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(() => { makePlaceholder(div, 'fake') }).toThrow('You must provide a valid element as a placeholder or set ot to undefined.')
  })

  test('custom placeholder class', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(makePlaceholder(div, div, 'custom').classList.contains('custom')).toEqual(true)
  })

  test('object placeholder class', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(makePlaceholder(div, div, {}).tagName).toEqual('DIV')
  })

  test('List placeholer', () => {
    // setup
    let ul = window.document.createElement('ul')
    let ol = window.document.createElement('ol')
    // assert
    expect(makePlaceholder(ul, undefined).tagName).toEqual('LI')
    expect(makePlaceholder(ol, undefined).tagName).toEqual('LI')
  })

  test('List placeholer', () => {
    // setup
    let ul = window.document.createElement('ul')
    let ol = window.document.createElement('ol')
    // assert
    expect(makePlaceholder(ul, undefined).tagName).toEqual('LI')
    expect(makePlaceholder(ol, undefined).tagName).toEqual('LI')
  })

  test('Table placeholer', () => {
    // setup
    let table = window.document.createElement('table')
    let tbody = window.document.createElement('tbody')
    // assert
    expect(makePlaceholder(table, undefined).outerHTML).toEqual('<tr class="sortable-placeholder"><td colspan="100"></td></tr>')
    expect(makePlaceholder(tbody, undefined).outerHTML).toEqual('<tr class="sortable-placeholder"><td colspan="100"></td></tr>')
  })

  test('Default div placeholer', () => {
    // setup
    let div = window.document.createElement('div')
    let menu = window.document.createElement('menu')
    // assert
    expect(makePlaceholder(div, undefined).tagName).toEqual('DIV')
    expect(makePlaceholder(menu, undefined).tagName).toEqual('DIV')
  })
})
