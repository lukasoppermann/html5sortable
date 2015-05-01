// testing basic api
var assert = require("chai").assert;
var sortable;

describe('Basics', function(){
  before(function(){
    GLOBAL.document = require("jsdom").jsdom('<html lang="en-US"></html>');
    GLOBAL.window = document.defaultView;
    GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
    sortable = require("../src/html.sortable.src.js");
  });

  it('sortable should be a function', function(){
    assert.typeOf(sortable,"function");
  });

  it('$().sortable should be a function', function(){
    assert.typeOf($().sortable,"function");
  });
});

describe('Initialization ', function(){
  beforeEach(function(){
    GLOBAL.document = require("jsdom").jsdom('<html lang="en-US"></html>');
    GLOBAL.window = document.defaultView;
    GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
    sortable = require("../src/html.sortable.src.js");
    $body = $(GLOBAL.window.document.body);
    $body.append('<ul class="sortable">'+
      '<li class="item">Item 1</li>'+
      '<li class="item">Item 2</li>'+
      '<li class="item">Item 3</li>'+
      '</ul>');
    $ul = $body.find('.sortable');
    $lis = $ul.find('li');
    $ul.sortable();
  });

  it('sortable should have a data-opts object', function(){
    assert.typeOf($ul.data('opts'),"object");
  });

  it('list items should have aria-grabbed attribute', function(){
    $lis.each(function(){
      assert.equal(this.getAttribute('aria-grabbed'), "false");
    });
  });

  it('list items should have draggable attribute', function(){
    $lis.each(function(){
      assert.equal(this.getAttribute('draggable'), "true");
    });
  });

});

describe('Destruction', function(){
  beforeEach(function(){
    GLOBAL.document = require("jsdom").jsdom('<html lang="en-US"></html>');
    GLOBAL.window = document.defaultView;
    GLOBAL.$ = GLOBAL.jQuery = require('../node_modules/jquery/dist/jquery.js');
    sortable = require("../src/html.sortable.src.js");
    $body = $(GLOBAL.window.document.body);
    $body.append('<ul class="sortable">'+
      '<li class="item">Item 1</li>'+
      '<li class="item">Item 2</li>'+
      '<li class="item">Item 3</li>'+
      '</ul>');
    $ul = $body.find('.sortable');
    $lis = $ul.find('li');
    $ul.sortable();
    $ul.sortable('destroy');
  });

  it('sortable should not have a data-opts object', function(){
    assert.typeOf($ul.data('opts'),"undefined");
  });

  it('list items should not have an aria-grabbed attribute', function(){
    $lis.each(function(){
      assert.isNull(this.getAttribute('aria-grabbed'));
    });
  });

  it('list items should have draggable attribute set to false', function(){
    $lis.each(function(){
      assert.isNull(this.getAttribute('draggable'));
    });
  });

});
