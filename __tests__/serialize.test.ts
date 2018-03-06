/* global describe,test,expect */
import serialize from '../src/serialize'
import sortable from '../src/html5sortable'

describe('Testing isInDom', () => {
  test('serialize: sortableContainer is not an element', () => {
    expect(() => { serialize('fake') }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: sortableContainer is not a sortable', () => {
    // setup
    let divIsNotASortable = window.document.createElement('div')
    // assert
    expect(() => { serialize(divIsNotASortable) }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: element that is not part of the DOM', () => {
    // setup
    let isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.any(Array),
      container: expect.any(Object)
    }))
  })

  test('serialize: empty sortableContainer', () => {
    // setup
    let isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([]),
      container: expect.objectContaining({
        element: isASortable,
        itemCount: 0
      })
    }))
  })

  test('serialize: with elements', () => {
    // setup
    let isASortable = sortable(window.document.createElement('div'), {
      items: 'div'
    })[0]
    isASortable.innerHTML = '<div id="itemOne">Item1</div><div id="itemTwo">Item2</div>'
    let itemOne = isASortable.querySelector('#itemOne')
    let itemTwo = isASortable.querySelector('#itemTwo')
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({
          parent: isASortable,
          node: itemOne,
          html: itemOne.outerHTML,
          index: 0
        },
        expect.objectContaining({
          parent: isASortable,
          node: itemTwo,
          html: itemTwo.outerHTML,
          index: 1
        },
      ]),
      container: expect.objectContaining({
        element: isASortable,
        itemCount: 2
      })
    }))
  })

  test('serialize: with elements that are not items sortable', () => {
    // setup
    let isASortable = sortable(window.document.createElement('div'), {
      items: 'div'
    })[0]
    isASortable.innerHTML = '<span>Title</span><div id="itemOne">Item1</div><div id="itemTwo">Item2</div>'
    let itemOne = isASortable.querySelector('#itemOne')
    let itemTwo = isASortable.querySelector('#itemTwo')
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({
          parent: isASortable,
          node: itemOne,
          html: itemOne.outerHTML,
          index: 0
        },
        expect.objectContaining({
          parent: isASortable,
          node: itemTwo,
          html: itemTwo.outerHTML,
          index: 1
        },
      ]),
      container: expect.objectContaining({
        element: isASortable,
        itemCount: 2
      })
    }))
  })
  })


    test.skip('serialize: with custom serializer with that is not a function', () => {
    })

  test.skip('serialize: with custom serializer', () => {
  })
})
