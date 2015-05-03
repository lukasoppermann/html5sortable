// testing basic api
var assert = require('chai').assert;
// var sinon = require('sinon');
// var EventEmitter = require('events').EventEmitter;
var sortable;

describe('events', function(){
  before(function(){
    GLOBAL.document = require("jsdom").jsdom('<html lang="en-US"></html>');
    GLOBAL.window = document.defaultView;
    GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
    sortable = require("../src/html.sortable.src.js");
    $body = $(GLOBAL.window.document.body);
    $body.append('<ul class="sortable"><li></li></ul>');
    $ul = $body.find('.sortable');
    $li = $ul.find('li').first();
    $ul.sortable();
  });

  describe('initilization', function(){
    it('sortable should have correct event attached', function(){
      // general jQuery event object
      assert.isDefined(jQuery._data($ul[0], 'events'));
      // individual events
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('dragover'));
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('dragenter'));
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('drop'));
    });

    it('sortable item should have correct event attached', function(){
      // general jQuery event object
      assert.isDefined(jQuery._data($li[0], 'events'));
      // individual events
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('dragover'));
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('dragenter'));
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('drop'));
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('dragstart'));
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('dragend'));
      assert.isDefined(jQuery._data($li[0], 'events').hasOwnProperty('selectstart'));
    });

  });

  describe('destruction', function(){
    it('sortable should have events removed', function(){
      // remove general jQuery event object
      sortable.__testing._removeSortableEvents($ul);
      assert.isUndefined(jQuery._data($ul[0], 'events'));
      // remove individual events
      // need to add on click so that event object is not removed
      // when all sortable events are removed
      $ul.sortable();
      $ul.on('click', 'console.log');
      sortable.__testing._removeSortableEvents($ul);
      assert.isFalse(jQuery._data($ul[0], 'events').hasOwnProperty('dragover'));
      assert.isFalse(jQuery._data($ul[0], 'events').hasOwnProperty('dragenter'));
      assert.isFalse(jQuery._data($ul[0], 'events').hasOwnProperty('drop'));
    });

    it('sortable item should have events removed', function(){
      // remove general jQuery event object
      sortable.__testing._removeItemEvents($li);
      assert.isUndefined(jQuery._data($li[0], 'events'));
      // remove individual events
      // need to add on click so that event object is not removed
      // when all sortable events are removed
      $ul.sortable();
      $li.on('click', 'console.log');
      sortable.__testing._removeItemEvents($li);
      // test individual events
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('dragover'));
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('dragenter'));
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('drop'));
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('dragstart'));
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('dragend'));
      assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('selectstart'));
    });

  });

});
