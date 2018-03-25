/* global describe,test,expect */
import { mockInnerHTML } from '../helpers'
import Sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('_removeSortableEvents', () => {
  let ul, connectedUl, notConnectedUl, ulsInnerHTML
  beforeEach(() => {
    document.body.innerHTML = mockInnerHTML
    ul = document.body.querySelector('.sortable')
    new Sortable(ul, 'destroy')
    // init sortable
    new Sortable(ul, null)

    document.body.innerHTML = `
    <ul class="sortable2">
      <li>item</li>
    </ul>
    <ul class="sortable3">
      <li>item</li>
    </ul>`

    connectedUl = document.body.querySelector('.sortable2')
    notConnectedUl = document.body.querySelector('.sortable3')

    // create additional sortables
    new Sortable(connectedUl, {
      connectWith: '.sortable'
    })
    new Sortable(notConnectedUl, null)
  })

  test('each sortable ul should connect with itself by default', () => {
    // test if sortable is connected to itself (should be true)
    expect(Sortable.__testing._listsConnected(ul, ul)).toEqual(true)
  })

  test('connectWith: both uls must connect to a class at instantiation to be connected', () => {
    // because ul was never instantiated with connectWith: '.sortable' they are not connected, so all should be false
    expect(Sortable.__testing._listsConnected(ul, connectedUl)).toEqual(false)
    expect(Sortable.__testing._listsConnected(connectedUl, ul)).toEqual(false)
    expect(Sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
    expect(Sortable.__testing._listsConnected(ul, notConnectedUl)).toEqual(false)
  })

  test('connectWith: when both lists are connected to a class when instantiated they should be connected', () => {
    new Sortable(ul, 'destroy')
    new Sortable(ul, {
      connectWith: '.sortable'
    })
    // as both were instantiated with connectWith these should be true
    expect(Sortable.__testing._listsConnected(connectedUl, ul)).toEqual(true)
    expect(Sortable.__testing._listsConnected(ul, connectedUl)).toEqual(true)
    // notConnectedUl was never connected
    expect(Sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
  })

  test(('acceptFrom: when set to another sortable it should be able to accept only from that list if set to false'), () => {
    new Sortable(connectedUl, 'destroy')
    new Sortable(notConnectedUl, 'destroy')
    new Sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    new Sortable(notConnectedUl, {
      acceptFrom: false
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(Sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    expect(Sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)
  })

  test(('acceptFrom: when unconnected is set to empty string it should also not accept'), () => {
    new Sortable(connectedUl, 'destroy')
    new Sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    new Sortable(notConnectedUl, 'destroy')
    new Sortable(notConnectedUl, {
      acceptFrom: ''
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(Sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(Sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)
  })

  test(('acceptFrom: when set to null it should be able to accept from itself'), () => {
    new Sortable(connectedUl, 'destroy')
    new Sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    new Sortable(notConnectedUl, 'destroy')
    new Sortable(notConnectedUl, {
      acceptFrom: null
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(Sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(Sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(Sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(true)
  })
})
