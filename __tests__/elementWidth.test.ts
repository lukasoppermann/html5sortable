/* global describe,test,expect */
/* eslint-env jest */
import elementWidth from '../src/elementWidth'

describe('Testing elementHeight', () => {
  test('no valid element', () => {
    // assert
    expect(() => { elementWidth('') }).toThrow('You must provide a valid dom element')
  })

  test('element is not in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    div.style.width = '10px'
    // assert
    expect(elementWidth(div)).toEqual(10)
  })

  test('element is in DOM', () => {
    // setup
    const div = window.document.createElement('div')
    div.style.width = '10px'
    div.style.paddingLeft = '5px'
    div.style.paddingRight = '7px'
    window.document.body.appendChild(div)
    // assert
    expect(elementWidth(document.querySelector('div'))).toEqual(22)
  })
})
