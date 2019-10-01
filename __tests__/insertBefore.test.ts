/* global describe,test,expect */
/* eslint-env jest */

import { insertBefore } from '../src/insertHtmlElements'

describe('Testing insertBefore', () => {
  test('insertBefore element', () => {
    // setup
    const div = window.document.createElement('div')
    div.innerHTML = '<p>test</p>'
    const span = window.document.createElement('span')
    // assert before
    expect(div.children[0].tagName).toBe('P')
    // insert span
    insertBefore(div.querySelector('p'), span)
    // assert after
    expect(div.children[0].tagName).toBe('SPAN')
    expect(div.children[1].tagName).toBe('P')
  })

  test('try to insertBefore element which is not in dom', () => {
    const div = window.document.createElement('div')
    const span = window.document.createElement('span')
    // test missing elements
    expect(() => { insertBefore(div, span) }).toThrow('target and element must be a node')
  })

  test('try to insertBefore text', () => {
    const div = window.document.createElement('div')
    // test missing elements
    expect(() => { insertBefore(div, 'error') }).toThrow('target and element must be a node')
    expect(() => { insertBefore('error', div) }).toThrow('target and element must be a node')
    expect(() => { insertBefore(undefined, div) }).toThrow('target and element must be a node')
    expect(() => { insertBefore(div, null) }).toThrow('target and element must be a node')
  })
})
