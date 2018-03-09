/* global describe,test,expect,beforeEach,CustomEvent */
import sortable from '../src/html5sortable'
/* eslint-env jest */

jest.useFakeTimers()

describe('Testing events', () => {
  const { JSDOM } = require('jsdom')
  const documentHTML = `<!doctype html><html><head><style>
    html, body{
      margin: 0;
    }
    li{
      display: block;
      width: 100%;
      height: 25px;
      padding: 0;
    }
  <style></head><body><div id="root"></div></body></html>`
  global.document = new JSDOM(documentHTML)
  global.window = document.parentWindow
  global.body = global.document.querySelector('body')

  let getIndex = (item, NodeList) => Array.prototype.indexOf.call(NodeList, item)
  let ul, li, secondLi, ul2, fifthLi, fourthLi
  var sortstartitem, sortstartparent
  var sortupdateitem, sortupdateitemIndex, sortupdateitemOldindex, sortupdateitemElementIndex,
    sortupdateitemOldElementIndex, sortupdateitemStartparent, sortupdateitemEndparent,
    sortupdateitemNewEndList, sortupdateitemNewStartList, sortupdateitemOldStartList
  var sortstopitem, sortstopStartparent

  beforeEach(() => {
    global.body.innerHTML = `<ul class="sortable">
      <li class="item first-item">Item 1</li>
      <li class="item second-item">Item 2</li>
      <li class="item">Item 3</li>
      <li class="item fourth-item"><a href="#" class="handle"><span class='item4'>Item 4</span></a></li>
      <li class="item"><a href="#" class="notHandle">a clever ruse</a></li>
    </ul>
    <ul class="sortable2">
      <li class="item">Item</li>
      <li class="item fifth-item">Item 5</li>
    </ul>`

    ul = global.body.querySelector('.sortable')
    li = ul.querySelector('.first-item')
    secondLi = ul.querySelector('.second-item')
    fourthLi = ul.querySelector('.fourth-item')
    ul2 = global.body.querySelector('.sortable2')
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

    fourthLi.getClientRects = function () {
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

  function addEventListener (ul) {
    sortable(ul)[0].addEventListener('sortstart', function (e) {
      sortstartitem = e.detail.item
      sortstartparent = e.detail.startparent
    })
    sortable(ul)[0].addEventListener('sortupdate', function (e) {
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
    sortable(ul)[0].addEventListener('sortstop', function (e) {
      sortstopitem = e.detail.item
      sortstopStartparent = e.detail.startparent
    })
  }

  test('should correctly run dragstart event', () => {
    sortable(ul, {
      items: 'li',
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })

    addEventListener(ul)
    let event = new CustomEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    Object.defineProperty(event, 'target', {value: li, enumerable: true})
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')
    expect(li.classList.contains('test-dragging')).toBe(true)

    expect(sortstartitem).toEqual(li)
    expect(ul).toEqual(sortstartparent)
    expect(null).toEqual(sortupdateitem)
    expect(null).toEqual(sortstopitem)
  })

  test(
    'should correctly copy element on run dragstart/dragover event',
    () => {
      sortable(ul, {
        items: 'li',
        copy: true,
        connectWith: '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
      let childcount = li.parentNode.childNodes.length
      let event = new CustomEvent('dragstart')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      Object.defineProperty(event, 'target', {value: li, enumerable: true})
      ul.dispatchEvent(event)

      expect(li.getAttribute('aria-grabbed')).toEqual('false')

      let copyli = li.parentNode.lastChild
      expect(childcount + 1).toEqual(copyli.parentNode.childNodes.length)
      expect(copyli.getAttribute('aria-grabbed')).toEqual('true')
      expect(copyli.classList.contains('test-dragging')).toBe(true)

      event = new CustomEvent('dragover')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      secondLi.dispatchEvent(event)
      expect(event.dataTransfer.dropEffect).toEqual('copy')
    }
  )

  test('dragstart/dragover event with maxitems', () => {
    sortable(ul, {
      items: 'li',
      maxItems: 1,
      connectWith: '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let childcount = li.parentNode.childNodes.length
    let event = new CustomEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    Object.defineProperty(event, 'target', {value: li, enumerable: true})
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')

    let copyli = li.parentNode.lastChild
    expect(childcount).toEqual(copyli.parentNode.childNodes.length)
    expect(event.dataTransfer.dropEffect).toBe(undefined)
  })

  test('should not add class on hover event', () => {
    sortable(ul, {
      items: 'li',
      hoverClass: false
    })

    let event = new CustomEvent('mouseenter')
    li.dispatchEvent(event)
    expect(li.classList.contains('sortable-over')).toBe(false)
  })
  test('should correctly add class on hover event', () => {
    sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over'
    })
    // class is added on hover
    li.dispatchEvent(new CustomEvent('mouseenter'))
    expect(li.classList.contains('sortable-item-over')).toBe(true)
    // class is removed on leave
    li.dispatchEvent(new CustomEvent('mouseleave'))
    expect(li.classList.contains('sortable-item-over')).toBe(false)
  })

  test(
    'should correctly add and remove both classes on hover event',
    () => {
      sortable(ul, {
        'items': 'li',
        hoverClass: 'sortable-item-over sortable-item-over-second'
      })
      // classes are added on hover
      li.dispatchEvent(new CustomEvent('mouseenter'))
      expect(li.classList.contains('sortable-item-over')).toBe(true)
      expect(li.classList.contains('sortable-item-over-second')).toBe(true)
      // class are removed on leave
      li.dispatchEvent(new CustomEvent('mouseleave'))
      expect(li.classList.contains('sortable-item-over')).toBe(false)
      expect(li.classList.contains('sortable-item-over-second')).toBe(false)
    }
  )

  test.skip('should correctly place moved item into correct index', () => {
    sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    addEventListener(ul)
    let originalIndex = getIndex(li, ul.children)

    let event = new CustomEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    li.dispatchEvent(event)

    event = new CustomEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    expect(event.dataTransfer.dropEffect).toEqual('move')

    // Object.defineProperty(event, 'target', {value: secondLi, enumerable: true})
    sortable.__testing._getPlaceholders()[0].dispatchEvent(new CustomEvent('drop'))

    li.dispatchEvent(new CustomEvent('dragend'))

    expect(getIndex(li, ul.children)).not.toEqual(originalIndex)
    expect(getIndex(li, ul.children)).toEqual(1)

    expect(sortstartitem).toEqual(li)
    expect(ul).toEqual(sortstartparent)

    expect(li).toEqual(sortupdateitem)
    expect(1).toEqual(sortupdateitemIndex)
    expect(0).toEqual(sortupdateitemOldindex)
    expect(1).toEqual(sortupdateitemElementIndex)
    expect(0).toEqual(sortupdateitemOldElementIndex)
    expect(ul).toEqual(sortupdateitemStartparent)
    expect(ul).toEqual(sortupdateitemEndparent)
    expect(5).toEqual(sortupdateitemNewEndList.length)
    expect(5).toEqual(sortupdateitemNewStartList.length)
    expect(5).toEqual(sortupdateitemOldStartList.length)

    expect(sortstopitem).toEqual(li)
    expect(ul).toEqual(sortstopStartparent)
  })

  test.skip(
    'should correctly place moved item into correct index using acceptFrom',
    () => {
      sortable(ul, {
        items: 'li',
        acceptFrom: false,
        placeholderClass: 'test-placeholder'
      })

      sortable(ul2, {
        items: 'li',
        acceptFrom: '.sortable',
        placeholderClass: 'test-placeholder2'
      })

      // let originalChildrenLen = ul.children.length
      let originalIndex = getIndex(li, ul.children)

      let event = new CustomEvent('dragstart')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      li.dispatchEvent(event)

      event = new CustomEvent('dragover')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      fifthLi.dispatchEvent(event)

      expect(event.dataTransfer.dropEffect).toEqual('move')

      event = new CustomEvent('drop')

      ul2.querySelector('.test-placeholder2').dispatchEvent(event)

      event = new CustomEvent('dragend')
      li.dispatchEvent(event)

      expect(getIndex(li, ul.children)).not.toEqual(originalIndex)
      expect(getIndex(li, ul2.children)).toEqual(2)
    }
  )

  test.skip('should correctly place non-moved item into correct index', () => {
    sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    let originalIndex = getIndex(li, ul.children)

    let event = new CustomEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }

    li.dispatchEvent(event)
    expect(getIndex(sortable.__testing._getPlaceholders()[0], ul.children)).toEqual(-1)

    event = new CustomEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    expect(getIndex(sortable.__testing._getPlaceholders()[0], ul.children)).not.toEqual(originalIndex)

    secondLi.dispatchEvent(event)
    event = new CustomEvent('drop')
    sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    event = new CustomEvent('dragend')
    li.dispatchEvent(event)

    // TODO: does this test and this check make sense?
    expect(getIndex(li, ul.children)).toEqual(originalIndex)
  })

  test(
    'should revert item into correct index when dropped outside',
    () => {
      sortable(ul, {
        'items': 'li',
        placeholderClass: 'test-placeholder'
      })

      let originalIndex = getIndex(secondLi, ul.children)

      let event = new CustomEvent('dragstart')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }

      secondLi.dispatchEvent(event)
      expect(getIndex(sortable.__testing._getPlaceholders()[0], ul.children)).toEqual(-1)

      event = new CustomEvent('dragover')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      secondLi.dispatchEvent(event)
      expect(getIndex(sortable.__testing._getPlaceholders()[0], ul.children)).not.toEqual(originalIndex)

      global.body.dispatchEvent(event)

      event = new CustomEvent('drop')

      global.body.dispatchEvent(event)
      expect(getIndex(secondLi, ul.children)).toEqual(originalIndex)
    }
  )

  test('should find sortable child dragover event', () => {
    var item4 = ul.querySelector('.item4')
    sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let event = new CustomEvent('dragstart')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    Object.defineProperty(event, 'target', {value: li, enumerable: true})
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')

    event = new CustomEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    Object.defineProperty(event, 'target', {value: item4, enumerable: true})
    ul.dispatchEvent(event)
    jest.runOnlyPendingTimers()

    expect(event.dataTransfer.dropEffect).toEqual('move')
    expect(ul.querySelector('.test-placeholder')).not.toBe(undefined)
    expect(ul.querySelector('.test-placeholder')).not.toBe(null)
  })
})
