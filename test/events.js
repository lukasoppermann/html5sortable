describe('Testing events', function(){
  // testing basic api
  var assert = require("chai").assert;
  GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
  GLOBAL.window = GLOBAL.document.defaultView;
  GLOBAL.$ = require('jquery');
  var $ul;
  var sortable = require("../src/html.sortable.src.js");
  var resetSortable = function(){
    $('body').html('').append('<ul class="sortable">'+
      '<li class="item">Item 1</li>'+
      '<li class="item">Item 2</li>'+
      '<li class="item">Item 3</li>'+
      '</ul>');
    $ul = $('.sortable');
    $lis = $ul.find('li');
  };

  beforeEach(function(){
    resetSortable();
    $ul.sortable({
      'items': 'li',
      'connectWith': '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    });
    $li = $ul.find('li').first();
  });

  afterEach(function(){
    sortable.__testing._clearPlaceholders();
  });

  it('should correctly run dragstart event', function(){
    $li.trigger(jQuery.Event( 'dragstart', {
      originalEvent: {
        pageX: 100,
        pageY: 100,
        dataTransfer: {
          setData: function(val){
            this.data = val;
          }
        }
      }
    }));

    assert.equal($li.attr('aria-grabbed'),'true');
    assert.isTrue($li.hasClass('test-dragging'));

  });

  it('should correctly place moved item into correct index', function(){
    originalIndex = $li.index();
    $li.trigger(jQuery.Event( 'dragstart', {
      originalEvent: {
        pageX: 100,
        pageY: 100,
        dataTransfer: {
          setData: function(val){
            this.data = val;
          }
        }
      }
    }));
    $('.test-placeholder').appendTo($ul);
    $li.trigger(jQuery.Event( 'dragover', {
      originalEvent: {
        pageX: 100,
        pageY: 200,
        dataTransfer: {
          setData: function(val){
            this.data = val;
          }
        }
      }
    }));
    $li.trigger(jQuery.Event('drop'));
    assert.notEqual($li.index(), originalIndex);
    assert.equal($li.index(), 2);
  });

  it('should correctly place non-moved item into correct index', function(){
    originalIndex = $li.index();
    $li.trigger(jQuery.Event( 'dragstart', {
      originalEvent: {
        pageX: 100,
        pageY: 100,
        dataTransfer: {
          setData: function(val){
            this.data = val;
          }
        }
      }
    }));
    $('.test-placeholder').appendTo($ul);
    $li.trigger(jQuery.Event( 'dragover', {
      originalEvent: {
        pageX: 100,
        pageY: 200,
        dataTransfer: {
          setData: function(val){
            this.data = val;
          }
        }
      }
    }));
    assert.notEqual($li.index(), originalIndex);
    $li.trigger(jQuery.Event('dragend'));
    assert.equal($li.index(), originalIndex);
  });
});
