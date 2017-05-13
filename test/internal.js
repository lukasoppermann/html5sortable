/* global describe,it,beforeEach */
describe('Internal function tests', function () {
  // testing basic api
  let assert = require('chai').assert
  global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
  global.window = global.document.defaultView
  let body = global.document.querySelector('body')
  let sortable = require('../src/html.sortable.js')
  let ul, li, allLiElements

  beforeEach(function () {
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
    // select sortable
    ul = body.querySelector('.sortable')
    // destroy sortable to not have any config leftovers
    sortable(ul, 'destroy')
    // init sortable
    sortable(ul)
    // get all li elements
    allLiElements = ul.querySelectorAll('li')
    // get first li element
    li = ul.querySelector('.li-first')
  })

  it('_removeSortableEvents', function () {
    // remove events object
    sortable.__testing._removeSortableEvents(ul)
    // check that events are gone
    assert.isUndefined(ul.h5s.events.dragover)
    assert.isUndefined(ul.h5s.events.dragenter)
    assert.isUndefined(ul.h5s.events.drop)
  })

  it('_removeItemEvents', function () {
    // remove general jQuery event object
    sortable.__testing._removeItemEvents(li)
    assert.deepEqual(li.h5s.events, {})
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    sortable(ul)
    sortable.__testing._removeItemEvents(li)
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
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeSortableData(ul)

    assert.isUndefined(sortable.__testing._data(ul, 'opts'))
    assert.isUndefined(sortable.__testing._data(ul, 'connectWith'))
    assert.isUndefined(sortable.__testing._data(ul, 'items'))
    assert.isUndefined(sortable.__testing._data(ul, 'aria-dropeffect'))
  })

  it('_removeItemData', function () {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeItemData(li)
    assert.isNull(li.getAttribute('role'))
    assert.isNull(li.getAttribute('draggable'))
    assert.isNull(li.getAttribute('aria-grabbed'))
  })

  it('_listsConnected', function () {
    // add second sortable (not connected yet!)
    body.innerHTML = `<ul class="sortable2"><li>item</li></ul><ul class="sortable3"><li>item</li></ul>`
    let connectedUl = body.querySelector('.sortable2')
    let notConnectedUl = body.querySelector('.sortable3')
    sortable(connectedUl, {
      connectWith: '.sortable'
    })
    sortable(notConnectedUl)
    // test if sortable is connected to itself (should be true)
    assert.equal(sortable.__testing._listsConnected(ul, ul), true)
    // test if sortable is connected to sortable2 (should be false)
    assert.equal(sortable.__testing._listsConnected(ul, connectedUl), false)
    // test if sortable2 is connected to sortable (should be false)
    assert.equal(sortable.__testing._listsConnected(connectedUl, ul), false)
    // test if sortable2 is connected to sortable3 (should be false)
    assert.equal(sortable.__testing._listsConnected(connectedUl, notConnectedUl), false)
    // test if .sortable is connected to sortable3 (should be false)
    assert.equal(sortable.__testing._listsConnected(ul, notConnectedUl), false)

    sortable(ul, 'destroy')
    sortable(ul, {
      connectWith: '.sortable'
    })
    // test if sortables are connected (should be true)
    assert.equal(sortable.__testing._listsConnected(connectedUl, ul), true)
    assert.equal(sortable.__testing._listsConnected(ul, connectedUl), true)
    // test if sortable2 is connected to sortable3 (should be false)
    assert.equal(sortable.__testing._listsConnected(connectedUl, notConnectedUl), false)
  })

  it('_index', function () {
    let div = document.createElement('div')
    let child1 = document.createElement('div')
    let child2 = document.createElement('div')
    let child3 = document.createElement('div')
    let child4 = document.createElement('div')
    div.appendChild(child1)
    div.appendChild(child2)
    div.appendChild(child3)
    assert.equal(sortable.__testing._index(child1), 0)
    assert.equal(sortable.__testing._index(child2), 1)
    assert.equal(sortable.__testing._index(child3), 2)
    assert.equal(sortable.__testing._index(child4), 0)
  })

  it('_debounce returns given function, when 0 debounce', function () {
    let funct = function () {}
    let debounced = sortable.__testing._debounce(funct, 0)

    assert.equal(debounced, funct)
  })

  it('_getHandles: gets handles array from items', function () {
    let handles = sortable.__testing._getHandles(allLiElements, '.handle')
    assert.equal(handles.length, 2)
    assert.equal(handles[0].outerHTML, '<span class="handle"></span>')
  })

  it('_getHandles: gets items if no handle selector is provided', function () {
    let handles = sortable.__testing._getHandles(allLiElements)
    assert.equal(handles.length, 3)
    assert.equal(handles[0].nodeName, 'LI')
  })

  it('_attached', function () {
    console.log('Test missing')
  })
})
