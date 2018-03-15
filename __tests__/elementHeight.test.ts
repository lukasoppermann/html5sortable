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
    let div = window.document.createElement('div')
    div.style.height = '10px'
    // assert
    expect(elementHeight(div)).toEqual(10)
  })

  test('element is in DOM', () => {
    // setup
    let div = window.document.createElement('div')
    div.style.height = '10px'
    div.style.paddingTop = '5px'
    div.style.paddingBottom = '7px'
    window.document.body.appendChild(div)
    // assert
    expect(elementHeight(document.querySelector('div'))).toEqual(22)
  })
})
