/* global describe,test,expect */
import {insertAfter} from '../src/insertHtmlElements'

describe('Testing insertAfter', () => {
  test('insertAfter element', () => {
    // setup
    let div = window.document.createElement('div')
    div.innerHTML = '<p>test</p>'
    let span = window.document.createElement('span')
    // assert before
    expect(div.children[0].tagName).toBe('P')
    expect(div.children[1]).toBe(undefined)
    // insert span
    insertAfter(div.querySelector('p'), span)
    // assert after
    expect(div.children[0].tagName).toBe('P')
    expect(div.children[1].tagName).toBe('SPAN')
  })

  test('try to insertAfter element which is not in dom', () => {
    let div = window.document.createElement('div')
    let span = window.document.createElement('span')
    // test missing elements
    expect(() => { insertAfter(div, span) }).toThrow('target and element must be a node')
  })

  test('try to insertAfter text', () => {
    let div = window.document.createElement('div')
    // test missing elements
    expect(() => { insertAfter(div, 'error') }).toThrow('target and element must be a node')
    expect(() => { insertAfter('error', div) }).toThrow('target and element must be a node')
    expect(() => { insertAfter(undefined, div) }).toThrow('target and element must be a node')
    expect(() => { insertAfter(div) }).toThrow('target and element must be a node')
  })
})
