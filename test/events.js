/* global $,describe,it,beforeEach */
describe('Testing events', function () {
  // testing basic api
  var assert = require('chai').assert
  global.document = require('jsdom').jsdom(`<html lang="en-US">
    <style>
      html, body{
        margin: 0;
      }
      li{
        display: block;
        width: 100%;
        height: 25px;
        padding: 0;
      }
    <style>
  </html>`)
  global.window = global.document.defaultView
  global.$ = require('jquery')
  let $ul, ul, $li
  var sortable = require('../src/html.sortable.js')
  var resetSortable = function () {
    $('body').html('').append('<ul class="sortable">' +
      '<li class="item">Item 1</li>' +
      '<li class="item">Item 2</li>' +
      '<li class="item">Item 3</li>' +
      '<li class="item"><a href="#" class="handle">Item 4</a></li>' +
      '<li class="item"><a href="#" class="notHandle">a clever ruse</a></li>' +
      '</ul>')
    $ul = $('.sortable')
    ul = $ul.get()
  }

  beforeEach(function () {
    sortable.__testing._resetPlaceholders()
    resetSortable()
    $li = $ul.find('li').first()

    $li.get(0).getClientRects = function () {
      return [{
        left: 5,
        top: 5
      }]
    }
  })

  it('should correctly run dragstart event', function () {
    sortable(ul, {
      'items': 'li',
      'connectWith': '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    })
    let event = sortable.__testing._makeEvent('dragstart')
    event.pageX = 100
    event.pageY = 100
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    $li.get(0).dispatchEvent(event)

    assert.equal($li.attr('aria-grabbed'), 'true')
    assert.isTrue($li.hasClass('test-dragging'))
  })

  it('should not add class on hover event', function () {
    sortable(ul, {
      'items': 'li',
      hoverClass: false
    })
    $li.trigger('mouseover')
    assert.isFalse($li.hasClass('sortable-over'))
  })

  it('should correctly add class on hover event', function () {
    sortable(ul, {
      'items': 'li',
      hoverClass: true
    })
    $li.get(0).dispatchEvent(sortable.__testing._makeEvent('mouseenter'))
    assert.isTrue($li.hasClass('sortable-over'))
    $li.get(0).dispatchEvent(sortable.__testing._makeEvent('mouseleave'))
    assert.isFalse($li.hasClass('sortable-over'))
  })

  it('should correctly add class on hover event', function () {
    sortable(ul, {
      'items': 'li',
      hoverClass: 'sortable-item-over'
    })
    $li.get(0).dispatchEvent(sortable.__testing._makeEvent('mouseenter'))
    assert.isTrue($li.hasClass('sortable-item-over'))
  })

  it('should correctly place moved item into correct index', function () {
    sortable(ul, {
      'items': 'li',
      placeholderClass: 'test-placeholder'
    })
    let originalIndex = $li.index()

    let event = sortable.__testing._makeEvent('dragstart')
    event.pageX = 0
    event.pageY = 0
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    $li.get(0).dispatchEvent(event)

    event = sortable.__testing._makeEvent('dragover')
    event.pageX = 0
    event.pageY = 65
    event.dataTransfer = {
      setData: function (val) {
        this.data = val
      }
    }
    $ul.find('li').eq(2).get(0).dispatchEvent(event)

    event = sortable.__testing._makeEvent('drop')

    sortable.__testing._getPlaceholders()[0].dispatchEvent(event)

    assert.notEqual($li.index(), originalIndex)
    assert.equal($li.index(), 2)
  })
})
