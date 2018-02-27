/* global describe,it,afterEach */
describe('Testing ghost creation methods', () => {
  const { JSDOM } = require('jsdom')
  const helper = require('./helper')
  const sortable = helper.instrument('./_test/html5sortable.js')
  // const sortable = require('fs').readFileSync('./src/html5sortable.js', { encoding: 'utf-8' })
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

  test('sets the dataTransfer options correctly (_attachGhost)', () => {
    window.sortable.__testing._attachGhost(e, {
      draggedItem: 'test-item',
      x: 10,
      y: 20
    })

    expect(e.dataTransfer.effectAllowed).toEqual('copyMove')
    expect(e.dataTransfer.text).toEqual('arbitrary-content')
    expect(e.dataTransfer.draggedItem).toEqual('test-item')
    expect(e.dataTransfer.x).toEqual(10)
    expect(e.dataTransfer.y).toEqual(20)
  })

  test('sets item correctly from dragged item (_makeGhost)', () => {
    let ghost = window.sortable.__testing._makeGhost(draggedItem)
    expect(ghost.draggedItem.innerHTML).toEqual(draggedItem.innerHTML)
  })

  test('sets x & y correctly (_addGhostPos)', () => {
    let ghost = window.sortable.__testing._addGhostPos(e, {
      draggedItem: draggedItem
    })

    expect(ghost.x).toEqual(95)
    expect(ghost.y).toEqual(195)
  })

  test('uses provided x & y correctly (_addGhostPos)', () => {
    let ghost = window.sortable.__testing._addGhostPos(e, {
      draggedItem: draggedItem,
      x: 10,
      y: 20
    })

    expect(ghost.x).toEqual(10)
    expect(ghost.y).toEqual(20)
  })

  test('attaches ghost completely (_getGhost)', () => {
    window.sortable.__testing._getGhost(e, draggedItem)

    expect(e.dataTransfer.effectAllowed).toEqual('copyMove')
    expect(e.dataTransfer.text).toEqual('arbitrary-content')
    expect(e.dataTransfer.draggedItem).toEqual(draggedItem)
    expect(e.dataTransfer.x).toEqual(95)
    expect(e.dataTransfer.y).toEqual(195)
  })
})
