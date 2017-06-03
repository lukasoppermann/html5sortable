/* global describe,beforeEach,afterEach,before,it */
describe('Testing api', function () {
  // testing basic api
  let assert = require('chai').assert
  const { JSDOM } = require('jsdom')
  const helper = require('./helper')
  const sortable = helper.instrument('./src/html.sortable.js')
  // const sortable = require('fs').readFileSync('./src/html.sortable.js', { encoding: 'utf-8' })
  let window, body
  let ul, li, secondLi, thirdLi

  describe('Initialization ', function () {
    beforeEach(function () {
      window = (new JSDOM(``, { runScripts: 'dangerously' })).window
      // Execute my library by inserting a <script> tag containing it.
      const scriptEl = window.document.createElement('script')
      scriptEl.textContent = sortable
      window.document.head.appendChild(scriptEl)

      body = window.document.body
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

      window.sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
    })

    afterEach(() => {
      helper.writeCoverage(window)
    })

    it('should have a data-opts object', function () {
      assert.typeOf(window.sortable.__testing._data(ul, 'opts'), 'object')
    })

    it('should have correct options set on options object', function () {
      let opts = window.sortable.__testing._data(ul, 'opts')
      assert.equal(opts.items, 'li')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
      assert.equal(opts.draggingClass, 'test-dragging')
    })

    it('should have a aria-dropeffect attribute', function () {
      assert.equal(ul.getAttribute('aria-dropeffect'), 'move')
    })

    it('should have a data-items object', function () {
      assert.typeOf(window.sortable.__testing._data(ul, 'items'), 'string')
    })

    it('should have a h5s.connectWith object', function () {
      assert.typeOf(window.sortable.__testing._data(ul, 'connectWith'), 'string')
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
      window.sortable(ul, {
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
      window.sortable(ul, {
        'items': 'li',
        'connectWith': '.test'
      })
      window.sortable(ul, 'destroy')
    })

    it('should not have a data-opts object', function () {
      assert.typeOf(window.sortable.__testing._data(ul, 'opts'), 'undefined')
    })

    it('should not have a aria-dropeffect attribute', function () {
      assert.isNull(ul.getAttribute('aria-dropeffect'))
    })

    it('should not have a data-items object', function () {
      assert.isUndefined(window.sortable.__testing._data(ul, 'items'))
    })

    it('should not have a h5s.connectWith object', function () {
      assert.isUndefined(window.sortable.__testing._data(ul, 'connectWith'))
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
      window.sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      window.sortable(ul, 'reload')
    })

    it('should keep the options of the sortable', function () {
      let opts = window.sortable.__testing._data(ul, 'opts')
      assert.equal(opts.items, 'li:not(.disabled)')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
    })

    it('should keep items attribute of the sortable', function () {
      let items = window.sortable.__testing._data(ul, 'items')
      assert.equal(items, 'li:not(.disabled)')
    })

    it('should keep connectWith attribute of the sortable', function () {
      let connectWith = window.sortable.__testing._data(ul, 'connectWith')
      assert.equal(connectWith, '.test')
    })
  })

  describe('Disable', function () {
    before(function () {
      window.sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      window.sortable(ul, 'disable')
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
      window.sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      window.sortable(ul, 'disable')
      window.sortable(ul, 'enable')
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

  describe('Serialize', function () {
    before(function () {
      window.sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
    })

    it('should have the right sortable in the list property', function () {
      assert.equal(window.sortable(ul, 'serialize')[0].list, window.sortable(ul)[0])
    })

    it('should have 3 children', function () {
      assert.equal(window.sortable(ul, 'serialize')[0].children.length, 3)
    })
  })
})
