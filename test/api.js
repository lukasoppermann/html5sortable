describe('Testing api', function(){
  // testing basic api
  var assert = require("chai").assert;
  GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
  GLOBAL.window = GLOBAL.document.defaultView;
  GLOBAL.$ = require('jquery');
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

  describe('Initialization ', function(){
    beforeEach(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      });
    });

    describe('sortable', function(){
      it('should have a data-opts object', function(){
        assert.typeOf($ul.data('opts'),"object");
      });

      it('should have correct options set on options object', function(){
        var opts = $ul.data('opts');
        assert.equal(opts.items,"li");
        assert.equal(opts.connectWith,".test");
        assert.equal(opts.placeholderClass,"test-placeholder");
        assert.equal(opts.draggingClass,"test-dragging");
      });

      it('should have a aria-dropeffect attribute', function(){
        assert.equal($ul[0].getAttribute('aria-dropeffect'),"move");
      });

      it('should have a data-items object', function(){
        assert.typeOf($ul.data('items'),"string");
      });

      it('should have a data-connectWith object', function(){
        assert.typeOf($ul.data('connectWith'),"string");
      });

    });

    describe('sortable item', function(){
      it('should have aria-grabbed attributes', function(){
        $lis.each(function(){
          assert.equal(this.getAttribute('aria-grabbed'), "false");
        });
      });

      it('should have draggable attribute', function(){
        $lis.each(function(){
          assert.equal(this.getAttribute('draggable'), "true");
        });
      });
    });

  });

  describe('Destruction', function(){
    beforeEach(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li',
        'connectWith': '.test'
      });
      $ul.sortable('destroy');
    });

    describe('sortable', function(){
      it('should not have a data-opts object', function(){
        assert.typeOf($ul.data('opts'),"undefined");
      });

      it('should not have a aria-dropeffect attribute', function(){
        assert.isNull($ul[0].getAttribute('aria-dropeffect'));
      });

      it('should not have a data-items object', function(){
        assert.isUndefined($ul.data('items'));
      });

      it('should not have a data-connectWith object', function(){
        assert.isUndefined($ul.data('connectWith'));
      });

    });

    describe('sortable item', function(){
      it('should not have an aria-grabbed attribute', function(){
        $lis.each(function(){
          assert.isNull(this.getAttribute('aria-grabbed'));
        });
      });

      it('should not have draggable attribute', function(){
        $lis.each(function(){
          assert.isNull(this.getAttribute('draggable'));
        });
      });

    });

  });

  describe('Reload', function(){
    before(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      });
      $ul.sortable('reload');
    });

    it('should keep the options of the sortable', function(){
      var opts = $ul.data('opts');
      assert.equal(opts.items,'li:not(.disabled)');
      assert.equal(opts.connectWith,'.test');
      assert.equal(opts.placeholderClass,'test-placeholder');
    });

    it('should keep items attribute of the sortable', function(){
      var items = $ul.data('items');
      assert.equal(items,'li:not(.disabled)');
    });

    it('should keep connectWith attribute of the sortable', function(){
      var connectWith = $ul.data('connectWith');
      assert.equal(connectWith,'.test');
    });

  });

});
