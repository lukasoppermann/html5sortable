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
      '<li class="item"><a href="#" class="handle">Item 4</a></li>'+
      '<li class="item"><a href="#" class="notHandle">a clever ruse</a></li>'+
      '</ul>');
    $ul = $('.sortable');
    $lis = $ul.find('li');
  };

  beforeEach(function(){
    resetSortable();
    $li = $ul.find('li').first();
  });
  
  it('should drag with the handle', function() {
	$ul.sortable({
      'items': 'li',
      'connectWith': '.test',
	  'handle': '.handle',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    });
    var event = document.createEvent('CustomEvent');
    event.initEvent('dragstart', true, true);
    event.pageX = 100;
    event.pageY = 100;
    event.dataTransfer = {
      setData: function(val) {
        this.data = val;
      }
    };
	
	var $grabTarget = $ul.find('.handle').first();

	$grabTarget.trigger(jQuery.Event(event));
	
    assert.equal($grabTarget.parent().attr('aria-grabbed'),'true');
    assert.isTrue($grabTarget.parent().hasClass('test-dragging'));
  });
  
  it('should not let non-handle draggables initiate a dragstart event', function() {
	$ul.sortable({
      'items': 'li',
      'connectWith': '.test',
	  'handle': '.handle',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    });
    var event = document.createEvent('CustomEvent');
    event.initEvent('dragstart', true, true);
    event.pageX = 100;
    event.pageY = 100;
    event.dataTransfer = {
      setData: function(val) {
        this.data = val;
      }
    };
	
	var $grabTarget = $($ul).find('.notHandle').first();

	$grabTarget.trigger(jQuery.Event(event));
	
    assert.equal($grabTarget.parent().attr('aria-grabbed'),'false');
    assert.isFalse($grabTarget.parent().hasClass('test-dragging'));
  });
  
  it('should correctly run dragstart event', function(){
    $ul.sortable({
      'items': 'li',
      'connectWith': '.test',
      placeholderClass: 'test-placeholder',
      draggingClass: 'test-dragging'
    });
    var event = document.createEvent('CustomEvent');
    event.initEvent('dragstart', true, true);
    event.pageX = 100;
    event.pageY = 100;
    event.dataTransfer = {
      setData: function(val) {
        this.data = val;
      }
    };
    $li.trigger(jQuery.Event(event));

    assert.equal($li.attr('aria-grabbed'),'true');
    assert.isTrue($li.hasClass('test-dragging'));

  });

  it('should not add class on hover event', function(){
    $ul.sortable({
      'items': 'li',
      hoverClass: false,
    });
    $li.trigger( 'mouseover' );
    assert.isFalse($li.hasClass('sortable-over'));
  });

  it('should correctly add class on hover event', function(){
    $ul.sortable({
      'items': 'li',
      hoverClass: true,
    });
    $li.trigger( 'mouseover' );
    assert.isTrue($li.hasClass('sortable-over'));
  });

  it('should correctly add class on hover event', function(){
    $ul.sortable({
      'items': 'li',
      hoverClass: 'sortable-item-over',
    });
    $li.trigger( 'mouseover' );
    assert.isTrue($li.hasClass('sortable-item-over'));
  });

});
