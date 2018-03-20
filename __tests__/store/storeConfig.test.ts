/* global describe,test,expect */
import {default as store, Store as StoreClass} from '../../src/store'
import defaultConfiguration from '../../src/defaultConfiguration'

describe('Testing data store', () => {
  test('no sortable provided', () => {
    // assert before
    expect(() => { store() }).toThrow('Please provide a sortable to the store function.')
    expect(() => { store('fake') }).toThrow('Please provide a sortable to the store function.')
  })

  test('should create store if none exists', () => {
    // setup
    let div = window.document.createElement('div')
    // assert before
    expect(store(div)).toBeInstanceOf(StoreClass)
  })

  test('create store & add custom config', () => {
    // setup
    let div = window.document.createElement('div')
    store(div)
    store(div).config = {
      maxItems: 5,
    }
    // assert
    expect(store(div).getConfig('maxItems')).toBe(5)
    expect(store(div).getConfig('debounce')).toBe(0)
  })

  test('set invalid config', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect( () => { store(div).config = 'maxitems' }).toThrowError('You must provide a valid configuration object to the config setter.')
  })

  test('get entire config from store', () => {
    // setup
    let div = window.document.createElement('div')
    store(div)
    store(div).config = {
      maxItems: 5,
    }
    // assert before
    expect(store(div).config instanceof Object).toBe(true)
    expect(Object.keys(store(div).config).length).toBe(Object.keys(defaultConfiguration).length)
  })

  test('setting config item', () => {
    // setup
    let div = window.document.createElement('div')
    // assert before
    expect(store(div).getConfig('maxItems')).toBe(0)
    store(div).setConfig('maxItems',5)
    expect(store(div).getConfig('maxItems')).toBe(5)
  })

  test('setting invalid config item', () => {
    // setup
    let div = window.document.createElement('div')
    // assert before

    expect(() => { store(div).setConfig('fake',5) }).toThrowError('Trying to set invalid configuration item: fake')
  })

  test('getting invalid config item', () => {
    // setup
    let div = window.document.createElement('div')
    // assert before

    expect(() => { store(div).getConfig('fake') }).toThrowError('Invalid configuration item requested: fake')
  })
})
