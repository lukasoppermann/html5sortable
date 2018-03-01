/* global describe,it,beforeEach,afterEach,before */
describe('Internal function tests', () => {
  const { JSDOM } = require('jsdom')
  const helper = require('./helper')
  const sortable = helper.instrument('./_test/html5sortable.js')
  let window, body
  let ul, li, allLiElements

  beforeAll(() => {
    window = (new JSDOM(``, { runScripts: 'dangerously' })).window
  })

  beforeEach(() => {
    body = window.document.body
    // reset sortable
    body.innerHTML = `<ul class="sortable">
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
    // Execute my library by inserting a <script> tag containing it.
    const scriptEl = window.document.createElement('script')
    scriptEl.textContent = sortable
    window.document.head.appendChild(scriptEl)
    // select sortable
    ul = body.querySelector('.sortable')
    // destroy sortable to not have any config leftovers
    window.sortable(ul, 'destroy')
    // init sortable
    window.sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })

  afterEach(() => {
    helper.writeCoverage(window)
  })

  test('_removeSortableEvents', () => {
    // remove events object
    window.sortable.__testing._removeSortableEvents(ul)
    // check that events are gone
    expect(ul.h5s.events.dragover).not.toBeDefined()
    expect(ul.h5s.events.dragenter).not.toBeDefined()
    expect(ul.h5s.events.drop).not.toBeDefined()
  })

  test('_removeItemEvents', () => {
    // remove general jQuery event object
    window.sortable.__testing._removeItemEvents(li)
    expect(li.h5s.events).toEqual({})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    window.sortable(ul)
    window.sortable.__testing._removeItemEvents(li)
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
    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    window.sortable.__testing._removeSortableData(ul)

    expect(window.sortable.__testing._data(ul, 'opts')).not.toBeDefined()
    expect(window.sortable.__testing._data(ul, 'connectWith')).not.toBeDefined()
    expect(window.sortable.__testing._data(ul, 'items')).not.toBeDefined()
    expect(window.sortable.__testing._data(ul, 'aria-dropeffect')).not.toBeDefined()
  })

  test('_removeItemData', () => {
    // destroy, so it does not use old values
    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    window.sortable.__testing._removeItemData(li)
    expect(li.getAttribute('role')).toBeNull()
    expect(li.getAttribute('draggable')).toBeNull()
    expect(li.getAttribute('aria-grabbed')).toBeNull()
  })

  test('_listsConnected', () => {
    // add second sortable (not connected yet!)
    body.innerHTML = `<ul class="sortable2"><li>item</li></ul><ul class="sortable3"><li>item</li></ul>`
    let connectedUl = body.querySelector('.sortable2')
    let notConnectedUl = body.querySelector('.sortable3')
    window.sortable(connectedUl, {
      connectWith: '.sortable'
    })
    window.sortable(notConnectedUl)
    // test if sortable is connected to itself (should be true)
    expect(window.sortable.__testing._listsConnected(ul, ul)).toEqual(true)
    // test if sortable is connected to sortable2 (should be false)
    expect(window.sortable.__testing._listsConnected(ul, connectedUl)).toEqual(false)
    // test if sortable2 is connected to sortable (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, ul)).toEqual(false)
    // test if sortable2 is connected to sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)
    // test if .sortable is connected to sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(ul, notConnectedUl)).toEqual(false)

    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      connectWith: '.sortable'
    })
    // test if sortables are connected (should be true)
    expect(window.sortable.__testing._listsConnected(connectedUl, ul)).toEqual(true)
    expect(window.sortable.__testing._listsConnected(ul, connectedUl)).toEqual(true)
    // test if sortable2 is connected to sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(false)

    window.sortable(connectedUl, 'destroy')
    window.sortable(notConnectedUl, 'destroy')
    window.sortable(connectedUl, {
      acceptFrom: '.sortable3'
    })
    window.sortable(notConnectedUl, {
      acceptFrom: false
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)

    window.sortable(notConnectedUl, 'destroy')
    window.sortable(notConnectedUl, {
      acceptFrom: ''
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(false)

    window.sortable(notConnectedUl, 'destroy')
    window.sortable(notConnectedUl, {
      acceptFrom: null
    })
    // test .sortable2 only accepts from .sortable3 (should be true)
    expect(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl)).toEqual(true)
    // test .sortable2 only accepts from .sortable3 (should be false)
    expect(window.sortable.__testing._listsConnected(connectedUl, connectedUl)).toEqual(false)
    // test .sortable3 does not accept from anyone (should be false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, connectedUl)).toEqual(false)
    expect(window.sortable.__testing._listsConnected(notConnectedUl, notConnectedUl)).toEqual(true)
  })

  test('_index', () => {
    let div = window.document.createElement('div')
    let child1 = window.document.createElement('div')
    let child2 = window.document.createElement('div')
    let child3 = window.document.createElement('div')
    let child4 = window.document.createElement('div')
    div.appendChild(child1)
    div.appendChild(child2)
    div.appendChild(child3)
    expect(window.sortable.__testing._index(child1)).toEqual(0)
    expect(window.sortable.__testing._index(child2)).toEqual(1)
    expect(window.sortable.__testing._index(child3)).toEqual(2)
    expect(window.sortable.__testing._index(child4)).toEqual(0)
  })

  test.skip('_debounce returns given function, when 0 debounce', () => {

  })

  test('_getHandles: gets handles array from items', () => {
    let handles = window.sortable.__testing._getHandles(allLiElements, '.handle')
    expect(handles.length).toEqual(2)
    expect(handles[0].outerHTML).toEqual('<span class="handle"></span>')
  })

  test('_getHandles: gets items if no handle selector is provided', () => {
    let handles = window.sortable.__testing._getHandles(allLiElements)
    expect(handles.length).toEqual(3)
    expect(handles[0].nodeName).toEqual('LI')
  })

  test.skip('_attached', () => {
  })
})
