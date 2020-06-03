/* global describe,test,expect */
/* eslint-env jest */

import isInDom from '../src/isInDom'

describe('Testing isInDom', () => {
  test('element is not in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    // assert
    expect(isInDom(div)).toEqual(false)
  })

  test('element is not a valid DOM element', () => {
    // assert
    expect(() => { isInDom('fake') }).toThrow('Element is not a node element.')
  })

  test('element is in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    // assert
    expect(isInDom(div)).toEqual(false)
    // append div to dom
    document.body.appendChild(div)
    // assert
    expect(isInDom(div)).toEqual(true)
  })
})
