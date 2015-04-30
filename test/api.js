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

})
