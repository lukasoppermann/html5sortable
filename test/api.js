/* global describe,beforeEach,before,it */
describe('Testing api', function () {
  // testing basic api
  let assert = require('chai').assert
  global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
  global.window = global.document.defaultView
  let ul, li, secondLi, thirdLi
  let body = global.document.querySelector('body')
  let sortable = require('../src/html.sortable.js')

  describe('Initialization ', function () {
    beforeEach(function () {
      body.innerHTML = `<ul class="sortable">
        <li class="item item-first">Item 1</li>
        <li class="item item-second">Item 2</li>
        <li class="item item-third">Item 3</li>
      </ul>`
      // select sortable
      ul = body.querySelector('.sortable')
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

    it('should have a data-opts object', function () {
      assert.typeOf(sortable.__testing._data(ul, 'opts'), 'object')
    })

    it('should have correct options set on options object', function () {
      let opts = sortable.__testing._data(ul, 'opts')
      assert.equal(opts.items, 'li')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
      assert.equal(opts.draggingClass, 'test-dragging')
    })

    it('should have a aria-dropeffect attribute', function () {
      assert.equal(ul.getAttribute('aria-dropeffect'), 'move')
    })

    it('should have a data-items object', function () {
      assert.typeOf(sortable.__testing._data(ul, 'items'), 'string')
    })

    it('should have a h5s.connectWith object', function () {
      assert.typeOf(sortable.__testing._data(ul, 'connectWith'), 'string')
    })

    it('should have aria-grabbed attributes', function () {
      assert.equal(li.getAttribute('aria-grabbed'), 'false')
      assert.equal(secondLi.getAttribute('aria-grabbed'), 'false')
      assert.equal(thirdLi.getAttribute('aria-grabbed'), 'false')
    })

    it('should have draggable attribute', function () {
      assert.equal(li.getAttribute('draggable'), 'true')
      assert.equal(secondLi.getAttribute('draggable'), 'true')
      assert.equal(thirdLi.getAttribute('draggable'), 'true')
    })

    it('sortable should have correct event attached', function () {
      // general jQuery event object
      assert.isDefined(ul.h5s.events)
      // individual events
      assert.isDefined(ul.h5s.events.hasOwnProperty('dragover'))
      assert.isDefined(ul.h5s.events.hasOwnProperty('dragenter'))
      assert.isDefined(ul.h5s.events.hasOwnProperty('drop'))
    })

    it('sortable item should have correct event attached', function () {
      // general jQuery event object
      assert.isDefined(li.h5s.events)
      // individual events
      assert.isDefined(li.h5s.events.hasOwnProperty('dragover'))
      assert.isDefined(li.h5s.events.hasOwnProperty('dragenter'))
      assert.isDefined(li.h5s.events.hasOwnProperty('drop'))
      assert.isDefined(li.h5s.events.hasOwnProperty('dragstart'))
      assert.isDefined(li.h5s.events.hasOwnProperty('dragend'))
      assert.isDefined(li.h5s.events.hasOwnProperty('selectstart'))
    })

    it('string placehodler', function () {
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging',
        placeholder: '<div/>'
      })
    })
  })

  describe('Destroy', function () {
    beforeEach(function () {
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test'
      })
      sortable(ul, 'destroy')
    })

    it('should not have a data-opts object', function () {
      assert.typeOf(sortable.__testing._data(ul, 'opts'), 'undefined')
    })

    it('should not have a aria-dropeffect attribute', function () {
      assert.isNull(ul.getAttribute('aria-dropeffect'))
    })

    it('should not have a data-items object', function () {
      assert.isUndefined(sortable.__testing._data(ul, 'items'))
    })

    it('should not have a h5s.connectWith object', function () {
      assert.isUndefined(sortable.__testing._data(ul, 'connectWith'))
    })

    it('should not have an aria-grabbed attribute', function () {
      assert.isNull(li.getAttribute('aria-grabbed'), 'false')
      assert.isNull(secondLi.getAttribute('aria-grabbed'), 'false')
      assert.isNull(thirdLi.getAttribute('aria-grabbed'), 'false')
    })

    it('should not have draggable attribute', function () {
      assert.isNull(li.getAttribute('draggable'), 'false')
      assert.isNull(secondLi.getAttribute('draggable'), 'false')
      assert.isNull(thirdLi.getAttribute('draggable'), 'false')
    })
  })

  describe('Reload', function () {
    before(function () {
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'reload')
    })

    it('should keep the options of the sortable', function () {
      let opts = sortable.__testing._data(ul, 'opts')
      assert.equal(opts.items, 'li:not(.disabled)')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
    })

    it('should keep items attribute of the sortable', function () {
      let items = sortable.__testing._data(ul, 'items')
      assert.equal(items, 'li:not(.disabled)')
    })

    it('should keep connectWith attribute of the sortable', function () {
      let connectWith = sortable.__testing._data(ul, 'connectWith')
      assert.equal(connectWith, '.test')
    })
  })

  describe('Disable', function () {
    before(function () {
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
    })

    it('should remove attributes from sortable', function () {
      assert.equal(ul.getAttribute('aria-dropeffect'), 'none')
    })

    it('should set handles to draggable = false', function () {
      console.log('TEST is wrong, no handle in sortable')
      assert.equal(li.getAttribute('draggable'), 'false')
    })

    it('should remove mousedown event', function () {
      let handle = li
      console.log('TEST is wrong, no handle in sortable')
      assert.isDefined(handle.h5s.events)
      assert.isFalse(handle.h5s.events.hasOwnProperty('mousedown'))
      assert.isFalse(handle.h5s.events.hasOwnProperty('mousedown.h5s'))
    })
  })

  describe('Enable', function () {
    before(function () {
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
      sortable(ul, 'enable')
    })

    it('should readd attributes to sortable', function () {
      assert.equal(ul.getAttribute('aria-dropeffect'), 'move')
    })

    it('should set handles to draggable = true', function () {
      console.log('TEST is wrong, no handle in sortable')
      assert.equal(li.getAttribute('draggable'), 'true')
    })

    it('should remove mousedown event', function () {
      let handle = li
      console.log('TEST is wrong, no handle in sortable')
      assert.isDefined(handle.h5s.events)
      assert.isDefined(handle.h5s.events.hasOwnProperty('mousedown'))
      assert.isDefined(handle.h5s.events.hasOwnProperty('mousedown.h5s'))
    })
  })
})
