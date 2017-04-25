/* global $,describe,it */
describe('Testing ghost creation methods', function () {
// testing ghost creation functions
  var assert = require('chai').assert
  global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
  global.window = global.document.defaultView
  global.$ = global.jQuery = require('../node_modules/jquery/dist/jquery.js')
  var sortable = require('../src/html.sortable.js')
  $('body').html('').append('<ul class="sortable"><li>item</li></ul>')
  // moch dragged item
  var dItem = $('<li>dItem Test</li>')
  dItem.get(0).getClientRects = function () {
    return [{
      left: 5,
      top: 5
    }]
  }
  // mock event
  var e = {
    pageX: 100,
    pageY: 200,
    dataTransfer: {
      text: undefined,
      draggedItem: undefined,
      x: undefined,
      y: undefined,
      setData: function (type, val) {
        e.dataTransfer[type] = val
      },
      setDragImage: function (draggedItem, x, y) {
        e.dataTransfer.draggedItem = draggedItem
        e.dataTransfer.x = x
        e.dataTransfer.y = y
      }
    }
  }

  it('sets the dataTransfer options correctly (_attachGhost)', function () {
    sortable.__testing._attachGhost(e, {
      draggedItem: 'test-item',
      x: 10,
      y: 20
    })

    assert.equal(e.dataTransfer.effectAllowed, 'move')
    assert.equal(e.dataTransfer.text, '')
    assert.equal(e.dataTransfer.draggedItem, 'test-item')
    assert.equal(e.dataTransfer.x, 10)
    assert.equal(e.dataTransfer.y, 20)
  })

  it('sets item correctly from dragged item (_makeGhost)', function () {
    var ghost = sortable.__testing._makeGhost(dItem)
    assert.equal(ghost.draggedItem.get(0).innerHTML, dItem.get(0).innerHTML)
  })

  it('sets x & y correctly (_addGhostPos)', function () {
    var ghost = sortable.__testing._addGhostPos(e, {
      draggedItem: dItem.get(0)
    })

    assert.equal(ghost.x, 95)
    assert.equal(ghost.y, 195)
  })

  it('uses provided x & y correctly (_addGhostPos)', function () {
    var ghost = sortable.__testing._addGhostPos(e, {
      draggedItem: dItem,
      x: 10,
      y: 20
    })

    assert.equal(ghost.x, 10)
    assert.equal(ghost.y, 20)
  })

  it('attaches ghost completely (_getGhost)', function () {
    sortable.__testing._getGhost(e, dItem.get(0))

    assert.equal(e.dataTransfer.effectAllowed, 'move')
    assert.equal(e.dataTransfer.text, '')
    assert.equal(e.dataTransfer.draggedItem, dItem.get(0))
    assert.equal(e.dataTransfer.x, 95)
    assert.equal(e.dataTransfer.y, 195)
  })
})
