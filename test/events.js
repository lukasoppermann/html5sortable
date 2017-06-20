/* global describe,it,beforeEach,afterEach */
describe('Testing events', function () {
  // testing basic api
  let assert = require('chai').assert
  const { JSDOM } = require('jsdom')
  // const sortable = require('fs').readFileSync('./src/html.sortable.js', { encoding: 'utf-8' })
  const helper = require('./helper')
  const sortable = helper.instrument('./src/html.sortable.js')
  let window, body

  let getIndex = (item, NodeList) => Array.prototype.indexOf.call(NodeList, item)
  let ul, li, secondLi

  beforeEach(function () {
    window = (new JSDOM(``, { runScripts: 'dangerously' })).window
    body = window.document.body

    window = (new JSDOM(`<style>
      html, body{
        margin: 0;
      }
      li{
        display: block;
        width: 100%;
        height: 25px;
        padding: 0;
      }
    <style>`, { runScripts: 'dangerously' })).window
    // Execute my library by inserting a <script> tag containing it.
    const scriptEl = window.document.createElement('script')
    scriptEl.textContent = sortable
    window.document.head.appendChild(scriptEl)

    body.innerHTML = `<ul class="sortable">
      <li class="item first-item">Item 1</li>
      <li class="item second-item">Item 2</li>
      <li class="item">Item 3</li>
      <li class="item"><a href="#" class="handle">Item 4</a></li>
      <li class="item"><a href="#" class="notHandle">a clever ruse</a></li>
    </ul>`

    ul = body.querySelector('.sortable')
    li = ul.querySelector('.first-item')
    secondLi = ul.querySelector('.second-item')

    li.getClientRects = function () {
      return [{
        left: 5,
        top: 5
      }]
    }

    secondLi.getClientRects = function () {
      return [{
        left: 5,
        top: 25
      }]
    }
  })

  afterEach(() => {
    helper.writeCoverage(window)
  })

  it('should correctly run dragstart event', function () {
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    assert.equal(li.getAttribute('aria-grabbed'), 'true')
    assert.isTrue(li.classList.contains('test-dragging'))
  })

  it('should not add class on hover event', function () {
    window.sortable(ul, {
      items: 'li',
      hoverClass: false
    })

    let event = window.sortable.__testing._makeEvent('mouseenter')
    li.dispatchEvent(event)
    assert.isFalse(li.classList.contains('sortable-over'))
  })

  it('should correctly add class on hover event', function () {
    window.sortable(ul, {
      'items': 'li',
      hoverClass: true
    })
    li.dispatchEvent(window.sortable.__testing._makeEvent('mouseenter'))
    assert.isTrue(li.classList.contains('sortable-over'))
    li.dispatchEvent(window.sortable.__testing._makeEvent('mouseleave'))
    assert.isFalse(li.classList.contains('sortable-over'))
  })

  it('should correctly add class on hover event', function () {
    window.sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over'
    })
    li.dispatchEvent(window.sortable.__testing._makeEvent('mouseenter'))
    assert.isTrue(li.classList.contains('sortable-item-over'))
  })

  it('should correctly place moved item into correct index', function () {
    window.sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    let originalIndex = getIndex(li, ul.children)

    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('drop')

    window.sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    assert.notEqual(getIndex(li, ul.children), originalIndex)
    assert.equal(getIndex(li, ul.children), 1)
  })

  it('should correctly place non-moved item into correct index', function () {
    window.sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    let originalIndex = getIndex(li, ul.children)

    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }

    li.dispatchEvent(event)
    assert.equal(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children), -1)

    event = window.sortable.__testing._makeEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    assert.notEqual(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children), originalIndex)

    secondLi.dispatchEvent(event)
    event = window.sortable.__testing._makeEvent('drop')
    window.sortable.__testing._getPlaceholders()[0].dispatchEvent(event)
    // TODO: does this test and this check make sense?
    assert.equal(getIndex(li, ul.children), originalIndex)
  })

  it('should revert item into correct index when dropped outside', function () {
    window.sortable(ul, {
      'items': 'li',
      placeholderClass: 'test-placeholder'
    })

    let originalIndex = getIndex(secondLi, ul.children)

    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }

    secondLi.dispatchEvent(event)
    assert.equal(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children), -1)

    event = window.sortable.__testing._makeEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    assert.notEqual(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children), originalIndex)

    body.dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('drop')

    body.dispatchEvent(event)
    assert.equal(getIndex(secondLi, ul.children), originalIndex)
  })
})
