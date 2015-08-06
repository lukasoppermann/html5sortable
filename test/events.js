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

});
