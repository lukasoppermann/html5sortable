/* global describe,test,expect */
import makePlaceholder from '../src/makePlaceholder'

describe('Testing makePlaceholder function', () => {
  test('undefined as sortable', () => {
    expect(() => { makePlaceholder(undefined) }).toThrow('You must provide a valid element as a sortable.')
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

  test('List placeholer', () => {
    // setup
    let ul = window.document.createElement('ul')
    let ol = window.document.createElement('ol')
    // assert
    expect(makePlaceholder(ul).tagName).toEqual('LI')
    expect(makePlaceholder(ol).tagName).toEqual('LI')
  })

  test('List placeholer', () => {
    // setup
    let ul = window.document.createElement('ul')
    let ol = window.document.createElement('ol')
    // assert
    expect(makePlaceholder(ul).tagName).toEqual('LI')
    expect(makePlaceholder(ol).tagName).toEqual('LI')
  })

  test('Table placeholer', () => {
    // setup
    let table = window.document.createElement('table')
    let tbody = window.document.createElement('tbody')
    // assert
    expect(makePlaceholder(table).outerHTML).toEqual('<tr class="sortable-placeholder"><td colspan="100"></td></tr>')
    expect(makePlaceholder(tbody).outerHTML).toEqual('<tr class="sortable-placeholder"><td colspan="100"></td></tr>')
  })

  test('Default div placeholer', () => {
    // setup
    let div = window.document.createElement('div')
    let menu = window.document.createElement('menu')
    // assert
    expect(makePlaceholder(div).tagName).toEqual('DIV')
    expect(makePlaceholder(menu).tagName).toEqual('DIV')
  })
})
