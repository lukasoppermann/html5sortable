/* global describe,test,expect */
/* eslint-env jest */
import elementHeight from '../src/elementHeight'

describe('Testing elementHeight', () => {
  test('no valid element', () => {
    // assert
    expect(() => { elementHeight('') }).toThrow('You must provide a valid dom element')
  })

  test('element is not in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    div.style.height = '10px'
    // assert
    expect(elementHeight(div)).toEqual(10)
  })

  test('element is in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    div.style.height = '10px'
    div.style.paddingTop = '5px'
    div.style.paddingBottom = '7px'
    // assert
    expect(elementHeight(div)).toEqual(22)
  })

  test('element has box-sizing: border-box', () => {
    // setup
    const div = window.document.createElement('div')
    div.style.boxSizing = 'border-box'
    div.style.height = '20px'
    div.style.paddingTop = '5px'
    div.style.paddingBottom = '5px'
    // assert
    expect(elementHeight(div)).toEqual(20)
  })
})
