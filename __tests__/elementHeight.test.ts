/* global describe,test,expect,beforeEach,CustomEvent */
import elementHeight from '../src/elementHeight'

describe('Testing elementHeight', () => {
  test.skip('no valid element', () => {

  })

  test('element is not in DOM', () => {
    // setup
    let div = window.document.createElement('div')
    div.style.height = '10px'
    // assert
    expect(elementHeight(div)).toEqual(10)
  })

  test.skip('element is in DOM', () => {
    // with height padding & margin
  })
})
