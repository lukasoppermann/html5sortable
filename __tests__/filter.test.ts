/* global describe,test,expect */
import filter from '../src/filter'

describe('Testing filter for NodeLists and HTMLCollections', () => {
  test('filter nodeList', () => {
    // setup
    let div = window.document.createElement('div')
    div.innerHTML = '<p></p><div></div><span></span>'
    // assert before
    expect(filter(div.querySelectorAll('*'), 'span').length).toBe(1)
  })

  test('filter HTMLCollection', () => {
    // setup
    let div = window.document.createElement('div')
    div.innerHTML = '<p></p><div></div><span></span>'
    // assert before
    expect(filter(div.children, 'span').length).toBe(1)
  })

  test('provide wrong arguments', () => {
    let div = window.document.createElement('div')
    div.innerHTML = '<p></p><div></div><span></span>'
    // test missing elements
    expect(() => { filter(div, 'span') }).toThrow('You must provide a nodeList/HTMLCollection of elements to be filtered.')
  })
})
