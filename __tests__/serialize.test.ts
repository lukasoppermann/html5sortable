/* global describe,test,expect */
/* eslint-env jest */

import serialize from '../src/serialize'
import sortable from '../src/html5sortable'

describe('Testing serialize', () => {
  test('serialize: sortableContainer is not an element', () => {
    expect(() => { serialize('fake') }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: sortableContainer is not a sortable', () => {
    // setup
    const divIsNotASortable = window.document.createElement('div')
    // assert
    expect(() => { serialize(divIsNotASortable) }).toThrow('You need to provide a sortableContainer to be serialized.')
  })

  test('serialize: element that is not part of the DOM', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.any(Array),
      container: expect.any(Object)
    }))
  })

  test('serialize: empty sortableContainer', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([]),
      container: expect.objectContaining({
        node: isASortable,
        itemCount: 0
      })
    }))
  })

  test('serialize: with elements', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {
      items: 'div'
    })[0]
    isASortable.innerHTML = '<div id="itemOne">Item1</div><div id="itemTwo">Item2</div>'
    const itemOne = isASortable.querySelector('#itemOne')
    const itemTwo = isASortable.querySelector('#itemTwo')
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({
          parent: isASortable,
          node: itemOne,
          html: itemOne.outerHTML,
          index: 0
        }),
        expect.objectContaining({
          parent: isASortable,
          node: itemTwo,
          html: itemTwo.outerHTML,
          index: 1
        })
      ]),
      container: expect.objectContaining({
        node: isASortable,
        itemCount: 2
      })
    }))
  })

  test('serialize: with elements that are not items sortable', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {
      items: 'div'
    })[0]
    isASortable.innerHTML = '<span>Title</span><div id="itemOne">Item1</div><div id="itemTwo">Item2</div>'
    const itemOne = isASortable.querySelector('#itemOne')
    const itemTwo = isASortable.querySelector('#itemTwo')
    // assert
    expect(serialize(isASortable)).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({
          parent: isASortable,
          node: itemOne,
          html: itemOne.outerHTML,
          index: 0
        }),
        expect.objectContaining({
          parent: isASortable,
          node: itemTwo,
          html: itemTwo.outerHTML,
          index: 1
        })
      ]),
      container: expect.objectContaining({
        node: isASortable,
        itemCount: 2
      })
    }))
  })

  test('serialize: with invalid customItemSerializer', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(() => { serialize(isASortable, 'fake') }).toThrow('You need to provide a valid serializer for items and the container.')
  })

  test('serialize: with invalid customContainerSerializer', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {})[0]
    // assert
    expect(() => { serialize(isASortable, () => {}, 'fake') }).toThrow('You need to provide a valid serializer for items and the container.')
  })

  test('serialize: with custom serializer', () => {
    // setup
    const isASortable = sortable(window.document.createElement('div'), {
      items: 'div'
    })[0]
    isASortable.innerHTML = '<div id="itemOne">Item1</div><div id="itemTwo">Item2</div>'
    // assert
    expect(serialize(isASortable,
      (item, sortable) => { return { index: item.index, container: sortable } },
      (container) => { return { itemCount: container.itemCount + 1 } }
    )).toEqual({
      items: [{
        index: 0,
        container: isASortable
      },
      {
        index: 1,
        container: isASortable
      }],
      container: {
        itemCount: 3
      }
    })
  })
})
