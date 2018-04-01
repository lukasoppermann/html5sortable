/* global describe,test,expect */
import {default as store, Store as StoreClass} from '../../src/store'

describe('Testing placeholder store', () => {

  test('get non-existent placeholder', () => {
    // setup
    let div = window.document.createElement('div')
    store(div)
    // assert
    expect(store(div).placeholder).toBe(undefined)
  })

  test('set & get invalid placeholder', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(() => { store(div).placeholder = 'fake' }).toThrowError('A placeholder must be an html element or null.')
  })

  test('set & unset valid placeholder', () => {
    // setup
    let div = window.document.createElement('div')
    let placeholder = window.document.createElement('div')
    store(div).placeholder = placeholder
    // assert
    expect(store(div).placeholder).toBe(placeholder)
    // change
    store(div).placeholder = null
    expect(store(div).placeholder).toBe(null)
  })
})
