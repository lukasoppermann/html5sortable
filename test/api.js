/* global $,describe,beforeEach,before,it */
describe('Testing api', function () {
  // testing basic api
  var assert = require('chai').assert
  global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
  global.window = global.document.defaultView
  global.$ = require('jquery')
  let $ul, ul, $lis, $li

  var sortable = require('../src/html.sortable.js')
  var resetSortable = function () {
    $('body').html('').append('<ul class="sortable">' +
      '<li class="item">Item 1</li>' +
      '<li class="item">Item 2</li>' +
      '<li class="item">Item 3</li>' +
      '</ul>')
    $ul = $('.sortable')
    ul = $ul.get()
    $lis = $ul.find('li')
  }

  describe('Initialization ', function () {
    beforeEach(function () {
      resetSortable()
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      })
      $li = $ul.find('li').first()
    })

    it('should have a data-opts object', function () {
      assert.typeOf(sortable.__testing._data($ul.get(0), 'opts'), 'object')
    })

    it('should have correct options set on options object', function () {
      var opts = sortable.__testing._data($ul.get(0), 'opts')
      assert.equal(opts.items, 'li')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
      assert.equal(opts.draggingClass, 'test-dragging')
    })

    it('should have a aria-dropeffect attribute', function () {
      assert.equal($ul[0].getAttribute('aria-dropeffect'), 'move')
    })

    it('should have a data-items object', function () {
      assert.typeOf(sortable.__testing._data($ul.get(0), 'items'), 'string')
    })

    it('should have a h5s.connectWith object', function () {
      assert.typeOf(sortable.__testing._data($ul.get(0), 'connectWith'), 'string')
    })

    it('should have aria-grabbed attributes', function () {
      $lis.each(function () {
        assert.equal(this.getAttribute('aria-grabbed'), 'false')
      })
    })

    it('should have draggable attribute', function () {
      $lis.each(function () {
        assert.equal(this.getAttribute('draggable'), 'true')
      })
    })

    it('sortable should have correct event attached', function () {
      // general jQuery event object
      assert.isDefined($ul[0].h5s.events)
      // individual events
      assert.isDefined($ul[0].h5s.events.hasOwnProperty('dragover'))
      assert.isDefined($ul[0].h5s.events.hasOwnProperty('dragenter'))
      assert.isDefined($ul[0].h5s.events.hasOwnProperty('drop'))
    })

    it('sortable item should have correct event attached', function () {
      // general jQuery event object
      assert.isDefined($li[0].h5s.events)
      // individual events
      assert.isDefined($li[0].h5s.events.hasOwnProperty('dragover'))
      assert.isDefined($li[0].h5s.events.hasOwnProperty('dragenter'))
      assert.isDefined($li[0].h5s.events.hasOwnProperty('drop'))
      assert.isDefined($li[0].h5s.events.hasOwnProperty('dragstart'))
      assert.isDefined($li[0].h5s.events.hasOwnProperty('dragend'))
      assert.isDefined($li[0].h5s.events.hasOwnProperty('selectstart'))
    })

    it('string placehodler', function () {
      resetSortable()
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging',
        placeholder: '<div/>'
      })
      $li = $ul.find('li').first()
    })
  })

  describe('Destroy', function () {
    beforeEach(function () {
      resetSortable()
      sortable(ul, {
        'items': 'li',
        'connectWith': '.test'
      })
      sortable(ul, 'destroy')
    })

    it('should not have a data-opts object', function () {
      assert.typeOf(sortable.__testing._data($ul.get(0), 'opts'), 'undefined')
    })

    it('should not have a aria-dropeffect attribute', function () {
      assert.isNull($ul[0].getAttribute('aria-dropeffect'))
    })

    it('should not have a data-items object', function () {
      assert.isUndefined(sortable.__testing._data($ul.get(0), 'items'))
    })

    it('should not have a h5s.connectWith object', function () {
      assert.isUndefined(sortable.__testing._data($ul.get(0), 'connectWith'))
    })

    it('should not have an aria-grabbed attribute', function () {
      $lis.each(function () {
        assert.isNull(this.getAttribute('aria-grabbed'))
      })
    })

    it('should not have draggable attribute', function () {
      $lis.each(function () {
        assert.isNull(this.getAttribute('draggable'))
      })
    })
  })

  describe('Reload', function () {
    before(function () {
      resetSortable()
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'reload')
    })

    it('should keep the options of the sortable', function () {
      var opts = sortable.__testing._data($ul.get(0), 'opts')
      assert.equal(opts.items, 'li:not(.disabled)')
      assert.equal(opts.connectWith, '.test')
      assert.equal(opts.placeholderClass, 'test-placeholder')
    })

    it('should keep items attribute of the sortable', function () {
      var items = sortable.__testing._data($ul.get(0), 'items')
      assert.equal(items, 'li:not(.disabled)')
    })

    it('should keep connectWith attribute of the sortable', function () {
      var connectWith = sortable.__testing._data($ul.get(0), 'connectWith')
      assert.equal(connectWith, '.test')
    })
  })

  describe('Disable', function () {
    before(function () {
      resetSortable()
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
    })

    it('should remove attributes from sortable', function () {
      assert.equal($ul.attr('aria-dropeffect'), 'none')
    })

    it('should set handles to draggable = false', function () {
      var handle = $ul.find(sortable.__testing._data($ul.get(0), 'items')).first()
      assert.equal(handle.attr('draggable'), 'false')
    })

    it('should remove mousedown event', function () {
      var handle = $ul.find(sortable.__testing._data($ul.get(0), 'items')).first()
      assert.isDefined(handle[0].h5s.events)
      assert.isFalse(handle[0].h5s.events.hasOwnProperty('mousedown'))
      assert.isFalse(handle[0].h5s.events.hasOwnProperty('mousedown.h5s'))
    })
  })

  describe('Enable', function () {
    before(function () {
      resetSortable()
      sortable(ul, {
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      })
      sortable(ul, 'disable')
      sortable(ul, 'enable')
    })

    it('should readd attributes to sortable', function () {
      assert.equal($ul.attr('aria-dropeffect'), 'move')
    })

    it('should set handles to draggable = true', function () {
      var handle = $ul.find(sortable.__testing._data($ul.get(0), 'items')).first()
      assert.equal(handle.attr('draggable'), 'true')
    })

    it('should remove mousedown event', function () {
      var handle = $ul.find(sortable.__testing._data($ul.get(0), 'items')).first()
      assert.isDefined(handle[0].h5s.events)
      assert.isDefined(handle[0].h5s.events.hasOwnProperty('mousedown'))
      assert.isDefined(handle[0].h5s.events.hasOwnProperty('mousedown.h5s'))
    })
  })
})
