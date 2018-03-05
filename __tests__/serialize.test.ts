/* global describe,test,expect */
import serialize from '../src/serialize'
import sortable from '../src/html5sortable'

describe('Testing isInDom', () => {
  test('serialize: sortableContainer is not an element', () => {
    expect(() => { serialize('fake') }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: sortableContainer is not a sortable', () => {
    let divIsNotASortable = window.document.createElement('div')
    expect(() => { serialize(divIsNotASortable) }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: element that is not part of the DOM', () => {
    let div = sortable(window.document.createElement('div'), {})[0]
    expect(() => { serialize(div) }).not.toThrow('You need to provide a sortableContainer to be serialized.')
    expect(serialize(div)).toEqual(expect.objectContaining({
      items: expect.any(Array),
      container: expect.any(Object)
    }))
  })

  test.skip('serialize: empty sortableContainer', () => {
    let div = sortable(window.document.createElement('div'), {})[0]
    console.log(serialize(div).items)
    expect(() => { serialize(div).items }).not.toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test.skip('serialize: with elements', () => {
  })

  test.skip('serialize: with child sortable', () => {
  })

  test.skip('serialize: with custom serializer', () => {
  })

  test.skip('serialize: with that is not a function', () => {
  })
})
