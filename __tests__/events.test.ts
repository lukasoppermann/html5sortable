/* global describe,it,beforeEach,afterEach */
describe('Testing events', () => {
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

  beforeEach(() => {
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
  test('should correctly run dragstart event', () => {
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

      expect(li.getAttribute('aria-grabbed')).toEqual('false')

      let copyli = li.parentNode.lastChild
      expect(childcount + 1).toEqual(copyli.parentNode.childNodes.length)
      expect(copyli.getAttribute('aria-grabbed')).toEqual('true')
      expect(copyli.classList.contains('test-dragging')).toBe(true)

      event = window.sortable.__testing._makeEvent('dragover')
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

    expect(li.getAttribute('aria-grabbed')).toEqual('true')

    let copyli = li.parentNode.lastChild
    expect(childcount).toEqual(copyli.parentNode.childNodes.length)
    expect(event.dataTransfer.dropEffect).toBe(undefined)
  })

  test('should not add class on hover event', () => {
    window.sortable(ul, {
      items: 'li',
      hoverClass: false
    })

    let event = window.sortable.__testing._makeEvent('mouseenter')
    li.dispatchEvent(event)
    expect(li.classList.contains('sortable-over')).toBe(false)
  })
  test('should correctly add class on hover event', () => {
    window.sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over'
    })
    // class is added on hover
    li.dispatchEvent(window.sortable.__testing._makeEvent('mouseenter'))
    expect(li.classList.contains('sortable-item-over')).toBe(true)
    // class is removed on leave
    li.dispatchEvent(window.sortable.__testing._makeEvent('mouseleave'))
    expect(li.classList.contains('sortable-item-over')).toBe(false)
  })

  test(
    'should correctly add and remove both classes on hover event',
    () => {
      window.sortable(ul, {
        'items': 'li',
        hoverClass: 'sortable-item-over sortable-item-over-second'
      })
      // classes are added on hover
      li.dispatchEvent(window.sortable.__testing._makeEvent('mouseenter'))
      expect(li.classList.contains('sortable-item-over')).toBe(true)
      expect(li.classList.contains('sortable-item-over-second')).toBe(true)
      // class are removed on leave
      li.dispatchEvent(window.sortable.__testing._makeEvent('mouseleave'))
      expect(li.classList.contains('sortable-item-over')).toBe(false)
      expect(li.classList.contains('sortable-item-over-second')).toBe(false)
    }
  )

  test.skip('should correctly place moved item into correct index', () => {
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
    expect(event.dataTransfer.dropEffect).toEqual('move')

    event = window.sortable.__testing._makeEvent('drop')
    // Object.defineProperty(event, 'target', {value: secondLi, enumerable: true})
    window.sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('dragend')
    li.dispatchEvent(event)

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

      expect(event.dataTransfer.dropEffect).toEqual('move')

      event = window.sortable.__testing._makeEvent('drop')

      ul2.querySelector('.test-placeholder2').dispatchEvent(event)

      event = window.sortable.__testing._makeEvent('dragend')
      li.dispatchEvent(event)

      expect(getIndex(li, ul.children)).not.toEqual(originalIndex)
      expect(getIndex(li, ul2.children)).toEqual(2)
    }
  )

  test.skip('should correctly place non-moved item into correct index', () => {
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
    expect(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children)).toEqual(-1)

    event = window.sortable.__testing._makeEvent('dragover')
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    secondLi.dispatchEvent(event)
    expect(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children)).not.toEqual(originalIndex)

    secondLi.dispatchEvent(event)
    event = window.sortable.__testing._makeEvent('drop')
    window.sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    event = window.sortable.__testing._makeEvent('dragend')
    li.dispatchEvent(event)

    // TODO: does this test and this check make sense?
    expect(getIndex(li, ul.children)).toEqual(originalIndex)
  })

  test(
    'should revert item into correct index when dropped outside',
    () => {
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
      expect(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children)).toEqual(-1)

      event = window.sortable.__testing._makeEvent('dragover')
      event.dataTransfer = {
        setData: function (val) {
          this.data = val
        }
      }
      secondLi.dispatchEvent(event)
      expect(getIndex(window.sortable.__testing._getPlaceholders()[0], ul.children)).not.toEqual(originalIndex)

      body.dispatchEvent(event)

      event = window.sortable.__testing._makeEvent('drop')

      body.dispatchEvent(event)
      expect(getIndex(secondLi, ul.children)).toEqual(originalIndex)
    }
  )
})
