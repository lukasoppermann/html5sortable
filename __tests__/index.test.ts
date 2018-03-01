import index from '../src/index.ts'
/* global describe,it,beforeEach,afterEach */
describe('Testing index', () => {
  
  test('element is not in DOM', () => {
    let div = window.document.createElement('div')
    expect(index(div)).toEqual(-1)
  })

  test('element is child of div', () => {
    let div = window.document.createElement('div')
    let child1 = window.document.createElement('div')
    let child2 = window.document.createElement('div')
    div.appendChild(child1)
    div.appendChild(child2)

    expect(index(child1)).toEqual(0)
    expect(index(child2)).toEqual(1)
  })
})
