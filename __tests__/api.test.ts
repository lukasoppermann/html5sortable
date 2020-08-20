/* global describe,expect,test,beforeEach,beforeAll */
import sortable from '../src/html5sortable'
import store from '../src/store'
/* eslint-env jest */

describe('Testing api', () => {
  document.body.innerHTML = '<!doctype html><html><body><div id="root"></div></body></html>'
  const body = document.querySelector('body')
  let ul, li, secondLi, thirdLi

  describe('Initialization ', () => {
    beforeEach(() => {
      body.innerHTML = `<ul class="sortable">
        <li class="item item-first">Item 1</li>
        <li class="item item-second">Item 2</li>
        <li class="item item-third">Item 3</li>
        <li class="item item-third disabled">Item 3</li>
      </ul><ul class="sortable-2"></ul>`
      // select sortable
      ul = body.querySelector('.sortable')
      li = ul.querySelector('.item-first')
      secondLi = ul.querySelector('.item-second')
      thirdLi = ul.querySelector('.item-second')

      sortable(ul, {
        items: 'li',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
    })

    test('should have a data-opts object', () => {
      expect(typeof sortable.__testing.data(ul, 'opts')).toBe('object')
    })

    test('should have correct options set on options object', () => {
      const opts = sortable.__testing.data(ul, 'opts')
      expect(opts.items).toEqual('li')
      expect(opts.placeholderClass).toEqual('test-placeholder')
      expect(opts.draggingClass).toEqual('test-dragging')
    })

    test('should have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toEqual('move')
    })

    test('should have a data-items object', () => {
      expect(typeof sortable.__testing.data(ul, 'items')).toBe('string')
    })

    test('should have aria-grabbed attributes', () => {
      expect(li.getAttribute('aria-grabbed')).toEqual('false')
      expect(secondLi.getAttribute('aria-grabbed')).toEqual('false')
      expect(thirdLi.getAttribute('aria-grabbed')).toEqual('false')
    })

    test('should have draggable attribute', () => {
      expect(li.getAttribute('draggable')).toEqual('true')
      expect(secondLi.getAttribute('draggable')).toEqual('true')
      expect(thirdLi.getAttribute('draggable')).toEqual('true')
    })

    test('sortable should have correct event attached', () => {
      // individual events
      expect(store(ul).getData('eventdragover')).toBeDefined()
      expect(store(ul).getData('eventdragenter')).toBeDefined()
      expect(store(ul).getData('eventdrop')).toBeDefined()
    })

    test('sortable item should have correct event attached', () => {
      // individual events
      expect(store(li).getData('eventdragover')).toBeDefined()
      expect(store(li).getData('eventdragenter')).toBeDefined()
    })
  })

  describe('Destroy', () => {
    beforeEach(() => {
      sortable(ul, {
        items: 'li'
      })
      sortable(ul, 'destroy')
    })

    test('should not have a data-opts object', () => {
      expect(typeof sortable.__testing.data(ul, 'opts')).toBe('undefined')
    })

    test('should not have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toBeNull()
    })

    test('should not have a data-items object', () => {
      expect(sortable.__testing.data(ul, 'items')).not.toBeDefined()
    })

    test('should not have an aria-grabbed attribute', () => {
      expect(li.getAttribute('aria-grabbed')).toBeNull()
      expect(secondLi.getAttribute('aria-grabbed')).toBeNull()
      expect(thirdLi.getAttribute('aria-grabbed')).toBeNull()
    })

    test('should not have draggable attribute', () => {
      expect(li.getAttribute('draggable')).toBeNull()
      expect(secondLi.getAttribute('draggable')).toBeNull()
      expect(thirdLi.getAttribute('draggable')).toBeNull()
    })
  })

  describe('Reload', () => {
    beforeAll(function () {
      sortable(ul, {
        items: 'li:not(.disabled)',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'reload')
    })

    test('should keep the options of the sortable', () => {
      const opts = sortable.__testing.data(ul, 'opts')
      expect(opts.items).toEqual('li:not(.disabled)')
      expect(opts.placeholderClass).toEqual('test-placeholder')
    })

    test('should keep items attribute of the sortable', () => {
      const items = sortable.__testing.data(ul, 'items')
      expect(items).toEqual('li:not(.disabled)')
    })
  })

  describe('Disable', () => {
    beforeAll(function () {
      sortable(ul, {
        items: 'li:not(.disabled)',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
    })

    test('should remove attributes from sortable', () => {
      expect(ul.getAttribute('aria-dropeffect')).toEqual('none')
    })

    test.skip('should set handles to draggable = false', () => {
      // @TODO: TEST is wrong, no handle in sortable
      expect(li.getAttribute('draggable')).toEqual('false')
    })

    test.skip('should remove mousedown event', () => {
      // @TODO: TEST is wrong, no handle in sortable
      const handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(Object.prototype.hasOwnProperty.call(handle.h5s.events, 'mousedown')).toBe(false)
      expect(Object.prototype.hasOwnProperty.call(handle.h5s.events, 'mousedown.h5s')).toBe(false)
    })
  })

  describe('Enable', () => {
    beforeAll(function () {
      sortable(ul, {
        items: 'li:not(.disabled)',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
      sortable(ul, 'enable')
    })

    test('should readd attributes to sortable', () => {
      expect(ul.getAttribute('aria-dropeffect')).toEqual('move')
    })

    test.skip('should set handles to draggable = true', () => {
      // @TODO: TEST is wrong, no handle in sortable
      expect(li.getAttribute('draggable')).toEqual('true')
    })

    test.skip('should remove mousedown event', () => {
      // @TODO: TEST is wrong, no handle in sortable
      const handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(Object.prototype.hasOwnProperty.call(handle.h5s.events, 'mousedown')).toBeDefined()
      expect(Object.prototype.hasOwnProperty.call(handle.h5s.events, 'mousedown.h5s')).toBeDefined()
    })
  })
})
