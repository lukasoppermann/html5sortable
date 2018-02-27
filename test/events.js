/* global describe,it,beforeEach,afterEach */
describe('Testing events', function () {
  // testing basic api
  let assert = require('chai').assert
  const { JSDOM } = require('jsdom')
  // const sortable = require('fs').readFileSync('./src/html5sortable.js', { encoding: 'utf-8' })
  const helper = require('./helper')
  const sortable = helper.instrument('./_test/html5sortable.js')
  let window, body

  let getIndex = (item, NodeList) => Array.prototype.indexOf.call(NodeList, item)
  let ul, li, secondLi, ul2, fifthLi
  var sortstartitem, sortstartparent
  var sortupdateitem, sortupdateitemIndex, sortupdateitemOldindex, sortupdateitemElementIndex,
    sortupdateitemOldElementIndex, sortupdateitemStartparent, sortupdateitemEndparent,
    sortupdateitemNewEndList, sortupdateitemNewStartList, sortupdateitemOldStartList
  var sortstopitem, sortstopStartparent

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
    </ul>
    <ul class="sortable2">
      <li class="item">Item</li>
      <li class="item fifth-item">Item 5</li>
    </ul>`

    ul = body.querySelector('.sortable')
    li = ul.querySelector('.first-item')
    secondLi = ul.querySelector('.second-item')
    ul2 = body.querySelector('.sortable2')
    fifthLi = ul2.querySelector('.fifth-item')

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

    sortstartitem = null
    sortstartparent = null

    sortupdateitem = null
    sortupdateitemIndex = null
    sortupdateitemOldindex = null
    sortupdateitemElementIndex = null
    sortupdateitemOldElementIndex = null
    sortupdateitemStartparent = null
    sortupdateitemEndparent = null
    sortupdateitemNewEndList = null
    sortupdateitemNewStartList = null
    sortupdateitemOldStartList = null

    sortstopitem = null
    sortstopStartparent = null
  })

  afterEach(() => {
    helper.writeCoverage(window)
  })

  function addEventListener (ul) {
    window.sortable(ul)[0].addEventListener('sortstart', function (e) {
      sortstartitem = e.detail.item
      sortstartparent = e.detail.startparent
    })
    window.sortable(ul)[0].addEventListener('sortupdate', function (e) {
      sortupdateitem = e.detail.item
      sortupdateitemIndex = e.detail.index
      sortupdateitemOldindex = e.detail.oldindex
      sortupdateitemElementIndex = e.detail.elementIndex
      sortupdateitemOldElementIndex = e.detail.oldElementIndex
      sortupdateitemStartparent = e.detail.startparent
      sortupdateitemEndparent = e.detail.endparent
      sortupdateitemNewEndList = e.detail.newEndList
      sortupdateitemNewStartList = e.detail.newStartList
      sortupdateitemOldStartList = e.detail.oldStartList
    })
    window.sortable(ul)[0].addEventListener('sortstop', function (e) {
      sortstopitem = e.detail.item
      sortstopStartparent = e.detail.startparent
    })
  }
  it('should correctly run dragstart event', function () {
    window.sortable(ul, {
      items: 'li',
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })

    addEventListener(ul)
    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    assert.equal(li.getAttribute('aria-grabbed'), 'true')
    assert.isTrue(li.classList.contains('test-dragging'))

    assert.equal(sortstartitem, li)
    assert.equal(ul, sortstartparent)
    assert.equal(null, sortupdateitem)
    assert.equal(null, sortstopitem)
  })

  it('should correctly copy element on run dragstart/dragover event', function () {
    window.sortable(ul, {
      items: 'li',
      copy: true,
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let childcount = li.parentNode.childNodes.length
    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    assert.equal(li.getAttribute('aria-grabbed'), 'false')

    let copyli = li.parentNode.lastChild
    assert.equal(childcount + 1, copyli.parentNode.childNodes.length)
    assert.equal(copyli.getAttribute('aria-grabbed'), 'true')
    assert.isTrue(copyli.classList.contains('test-dragging'))

    event = window.sortable.__testing._makeEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    assert.equal(event.dataTransfer.dropEffect, 'copy')
  })

  it('dragstart/dragover event with maxitems', function () {
    window.sortable(ul, {
      items: 'li',
      maxItems: 1,
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let childcount = li.parentNode.childNodes.length
    let event = window.sortable.__testing._makeEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    assert.equal(li.getAttribute('aria-grabbed'), 'true')

    let copyli = li.parentNode.lastChild
    assert.equal(childcount, copyli.parentNode.childNodes.length)
    assert.strictEqual(event.dataTransfer.dropEffect, undefined)
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
    this.skip('Is probably testing the wrong thing')
    window.sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    addEventListener(ul)
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
    assert.equal(event.dataTransfer.dropEffect, 'move')

    event = window.sortable.__testing._makeEvent('drop')
    // Object.defineProperty(event, 'target', {value: secondLi, enumerable: true})
    window.sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('dragend')
    li.dispatchEvent(event)

    assert.notEqual(getIndex(li, ul.children), originalIndex)
    assert.equal(getIndex(li, ul.children), 1)

    assert.equal(sortstartitem, li)
    assert.equal(ul, sortstartparent)

    assert.equal(li, sortupdateitem)
    assert.equal(1, sortupdateitemIndex)
    assert.equal(0, sortupdateitemOldindex)
    assert.equal(1, sortupdateitemElementIndex)
    assert.equal(0, sortupdateitemOldElementIndex)
    assert.equal(ul, sortupdateitemStartparent)
    assert.equal(ul, sortupdateitemEndparent)
    assert.equal(5, sortupdateitemNewEndList.length)
    assert.equal(5, sortupdateitemNewStartList.length)
    assert.equal(5, sortupdateitemOldStartList.length)

    assert.equal(sortstopitem, li)
    assert.equal(ul, sortstopStartparent)
  })

  it('should correctly place moved item into correct index using acceptFrom', function () {
    this.skip('Is probably testing the wrong thing')
    window.sortable(ul, {
      items: 'li',
      acceptFrom: false,
      placeholderClass: 'test-placeholder'
    })

    window.sortable(ul2, {
      items: 'li',
      acceptFrom: '.sortable',
      placeholderClass: 'test-placeholder2'
    })

    // let originalChildrenLen = ul.children.length
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
    fifthLi.dispatchEvent(event)

    assert.equal(event.dataTransfer.dropEffect, 'move')

    event = window.sortable.__testing._makeEvent('drop')

    ul2.querySelector('.test-placeholder2').dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('dragend')
    li.dispatchEvent(event)

    assert.notEqual(getIndex(li, ul.children), originalIndex)
    assert.equal(getIndex(li, ul2.children), 2)
  })

  it('should correctly place non-moved item into correct index', function () {
    this.skip('Is probably testing the wrong thing')
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

    event = window.sortable.__testing._makeEvent('dragend')
    li.dispatchEvent(event)

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
