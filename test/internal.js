describe('internal function tests', function(){
  // testing basic api
  var assert = require('chai').assert;
  GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
  GLOBAL.window = GLOBAL.document.defaultView;
  GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
  var sortable = require("../src/html.sortable.src.js");

  beforeEach(function(){
    $('body').html('').append('<ul class="sortable"><li>item</li></ul>');
    $('.sortable').sortable('destroy');
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

    it('enables the sortable', function(){
      $ul.sortable('disable');
      sortable.__testing._enableSortable($ul);
      assert.equal($ul.attr('aria-dropeffect'),'move');
      assert.equal($li.attr('draggable'),'true');
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

    it('should remove data from sortable', function(){
      // destroy, so it does not use old values
      $ul.sortable('destroy');
      $ul.sortable({
        items: 'li',
        connectWith: '.test'
      });
      sortable.__testing._removeSortableData($ul);

      assert.isUndefined($ul.data('opts'));
      assert.isUndefined($ul.data('connectWith'));
      assert.isUndefined($ul.data('items'));
      assert.isUndefined($ul.attr('aria-dropeffect'));
    });

    it('should remove data from items', function(){
      // destroy, so it does not use old values
      $ul.sortable('destroy');
      $ul.sortable({
        items: 'li',
        connectWith: '.test'
      });
      sortable.__testing._removeItemData($ul);

      assert.isUndefined($ul.attr('role'));
      assert.isUndefined($ul.attr('draggable'));
      assert.isUndefined($ul.attr('aria-grabbed'));
    });

  });

});
