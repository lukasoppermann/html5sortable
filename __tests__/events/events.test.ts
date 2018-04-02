/* global describe,test,expect,beforeEach,CustomEvent */
import sortable from '../../src/html5sortable'
/* eslint-env jest */

describe('Testing events', () => {
  let body = document.querySelector('body')

  let getIndex = (item, NodeList) => Array.prototype.indexOf.call(NodeList, item)
  let ul, li, secondLi, ul2, fifthLi, fourthLi
  let startEventOriginItem, startEventOriginContainer
  let sortupdateitem, sortupdateitemEndIndex, sortupdateitemStartIndex, sortupdateitemStartSortableIndex,
    sortupdateitemEndSortableIndex, sortupdateitemStartParent, sortupdateitemEndParent,
    sortupdateitemNewEndList, sortupdateitemNewStartList, sortupdateitemOldStartList
  let sortstopitem, sortstopStartparent

  let dataTransferObj

  beforeEach(() => {
    body.innerHTML = `<ul class="sortable">
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

    ul = body.querySelector('.sortable')
    li = ul.querySelector('.first-item')
    secondLi = ul.querySelector('.second-item')
    fourthLi = ul.querySelector('.fourth-item')
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

    fourthLi.getClientRects = function () {
      return [{
        left: 5,
        top: 25
      }]
    }

    startEventOriginItem = null
    startEventOriginContainer = null

    sortupdateitem = null
    sortupdateitemEndIndex = null
    sortupdateitemStartIndex = null
    sortupdateitemStartSortableIndex = null
    sortupdateitemEndSortableIndex = null
    sortupdateitemStartParent = null
    sortupdateitemEndParent = null
    sortupdateitemNewEndList = null
    sortupdateitemNewStartList = null
    sortupdateitemOldStartList = null

    sortstopitem = null
    sortstopStartparent = null

    dataTransferObj = {
      setData: function (val) {
        this.data = val
      }
    }
  })

  function addEventListener (ul) {
    sortable(ul, null)[0].addEventListener('sortstart', function (e) {
      startEventOriginItem = e.detail.item
      startEventOriginContainer = e.detail.origin.container
    })
    sortable(ul, null)[0].addEventListener('sortupdate', function (e) {
      sortupdateitem = e.detail.item
      sortupdateitemEndIndex = e.detail.endSortableIndex
      sortupdateitemStartIndex = e.detail.startSortableIndex
      sortupdateitemStartSortableIndex = e.detail.endIndex
      sortupdateitemEndSortableIndex = e.detail.startIndex
      sortupdateitemStartParent = e.detail.startParent
      sortupdateitemEndParent = e.detail.endParent
      sortupdateitemNewEndList = e.detail.newEndList
      sortupdateitemNewStartList = e.detail.newStartList
      sortupdateitemOldStartList = e.detail.oldStartList
    })
    sortable(ul, null)[0].addEventListener('sortstop', function (e) {
      sortstopitem = e.detail.item
      sortstopStartparent = e.detail.startParent
    })
  }

  test('should correctly run dragstart event', () => {
    sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })

    addEventListener(ul)
    let event = new CustomEvent('dragstart')
    event.dataTransfer = dataTransferObj
    Object.defineProperty(event, 'target', { value: li, enumerable: true })
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')
    expect(li.classList.contains('test-dragging')).toBe(true)

    expect(startEventOriginItem).toEqual(li)
    expect(ul).toEqual(startEventOriginContainer)
    expect(null).toEqual(sortupdateitem)
    expect(null).toEqual(sortstopitem)
  })

  test('should correctly copy element on run dragstart/dragover event',
    () => {
      sortable(ul, {
        items: 'li',
        copy: true,
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
      let childcount = li.parentNode.childNodes.length
      let event = new CustomEvent('dragstart')
      event.dataTransfer = dataTransferObj
      Object.defineProperty(event, 'target', { value: li, enumerable: true })
      ul.dispatchEvent(event)

      expect(li.getAttribute('aria-grabbed')).toEqual('false')

      let copyli = li.parentNode.lastChild
      expect(childcount + 1).toEqual(copyli.parentNode.childNodes.length)
      expect(copyli.getAttribute('aria-grabbed')).toEqual('true')
      expect(copyli.classList.contains('test-dragging')).toBe(true)

      event = new CustomEvent('dragover')
      event.dataTransfer = dataTransferObj
      secondLi.dispatchEvent(event)
      expect(event.dataTransfer.dropEffect).toEqual('copy')
    }
  )

  test('dragstart/dragover event with maxitems', () => {
    sortable(ul, {
      items: 'li',
      maxItems: 1,
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let childcount = li.parentNode.childNodes.length
    let event = new CustomEvent('dragstart')
    event.dataTransfer = dataTransferObj
    Object.defineProperty(event, 'target', { value: li, enumerable: true })
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')

    let copyli = li.parentNode.lastChild
    expect(childcount).toEqual(copyli.parentNode.childNodes.length)
    expect(event.dataTransfer.dropEffect).toBe(undefined)
  })

  test.skip('should correctly place moved item into correct index', () => {
    sortable(ul, {
      items: 'li',
      placeholderClass: 'test-placeholder'
    })

    addEventListener(ul)
    let originalIndex = getIndex(li, ul.children)

    let event = new CustomEvent('dragstart')
    event.dataTransfer = dataTransferObj
    li.dispatchEvent(event)

    event = new CustomEvent('dragover')
    event.dataTransfer = dataTransferObj
    secondLi.dispatchEvent(event)
    expect(event.dataTransfer.dropEffect).toEqual('move')

    // Object.defineProperty(event, 'target', {value: secondLi, enumerable: true})
    document.querySelector('.test-placeholder').dispatchEvent(new CustomEvent('drop'))

    li.dispatchEvent(new CustomEvent('dragend'))

    expect(getIndex(li, ul.children)).not.toEqual(originalIndex)
    expect(getIndex(li, ul.children)).toEqual(1)

    expect(startEventOriginItem).toEqual(li)
    expect(ul).toEqual(startEventOriginContainer)

    expect(li).toEqual(sortupdateitem)
    expect(1).toEqual(sortupdateitemEndIndex)
    expect(0).toEqual(sortupdateitemStartIndex)
    expect(1).toEqual(sortupdateitemStartSortableIndex)
    expect(0).toEqual(sortupdateitemEndSortableIndex)
    expect(ul).toEqual(sortupdateitemStartParent)
    expect(ul).toEqual(sortupdateitemEndParent)
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
      event.dataTransfer = dataTransferObj
      li.dispatchEvent(event)

      event = new CustomEvent('dragover')
      event.dataTransfer = dataTransferObj
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
    event.dataTransfer = dataTransferObj

    li.dispatchEvent(event)
    expect(getIndex(document.querySelector('.test-placeholder'), ul.children)).toEqual(-1)

    event = new CustomEvent('dragover')
    event.dataTransfer = dataTransferObj
    secondLi.dispatchEvent(event)
    expect(getIndex(document.querySelector('.test-placeholder'), ul.children)).not.toEqual(originalIndex)

    secondLi.dispatchEvent(event)
    event = new CustomEvent('drop')
    document.querySelector('.test-placeholder').dispatchEvent(event)

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
      event.dataTransfer = dataTransferObj

      secondLi.dispatchEvent(event)
      expect(getIndex(document.querySelector('.test-placeholder'), ul.children)).toEqual(-1)

      event = new CustomEvent('dragover')
      event.dataTransfer = dataTransferObj
      secondLi.dispatchEvent(event)
      expect(getIndex(document.querySelector('.test-placeholder'), ul.children)).not.toEqual(originalIndex)

      body.dispatchEvent(event)

      event = new CustomEvent('drop')

      body.dispatchEvent(event)
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
    event.dataTransfer = dataTransferObj
    Object.defineProperty(event, 'target', { value: li, enumerable: true })
    ul.dispatchEvent(event)

    expect(li.getAttribute('aria-grabbed')).toEqual('true')

    event = new CustomEvent('dragover')
    event.dataTransfer = dataTransferObj
    Object.defineProperty(event, 'target', { value: item4, enumerable: true })
    ul.dispatchEvent(event)

    expect(event.dataTransfer.dropEffect).toEqual('move')
    expect(ul.querySelector('.test-placeholder')).not.toBe(undefined)
  })
})
