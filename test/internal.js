/* global $,describe,it,beforeEach */
describe('Internal function tests', function () {
  // testing basic api
  var assert = require('chai').assert
  global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
  global.window = global.document.defaultView
  global.$ = global.jQuery = require('../node_modules/jquery/dist/jquery.js')
  var sortable = require('../src/html.sortable.js')
  let $ul, $ul2, ul, li, $lis

  beforeEach(function () {
    $('body').html('').append(`<ul class="sortable">
      <li>
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
    </ul>`)
    $ul = $('.sortable')
    ul = $ul.get()
    sortable(ul, 'destroy')
    sortable(ul)
    $lis = $ul.find('li')
    li = $ul.find('li').first().get(0)
  })

  it('_removeSortableEvents', function () {
    // remove general jQuery event object
    sortable.__testing._removeSortableEvents(ul)
    assert.isUndefined(ul.h5s && ul.h5s.events)
    // remove individual events
    // need to add on click so that event object is not removed
    // when all sortable events are removed
    sortable(ul)
    sortable.__testing._removeSortableEvents(ul)
    assert.isFalse(((ul.h5s || {}).events || {}).hasOwnProperty('dragover'))
    assert.isFalse(((ul.h5s || {}).events || {}).hasOwnProperty('dragenter'))
    assert.isFalse(((ul.h5s || {}).events || {}).hasOwnProperty('drop'))
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
    sortable.__testing._removeSortableData($ul.get(0))

    assert.isUndefined(sortable.__testing._data($ul.get(0), 'opts'))
    assert.isUndefined(sortable.__testing._data($ul.get(0), 'connectWith'))
    assert.isUndefined(sortable.__testing._data($ul.get(0), 'items'))
    assert.isUndefined(sortable.__testing._data($ul.get(0), 'aria-dropeffect'))
  })

  it('_removeItemData', function () {
    // destroy, so it does not use old values
    sortable(ul, 'destroy')
    sortable(ul, {
      items: 'li',
      connectWith: '.test'
    })
    sortable.__testing._removeItemData($ul.find('li').get())
    var li = $ul.find('li').first()
    assert.isUndefined(li.attr('role'))
    assert.isUndefined(li.attr('draggable'))
    assert.isUndefined(li.attr('aria-grabbed'))
  })

  it('_listsConnected', function () {
    $('body').append('<ul class="sortable2"><li>item</li></ul>')
    $ul2 = $('.sortable2')
    sortable($ul2.get())
    // test same sortable
    assert.equal(sortable.__testing._listsConnected($ul.get(0), $ul.get(0)), true)
    // test different sortables without connect with
    assert.equal(sortable.__testing._listsConnected($ul.get(0), $ul2.get(0)), false)
    // test one list with connectWith & one without
    sortable(ul, 'destroy')
    sortable(ul, {
      connectWith: '.test'
    })
    assert.equal(sortable.__testing._listsConnected($ul.get(0), $ul2.get(0)), false)
    // test not matching connectWith
    sortable($ul2.get(), 'destroy')
    sortable($ul2.get(), {
      connectWith: '.test2'
    })
    assert.equal(sortable.__testing._listsConnected($ul.get(0), $ul2.get(0)), false)
    // test matching connectWith
    sortable($ul2.get(), 'destroy')
    sortable($ul2.get(), {
      connectWith: '.test'
    })
    assert.equal(sortable.__testing._listsConnected($ul.get(0), $ul2.get(0)), true)
  })

  it('_index', function () {
    var div = document.createElement('div')
    var child1 = document.createElement('div')
    var child2 = document.createElement('div')
    var child3 = document.createElement('div')
    var child4 = document.createElement('div')
    div.appendChild(child1)
    div.appendChild(child2)
    div.appendChild(child3)
    assert.equal(sortable.__testing._index(child1), 0)
    assert.equal(sortable.__testing._index(child2), 1)
    assert.equal(sortable.__testing._index(child3), 2)
    assert.equal(sortable.__testing._index(child4), 0)
  })

  it('_debounce returns given function, then 0 debounce', function () {
    var funct = function () {}
    var debounced = sortable.__testing._debounce(funct, 0)

    assert.equal(debounced, funct)
  })

  it('_debounce', function (done) {
    var funct = function () {
      done()
    }
    var debounced = sortable.__testing._debounce(funct, 5)

    debounced()
    debounced()
  })

  it('_getHandles: gets handles array from items', function () {
    let handles = sortable.__testing._getHandles($lis.get(), '.handle')
    assert.equal(handles.length, 2)
    assert.equal(handles[0].outerHTML, '<span class="handle"></span>')
  })

  it('_getHandles: gets items if no handle selector is provided', function () {
    let handles = sortable.__testing._getHandles($lis.get())
    assert.equal(handles.length, 3)
    assert.equal(handles[0].nodeName, 'LI')
  })

  it('_attached', function () {
    // let div = $('<div class="test" />')
    console.log('Test missing')
    // assert.equal(sortable.__testing._attached($lis.get(0)), true)
    // assert.equal(sortable.__testing._attached(div.get(0)), false)
  })
})
