/* global describe,test,expect,beforeEach */
import sortable from '../src/html5sortable'

describe('Internal function tests', () => {
  const { JSDOM } = require('jsdom')
  const documentHTML = `<!doctype html><html><body><div id="root"></div></body></html>`
  global.document = new JSDOM(documentHTML)
  global.window = document.parentWindow
  global.body = global.document.querySelector('body')
  let allLiElements, ul, li

  beforeEach(() => {
    // reset sortable
    global.body.innerHTML = `<ul class="sortable">
      <li class="li-first">
        <span class="handle"></span>
        item
      </li>
      <li>
        <span class="another-handle"></span>
        item 2
      </li>
      <li>
        <span class="handle"></span>
        item 3
      </li>
    </ul>`
    // select sortable
    ul = global.body.querySelector('.sortable')
    // destroy sortable to not have any config leftovers
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })

  test('_removeSortableEvents', () => {
    // remove events object
    sortable.__testing._removeSortableEvents(ul)
    // check that events are gone
    expect(ul.h5s.events.dragover).not.toBeDefined()
    expect(ul.h5s.events.dragenter).not.toBeDefined()
    expect(ul.h5s.events.drop).not.toBeDefined()
  })

  test('_removeItemEvents', () => {
    // remove general jQuery event object
    sortable.__testing._removeItemEvents(li)
    expect(li.h5s.events).toEqual({})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    sortable(ul)
    sortable.__testing._removeItemEvents(li)
    // test individual events
    expect((li.h5s.events || {}).hasOwnProperty('dragover')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragenter')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('drop')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragstart')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('dragend')).toBe(false)
    expect((li.h5s.events || {}).hasOwnProperty('mousedown')).toBe(false)
  })

  test('_removeSortableData', () => {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeSortableData(ul)

    expect(sortable.__testing._data(ul, 'opts')).not.toBeDefined()
    expect(sortable.__testing._data(ul, 'connectWith')).not.toBeDefined()
    expect(sortable.__testing._data(ul, 'items')).not.toBeDefined()
    expect(sortable.__testing._data(ul, 'aria-dropeffect')).not.toBeDefined()
  })

  test('_removeItemData', () => {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeItemData(li)
    expect(li.getAttribute('role')).toBeNull()
    expect(li.getAttribute('draggable')).toBeNull()
    expect(li.getAttribute('aria-grabbed')).toBeNull()
  })

  test('_listsConnected', () => {
    // add second sortable (not connected yet!)
    global.body.innerHTML = `<ul class="sortable2"><li>item</li></ul><ul class="sortable3"><li>item</li></ul>`
    let connectedUl = global.body.querySelector('.sortable2')
    let notConnectedUl = global.body.querySelector('.sortable3')
    sortable(connectedUl, {
      connectWith: '.sortable'
    })
    sortable(notConnectedUl)
    // test if sortable is connected to itself (should be true)
    expect(sortable.__testing._listsConnected(ul, ul)).toEqual(true)
    // test if sortable is connected to sortable2 (should be false)
    expect(sortable.__testing._listsConnected(ul, connectedUl)).toEqual(false)
    // test if sortable2 is connected to sortable (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, ul)).toEqual(false)
    // test if sortable2 is connected to sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
    // test if .sortable is connected to sortable3 (should be false)
    expect(sortable.__testing._listsConnected(ul, notConnectedUl)).toEqual(false)

    sortable(ul, 'destroy')
    sortable(ul, {
      connectWith: '.sortable'
    })
    // test if sortables are connected (should be true)
    expect(sortable.__testing._listsConnected(connectedUl, ul)).toEqual(true)
    expect(sortable.__testing._listsConnected(ul, connectedUl)).toEqual(true)
    // test if sortable2 is connected to sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)

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
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)

    sortable(notConnectedUl, 'destroy')
    sortable(notConnectedUl, {
      acceptFrom: ''
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)

    sortable(notConnectedUl, 'destroy')
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
  test.skip('_debounce returns given function, when 0 debounce', () => {

  })

  test('_getHandles: gets handles array from items', () => {
    let handles = sortable.__testing._getHandles(allLiElements, '.handle')
    expect(handles.length).toEqual(2)
    expect(handles[0].outerHTML).toEqual('<span class="handle"></span>')
  })

  test('_getHandles: gets items if no handle selector is provided', () => {
    let handles = sortable.__testing._getHandles(allLiElements)
    expect(handles.length).toEqual(3)
    expect(handles[0].nodeName).toEqual('LI')
  })

  test.skip('_attached', () => {
  })
})
