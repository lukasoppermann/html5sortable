// testing basic api
var assert = require('chai').assert;
GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
GLOBAL.window = GLOBAL.document.defaultView;
GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
var sortable = require("../src/html.sortable.src.js");

describe('events', function(){
  beforeEach(function(){
    $('body').html('').append('<ul class="sortable"><li>item</li></ul>');
    $ul = $('.sortable').sortable();
    $li = $ul.find('li').first();
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

    it('sortable return the correct options', function(){
      options = {
        'setting': 'test'
      };
      // soptions is not set
      var opts = sortable.__testing._getOptions(undefined, options);
      assert.isDefined(opts);
      assert.equal(opts.setting,'test');
      // soptions is set
      var opts = undefined;
      soptions = {
        'setting': 'test2'
      };
      var opts = sortable.__testing._getOptions(soptions, options);
      assert.isDefined(opts);
      assert.equal(opts.setting,'test2');
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

  describe('ghost', function(){
    // moch dragged item
    var dItem = $('<li>dItem Test</li>');
    dItem.offset = function(){
      return {
        left: 5,
        top: 5
      }
    };
    // mock event
    var e = {
      pageX: 100,
      pageY: 200,
      dataTransfer: {
        text: undefined,
        item: undefined,
        x: undefined,
        y: undefined,
        setData: function(type, val){
          e.dataTransfer[type] = val;
        },
        setDragImage: function(item, x, y){
          e.dataTransfer.item =item;
          e.dataTransfer.x = x;
          e.dataTransfer.y = y;
        }
      }
    };

    it('sets the dataTransfer options correctly', function(){
      sortable.__testing._attachGhost(e, {
        item: 'test-item',
        x: 10,
        y: 20
      });

      assert.equal(e.dataTransfer.effectAllowed, 'move');
      assert.equal(e.dataTransfer.text, '');
      assert.equal(e.dataTransfer.item, 'test-item');
      assert.equal(e.dataTransfer.x, 10);
      assert.equal(e.dataTransfer.y, 20);
    });

    it('sets item correctly from dragged item', function(){
      var ghost = sortable.__testing._makeGhost(dItem);
      assert.equal(dItem[0].innerHTML, 'dItem Test');
    });

    it('sets x & y correctly', function(){
      var ghost = sortable.__testing._addGhostPos(e, {
        item: 'test-item',
        draggedItem: dItem
      });

      assert.equal(ghost.x, 95);
      assert.equal(ghost.y, 195);
    });

    it('uses provided x & y correctly', function(){
      var ghost = sortable.__testing._addGhostPos(e, {
        item: 'test-item',
        draggedItem: dItem,
        x: 10,
        y: 20
      });

      assert.equal(ghost.x, 10);
      assert.equal(ghost.y, 20);
    });

    it('attaches ghost completly', function(){
      sortable.__testing._getGhost(e, dItem);

      assert.equal(e.dataTransfer.effectAllowed, 'move');
      assert.equal(e.dataTransfer.text, '');
      assert.equal(e.dataTransfer.item, dItem[0]);
      assert.equal(e.dataTransfer.x, 95);
      assert.equal(e.dataTransfer.y, 195);
    });
  });

});
