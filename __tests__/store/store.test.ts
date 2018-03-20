/* global describe,test,expect */
import {default as store, Store as StoreClass} from '../../src/store'

describe('Testing general data store functionality', () => {
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
})
