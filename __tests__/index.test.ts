/* global describe,test,expect */
/* eslint-env jest */

import getIndex from '../src/getIndex'

describe('Testing index', () => {
  test('element is undefined', () => {
    // setup
    const div = window.document.createElement('div')
    // assert
    expect(() => { getIndex(undefined, div) }).toThrow('You must provide an element and a list of elements.')
  })

  test('elementList is not a valid list', () => {
    // setup
    const div = window.document.createElement('div')
    const div2 = window.document.createElement('div')
    // assert
    expect(() => { getIndex(div, div2) }).toThrow('You must provide an element and a list of elements.')
    expect(() => { getIndex(div, undefined) }).toThrow('You must provide an element and a list of elements.')
  })

  test('elementList is a nodelist', () => {
    // setup
    const div = window.document.createElement('div')
    div.innerHTML = '<div></div>'
    const nodeList = div.querySelectorAll('div')
    // assert
    expect(() => { getIndex(div, nodeList) }).not.toThrow('You must provide an element and a list of elements.')
  })

  test('elementList is a HTMLCollection', () => {
    // setup
    const div = window.document.createElement('div')
    // assert
    expect(() => { getIndex(div, document.links) }).not.toThrow('You must provide an element and a list of elements.')
  })

  test('elementList is an Array', () => {
    // setup
    const div = window.document.createElement('div')
    // assert
    expect(() => { getIndex(div, []) }).not.toThrow('You must provide an element and a list of elements.')
  })

  test('element is child of div', () => {
    // setup
    const div = window.document.createElement('div')
    const child1 = window.document.createElement('div')
    const child2 = window.document.createElement('div')
    const span = window.document.createElement('span')
    div.appendChild(child1)
    div.appendChild(span)
    div.appendChild(child2)
    // assert
    expect(getIndex(child1, div.children)).toEqual(0)
    expect(getIndex(child2, div.querySelectorAll('div'))).toEqual(1)
  })
})
