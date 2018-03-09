/* global describe,expect,test,beforeEach,beforeAll */
import sortable from '../src/html5sortable'

describe('Testing api', () => {
  const { JSDOM } = require('jsdom')
  const documentHTML = `<!doctype html><html><body><div id="root"></div></body></html>`
  global.document = new JSDOM(documentHTML)
  global.window = document.parentWindow
  global.body = global.document.querySelector('body')
  // const sortable = require('../_test/html5sortable.cjs.js')
  let ul, li, secondLi, thirdLi

  describe('Initialization ', () => {
    beforeEach(() => {
      global.body.innerHTML = `<ul class="sortable">
        <li class="item item-first">Item 1</li>
        <li class="item item-second">Item 2</li>
        <li class="item item-third">Item 3</li>
        <li class="item item-third disabled">Item 3</li>
      </ul><ul class="sortable-2"></ul>`
      // select sortable
      ul = global.body.querySelector('.sortable')
      li = ul.querySelector('.item-first')
      secondLi = ul.querySelector('.item-second')
      thirdLi = ul.querySelector('.item-second')

      sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
    })

    test('should have a data-opts object', () => {
      expect(typeof sortable.__testing._data(ul, 'opts')).toBe('object')
    })

    test('should have correct options set on options object', () => {
      let opts = sortable.__testing._data(ul, 'opts')
      expect(opts.items).toEqual('li')
      expect(opts.connectWith).toEqual('.test')
      expect(opts.placeholderClass).toEqual('test-placeholder')
      expect(opts.draggingClass).toEqual('test-dragging')
    })

    test('should have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toEqual('move')
    })

    test('should have a data-items object', () => {
      expect(typeof sortable.__testing._data(ul, 'items')).toBe('string')
    })

    test('should have a h5s.connectWith object', () => {
      expect(typeof sortable.__testing._data(ul, 'connectWith')).toBe('string')
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
      // general jQuery event object
      expect(ul.h5s.events).toBeDefined()
      // individual events
      expect(ul.h5s.events.hasOwnProperty('dragover')).toBeDefined()
      expect(ul.h5s.events.hasOwnProperty('dragenter')).toBeDefined()
      expect(ul.h5s.events.hasOwnProperty('drop')).toBeDefined()
    })

    test('sortable item should have correct event attached', () => {
      // general jQuery event object
      expect(li.h5s.events).toBeDefined()
      // individual events
      expect(li.h5s.events.hasOwnProperty('dragover')).toBeDefined()
      expect(li.h5s.events.hasOwnProperty('dragenter')).toBeDefined()
      expect(li.h5s.events.hasOwnProperty('drop')).toBeDefined()
      expect(li.h5s.events.hasOwnProperty('dragstart')).toBeDefined()
      expect(li.h5s.events.hasOwnProperty('dragend')).toBeDefined()
      expect(li.h5s.events.hasOwnProperty('selectstart')).toBeDefined()
    })

    test('string placehodler', () => {
      sortable(ul, {
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
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test'
      })
      sortable(ul, 'destroy')
    })

    test('should not have a data-opts object', () => {
      expect(typeof sortable.__testing._data(ul, 'opts')).toBe('undefined')
    })

    test('should not have a aria-dropeffect attribute', () => {
      expect(ul.getAttribute('aria-dropeffect')).toBeNull()
    })

    test('should not have a data-items object', () => {
      expect(sortable.__testing._data(ul, 'items')).not.toBeDefined()
    })

    test('should not have a h5s.connectWith object', () => {
      expect(sortable.__testing._data(ul, 'connectWith')).not.toBeDefined()
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
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'reload')
    })

    test('should keep the options of the sortable', () => {
      let opts = sortable.__testing._data(ul, 'opts')
      expect(opts.items).toEqual('li:not(.disabled)')
      expect(opts.connectWith).toEqual('.test')
      expect(opts.placeholderClass).toEqual('test-placeholder')
    })

    test('should keep items attribute of the sortable', () => {
      let items = sortable.__testing._data(ul, 'items')
      expect(items).toEqual('li:not(.disabled)')
    })

    test('should keep connectWith attribute of the sortable', () => {
      let connectWith = sortable.__testing._data(ul, 'connectWith')
      expect(connectWith).toEqual('.test')
    })
  })

  describe('Disable', () => {
    beforeAll(function () {
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
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
      let handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown')).toBe(false)
      expect(handle.h5s.events.hasOwnProperty('mousedown.h5s')).toBe(false)
    })
  })

  describe('Enable', () => {
    beforeAll(function () {
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
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
      let handle = li
      expect(handle.h5s.events).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown')).toBeDefined()
      expect(handle.h5s.events.hasOwnProperty('mousedown.h5s')).toBeDefined()
    })
  })
})
