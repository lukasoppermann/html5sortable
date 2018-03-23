/* global describe,test,expect */
import store from '../../src/store'

describe('Testing data store', () => {
  let div = document.createElement('div')
  
  test('set with invalid key', () => {
    expect(() => { store(div).setData(() => {}, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).setData(null, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).setData(1, 'value') }).toThrowError(`The key must be a string.`)
  })
  
  test('set with valid key', () => {
    // set data
    store(div).setData('key', 'value')
    // validate that data was set
    expect(store(div).getData('key')).toBe('value')
  })
  
  test('get not exisiting key', () => {
    expect(store(div).getData('notExisting')).toBe(undefined)
    expect(store(div).getData('notExisting')).not.toBe(null)
    expect(store(div).getData('notExisting')).not.toBe(false)
  })
  
  test('get with invalid key', () => {
    expect(() => { store(div).getData(() => {}, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).getData(null, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).getData(1, 'value') }).toThrowError(`The key must be a string.`)
  })
  
  test('get exisiting key', () => {
    // set data
    store(div).setData('exisiting', 'value')
    // validate that data was set
    expect(store(div).getData('exisiting')).toBe('value')
  })
  
  test('delete invalid key', () => {
    expect(() => { store(div).deleteData(() => {}, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).deleteData(null, 'value') }).toThrowError(`The key must be a string.`)
    expect(() => { store(div).deleteData(1, 'value') }).toThrowError(`The key must be a string.`)
  })
  
  test('delete not exisiting key', () => {
    // verify that key does NOT exists
    expect(store(div).getData('notExisting')).toBe(undefined)
    // assert
    expect(store(div).deleteData('notExisting')).toBe(false)
  })
  
  test('delete with exisiting key', () => {
    // set data
    store(div).setData('exisiting', 'value')
    // verify that key does exists
    expect(store(div).getData('exisiting')).toBe('value')
    // assert
    expect(store(div).deleteData('exisiting')).toBe(true)
  })

})
