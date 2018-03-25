/* global describe,expect,test,beforeEach,beforeAll */
import Sortable from '../src/html5sortable'
import store from '../src/store'
/* eslint-env jest */
/* eslint-disable no-new */

describe('Testing api', () => {
  document.body.innerHTML = `<!doctype html><html><body><div id="root"></div></body></html>`
  let body = document.querySelector('body')
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

      new Sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
    })

    test('should have a data-opts object', () => {
      expect(typeof Sortable.__testing._data(ul, 'opts')).toBe('object')
    })

    test('should have correct options set on options object', () => {
      let opts = Sortable.__testing._data(ul, 'opts')
      expect(opts.items).toEqual('li')
      expect(opts.connectWith).toEqual('.test')
      expect(opts.placeholderClass).toEqual('test-placeholder')
      expect(opts.draggingClass).toEqual('test-dragging')
    })

    test('should have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toEqual('move')
    })

    test('should have a data-items object', () => {
      expect(typeof Sortable.__testing._data(ul, 'items')).toBe('string')
    })

    test('should have a h5s.connectWith object', () => {
      expect(typeof Sortable.__testing._data(ul, 'connectWith')).toBe('string')
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

    test('string placehodler', () => {
      new Sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging',
        placeholder: '<div/>'
      })
    })
  })

  describe('Destroy', () => {
    beforeEach(() => {
      new Sortable(ul, {
        'items': 'li',
        'connectWith': '.test'
      })
      new Sortable(ul, 'destroy')
    })

    test('should not have a data-opts object', () => {
      expect(typeof Sortable.__testing._data(ul, 'opts')).toBe('undefined')
    })

    test('should not have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toBeNull()
    })

    test('should not have a data-items object', () => {
      expect(Sortable.__testing._data(ul, 'items')).not.toBeDefined()
    })

    test('should not have a h5s.connectWith object', () => {
      expect(Sortable.__testing._data(ul, 'connectWith')).not.toBeDefined()
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
      new Sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      new Sortable(ul, 'reload')
    })

    test('should keep the options of the sortable', () => {
      let opts = Sortable.__testing._data(ul, 'opts')
      expect(opts.items).toEqual('li:not(.disabled)')
      expect(opts.connectWith).toEqual('.test')
      expect(opts.placeholderClass).toEqual('test-placeholder')
    })

    test('should keep items attribute of the sortable', () => {
      let items = Sortable.__testing._data(ul, 'items')
      expect(items).toEqual('li:not(.disabled)')
    })

    test('should keep connectWith attribute of the sortable', () => {
      let connectWith = Sortable.__testing._data(ul, 'connectWith')
      expect(connectWith).toEqual('.test')
    })
  })

  describe('Disable', () => {
    beforeAll(function () {
      new Sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      new Sortable(ul, 'disable')
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
      let handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown')).toBe(false)
      expect(handle.h5s.events.hasOwnProperty('mousedown.h5s')).toBe(false)
    })
  })

  describe('Enable', () => {
    beforeAll(function () {
      new Sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      new Sortable(ul, 'disable')
      new Sortable(ul, 'enable')
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
      let handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown')).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown.h5s')).toBeDefined()
    })
  })
})
