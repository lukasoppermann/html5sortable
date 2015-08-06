describe('Internal function tests', function(){
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

  it('_getOptions', function(){
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

  it('_removeSortableEvents', function(){
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

  it('_removeItemEvents', function(){
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
    assert.isFalse(jQuery._data($li[0], 'events').hasOwnProperty('mousedown'));
  });

  it('_removeSortableData', function(){
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

  it('_removeItemData', function(){
    // destroy, so it does not use old values
    $ul.sortable('destroy');
    $ul.sortable({
      items: 'li',
      connectWith: '.test'
    });
    sortable.__testing._removeItemData($ul.find('li'));
    var li = $ul.find('li').first();
    assert.isUndefined(li.attr('role'));
    assert.isUndefined(li.attr('draggable'));
    assert.isUndefined(li.attr('aria-grabbed'));
  });

  it('_listsConnected', function(){
    $('body').append('<ul class="sortable2"><li>item</li></ul>');
    $ul2 = $('.sortable2').sortable();
    // test same sortable
    assert.equal(sortable.__testing._listsConnected($ul, $ul), true);
    // test different sortables without connect with
    assert.equal(sortable.__testing._listsConnected($ul, $ul2), false);
    // test one list with connectWith & one without
    $ul.sortable('destroy');
    $ul.sortable({
      connectWith: '.test'
    });
    assert.equal(sortable.__testing._listsConnected($ul, $ul2), false);
    // test not matching connectWith
    $ul2.sortable('destroy');
    $ul2.sortable({
      connectWith: '.test2'
    });
    assert.equal(sortable.__testing._listsConnected($ul, $ul2), false);
    // test matching connectWith
    $ul2.sortable('destroy');
    $ul2.sortable({
      connectWith: '.test'
    });
    assert.equal(sortable.__testing._listsConnected($ul, $ul2), true);
  });

});
