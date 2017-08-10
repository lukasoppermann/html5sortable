/* global describe,it,afterEach */
describe('Testing ghost creation methods', function () {
// testing ghost creation functions
  let assert = require('chai').assert
  const { JSDOM } = require('jsdom')
  const helper = require('./helper')
  const sortable = helper.instrument('./src/html.sortable.js')
  // const sortable = require('fs').readFileSync('./src/html.sortable.js', { encoding: 'utf-8' })
  let window = (new JSDOM(``, { runScripts: 'dangerously' })).window
   // Execute my library by inserting a <script> tag containing it.
  const scriptEl = window.document.createElement('script')
  scriptEl.textContent = sortable
  window.document.head.appendChild(scriptEl)

  let body = window.document.body
  body.innerHTML = `<ul class="sortable"><li class="first">dragged item</li><li>item 2</li></ul>`
  // mock dragged item
  let draggedItem = body.querySelector('.first')
  draggedItem.getClientRects = function () {
    return [{
      left: 5,
      top: 5
    }]
  }
  // mock event
  let e = {
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

  afterEach(() => {
    helper.writeCoverage(window)
  })

  it('sets the dataTransfer options correctly (_attachGhost)', function () {
    window.sortable.__testing._attachGhost(e, {
      draggedItem: 'test-item',
      x: 10,
      y: 20
    })

    assert.equal(e.dataTransfer.effectAllowed, 'move')
    assert.equal(e.dataTransfer.text, 'arbitrary-content')
    assert.equal(e.dataTransfer.draggedItem, 'test-item')
    assert.equal(e.dataTransfer.x, 10)
    assert.equal(e.dataTransfer.y, 20)
  })

  it('sets item correctly from dragged item (_makeGhost)', function () {
    let ghost = window.sortable.__testing._makeGhost(draggedItem)
    assert.equal(ghost.draggedItem.innerHTML, draggedItem.innerHTML)
  })

  it('sets x & y correctly (_addGhostPos)', function () {
    let ghost = window.sortable.__testing._addGhostPos(e, {
      draggedItem: draggedItem
    })

    assert.equal(ghost.x, 95)
    assert.equal(ghost.y, 195)
  })

  it('uses provided x & y correctly (_addGhostPos)', function () {
    let ghost = window.sortable.__testing._addGhostPos(e, {
      draggedItem: draggedItem,
      x: 10,
      y: 20
    })

    assert.equal(ghost.x, 10)
    assert.equal(ghost.y, 20)
  })

  it('attaches ghost completely (_getGhost)', function () {
    window.sortable.__testing._getGhost(e, draggedItem)

    assert.equal(e.dataTransfer.effectAllowed, 'move')
    assert.equal(e.dataTransfer.text, 'arbitrary-content')
    assert.equal(e.dataTransfer.draggedItem, draggedItem)
    assert.equal(e.dataTransfer.x, 95)
    assert.equal(e.dataTransfer.y, 195)
  })
})
