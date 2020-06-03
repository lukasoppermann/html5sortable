/* global describe,test,expect */
/* eslint-env jest */

import offset from '../src/offset'

describe('Testing offset', () => {
  test('offset element', () => {
    // create mock elements
    const elementMock: any = {
      getClientRects: () => [
        {
          left: 10,
          right: 20,
          top: 5,
          bottom: 15
        }
      ],
      parentElement: () => 'fakeParent'
    }
    Object.defineProperty(window, 'pageXOffset', { value: 7, writable: false })
    Object.defineProperty(window, 'pageYOffset', { value: 14, writable: false })
    // run function
    const offsetResults: any = offset(elementMock)
    // Assertions
    expect(offsetResults.left).toBe(17)
    expect(offsetResults.right).toBe(27)
    expect(offsetResults.top).toBe(19)
    expect(offsetResults.bottom).toBe(29)
  })

  test('offset of element that is not in the dom', () => {
    const div = window.document.createElement('div')
    expect(() => { offset(div) }).toThrow('target element must be part of the dom')
  })
})
