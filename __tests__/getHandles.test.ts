/* global describe,test,expect */
/* eslint-env jest */
import getHandles from '../src/getHandles'
import { mockInnerHTML } from './helpers'

describe('Test getHandles function to return handles or items if no handles specifier is given', () => {
  test('no items provided', () => {
    expect(() => { getHandles(null, '.handle') }).toThrow('You must provide a Array of HTMLElements to be filtered.')
  })

  test('returns items if no handle selector is provided', () => {
    document.body.innerHTML = mockInnerHTML
    const items = Array.from(document.querySelector('.sortable').children)
    expect(getHandles(items).length).toEqual(3)
    expect(getHandles(items, []).length).toEqual(3)
    expect(getHandles(items)[0].nodeName).toEqual('LI')
  })

  test('gets handles array from items', () => {
    document.body.innerHTML = mockInnerHTML
    const items = Array.from(document.querySelector('.sortable').children)
    expect(getHandles(items, '.handle').length).toEqual(2)
    expect(getHandles(items, '.handle')[0].outerHTML).toEqual('<span class="handle"></span>')
  })
})
