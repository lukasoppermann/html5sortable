/* global describe,it,beforeEach,afterEach,before */
describe('Internal function tests', function () {
  // testing basic api
  let assert = require('chai').assert
  const { JSDOM } = require('jsdom')
  // const sortable = require('fs').readFileSync('./src/html.sortable.js', { encoding: 'utf-8' })
  const helper = require('./helper')
  const sortable = helper.instrument('./src/html.sortable.js')
  let window, body
  let ul, li, allLiElements

  before(() => {
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

  it('_removeSortableEvents', function () {
    // remove events object
    window.sortable.__testing._removeSortableEvents(ul)
    // check that events are gone
    assert.isUndefined(ul.h5s.events.dragover)
    assert.isUndefined(ul.h5s.events.dragenter)
    assert.isUndefined(ul.h5s.events.drop)
  })

  it('_removeItemEvents', function () {
    // remove general jQuery event object
    window.sortable.__testing._removeItemEvents(li)
    assert.deepEqual(li.h5s.events, {})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    window.sortable(ul)
    window.sortable.__testing._removeItemEvents(li)
    // test individual events
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('dragover'))
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('dragenter'))
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('drop'))
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('dragstart'))
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('dragend'))
    assert.isFalse((li.h5s.events || {}).hasOwnProperty('mousedown'))
  })

  it('_removeSortableData', function () {
    // destroy, so it does not use old values
    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    window.sortable.__testing._removeSortableData(ul)

    assert.isUndefined(window.sortable.__testing._data(ul, 'opts'))
    assert.isUndefined(window.sortable.__testing._data(ul, 'connectWith'))
    assert.isUndefined(window.sortable.__testing._data(ul, 'items'))
    assert.isUndefined(window.sortable.__testing._data(ul, 'aria-dropeffect'))
  })

  it('_removeItemData', function () {
    // destroy, so it does not use old values
    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    window.sortable.__testing._removeItemData(li)
    assert.isNull(li.getAttribute('role'))
    assert.isNull(li.getAttribute('draggable'))
    assert.isNull(li.getAttribute('aria-grabbed'))
  })

  it('_listsConnected', function () {
    // add second sortable (not connected yet!)
    body.innerHTML = `<ul class="sortable2"><li>item</li></ul><ul class="sortable3"><li>item</li></ul>`
    let connectedUl = body.querySelector('.sortable2')
    let notConnectedUl = body.querySelector('.sortable3')
    window.sortable(connectedUl, {
      connectWith: '.sortable'
    })
    window.sortable(notConnectedUl)
    // test if sortable is connected to itself (should be true)
    assert.equal(window.sortable.__testing._listsConnected(ul, ul), true)
    // test if sortable is connected to sortable2 (should be false)
    assert.equal(window.sortable.__testing._listsConnected(ul, connectedUl), false)
    // test if sortable2 is connected to sortable (should be false)
    assert.equal(window.sortable.__testing._listsConnected(connectedUl, ul), false)
    // test if sortable2 is connected to sortable3 (should be false)
    assert.equal(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl), false)
    // test if .sortable is connected to sortable3 (should be false)
    assert.equal(window.sortable.__testing._listsConnected(ul, notConnectedUl), false)

    window.sortable(ul, 'destroy')
    window.sortable(ul, {
      connectWith: '.sortable'
    })
    // test if sortables are connected (should be true)
    assert.equal(window.sortable.__testing._listsConnected(connectedUl, ul), true)
    assert.equal(window.sortable.__testing._listsConnected(ul, connectedUl), true)
    // test if sortable2 is connected to sortable3 (should be false)
    assert.equal(window.sortable.__testing._listsConnected(connectedUl, notConnectedUl), false)
  })

  it('_index', function () {
    let div = window.document.createElement('div')
    let child1 = window.document.createElement('div')
    let child2 = window.document.createElement('div')
    let child3 = window.document.createElement('div')
    let child4 = window.document.createElement('div')
    div.appendChild(child1)
    div.appendChild(child2)
    div.appendChild(child3)
    assert.equal(window.sortable.__testing._index(child1), 0)
    assert.equal(window.sortable.__testing._index(child2), 1)
    assert.equal(window.sortable.__testing._index(child3), 2)
    assert.equal(window.sortable.__testing._index(child4), 0)
  })

  it('_debounce returns given function, when 0 debounce', function () {
    let funct = function () {}
    let debounced = window.sortable.__testing._debounce(funct, 0)

    assert.equal(debounced, funct)
  })

  it('_getHandles: gets handles array from items', function () {
    let handles = window.sortable.__testing._getHandles(allLiElements, '.handle')
    assert.equal(handles.length, 2)
    assert.equal(handles[0].outerHTML, '<span class="handle"></span>')
  })

  it('_getHandles: gets items if no handle selector is provided', function () {
    let handles = window.sortable.__testing._getHandles(allLiElements)
    assert.equal(handles.length, 3)
    assert.equal(handles[0].nodeName, 'LI')
  })

  it('_attached', function () {
    console.log('Test missing')
  })
})
