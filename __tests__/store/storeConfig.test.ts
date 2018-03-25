/* global global,describe,test,expect */
import {default as store, Store as StoreClass} from '../../src/store'
import defaultConfiguration from '../../src/defaultConfiguration'
describe('Testing config store', () => {

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

  test('set deprecated config', () => {
    // fake console.warn to avoid logs in test
    global.console.warn = (input) => {}
    const spy = jest.spyOn(global.console, 'warn')
    // setup
    let div = window.document.createElement('div')
    // assert connectWith
    store(div).config = {'connectWith':'Test'}
    expect(spy).toBeCalledWith('HTML5Sortable: You are using the deprecated configuration "connectWith". This will be removed in an upcoming version, make sure to migrate to the new options when updating.')
    // assert IEFix
    store(div).config = {'disableIEFix':'Test'}
    expect(spy).toBeCalledWith('HTML5Sortable: You are using the deprecated configuration "disableIEFix". This will be removed in an upcoming version, make sure to migrate to the new options when updating.')
  })

  test('get entire config from store', () => {
    // setup
    let div = window.document.createElement('div')
    store(div)
    store(div).config = {
      maxItems: 5,
    }
    // assert
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

  test('set deprecated config with setConfig', () => {
    // fake console.warn to avoid logs in test
    global.console.warn = (input) => {}
    const spy = jest.spyOn(global.console, 'warn')
    // setup
    let div = window.document.createElement('div')
    // assert connectWith
    store(div).setConfig('connectWith','Test')
    expect(spy).toBeCalledWith('HTML5Sortable: You are using the deprecated configuration "connectWith". This will be removed in an upcoming version, make sure to migrate to the new options when updating.')
    // assert IEFix
    store(div).setConfig('disableIEFix','Test')
    expect(spy).toBeCalledWith('HTML5Sortable: You are using the deprecated configuration "disableIEFix". This will be removed in an upcoming version, make sure to migrate to the new options when updating.')
  })

  test('setting invalid config item', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(() => { store(div).setConfig('fake',5) }).toThrowError('Trying to set invalid configuration item: fake')
  })

  test('getting invalid config item', () => {
    // setup
    let div = window.document.createElement('div')
    // assert
    expect(() => { store(div).getConfig('fake') }).toThrowError('Invalid configuration item requested: fake')
  })
})
