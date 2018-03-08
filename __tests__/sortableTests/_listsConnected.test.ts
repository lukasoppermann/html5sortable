/* global describe,test,expect */
import { mockInnerHTML } from '../testHelpers.ts'
import sortable from '../../src/html5sortable'

describe('_removeSortableEvents', () => {
  let ul, connectedUl, notConnectedUl, ulsInnerHTML
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)

    document.body.innerHTML = `<ul class="sortable2">
    <li>item</li>
    </ul>
    <ul class="sortable3">
    <li>item</li>
    </ul>`

    connectedUl = document.body.querySelector('.sortable2')
    notConnectedUl = document.body.querySelector('.sortable3')

    // create additional sortables
    sortable(connectedUl, {
      connectWith: '.sortable'
    })
    sortable(notConnectedUl)
  })
  // This needs to be split up:
  test('each sortable ul should connect with itself', () => {
    // test if sortable is connected to itself (should be true)
    expect(sortable.__testing._listsConnected(ul, ul)).toEqual(true)
  })
  test('connectWith: both uls must connect to a class at instantiation to be connected', () => {
    // because ul was never instantiated with connectWith: '.sortable' they are not connected, so all should be false
    expect(sortable.__testing._listsConnected(ul, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(connectedUl, ul)).toEqual(false)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(ul, notConnectedUl)).toEqual(false)
  })
  test('connectWith: when both lists are connected to a class when instantiated they should be connected', () => {
    sortable(ul, 'destroy')
    sortable(ul, {
      connectWith: '.sortable'
    })
    // as both were instantiated with connectWith these should be true
    expect(sortable.__testing._listsConnected(connectedUl, ul)).toEqual(true)
    expect(sortable.__testing._listsConnected(ul, connectedUl)).toEqual(true)
    // notConnectedUl was never connected
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
  })
  test(('acceptFrom: if a list is specified to accept from a certain list it should only accept from that list'), () => {
    sortable(connectedUl, 'destroy')
    sortable(notConnectedUl, 'destroy')
    sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    sortable(notConnectedUl, {
      acceptFrom: false
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3, not itself any longer (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)
  })
  test(('acceptFrom: setting a uls acceptFrom to a string that is not another ul should not change the functionality'), () => {
    sortable(connectedUl, 'destroy')
    sortable(notConnectedUl, 'destroy')
    sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    sortable(notConnectedUl, {
      acceptFrom: ''
    })
    console.log(connectedUl.h5s.data, notConnectedUl.h5s.data)
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)
  })
  test(('acceptFrom: setting a uls acceptFrom to null should not change the functionality'), () => {
    sortable(connectedUl, 'destroy')
    sortable(notConnectedUl, 'destroy')
    sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    sortable(notConnectedUl, {
      acceptFrom: null
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(true)
  })
})
