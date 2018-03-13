/* describe,test,expect */
/* eslint-env jest */

import offset from '../src/offset'

describe('Testing offset', () => {
  test('offset element', () => {

    interface rect {
      left: number, 
      right: number,
      top: number,
      bottom: number
    }
    
    // create mock elements
    const elementMock = {
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
    Object.defineProperty(window, 'scrollX', {value: 7, writable: false})
    Object.defineProperty(window, 'scrollY', {value: 14, writable: false})
    // run function
    let offsetResults: rect = offset(elementMock)
    // Assertions
    expect(offsetResults.left).toBe(17)
    expect(offsetResults.right).toBe(27)
    expect(offsetResults.top).toBe(19)
    expect(offsetResults.bottom).toBe(29)
  })

  test('offset of element that is not in the dom', () => {
    let div = window.document.createElement('div')
    expect(() => { offset(div) }).toThrow('target element must be part of the dom')
  })
})
