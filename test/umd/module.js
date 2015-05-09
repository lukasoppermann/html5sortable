// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/html.sortable.js', function(){

var assert = require("chai").assert;
var path = require("path");

  describe('Assignment to global variable', function(){
    var test = {};
    before(function(done){
      GLOBAL.$ = GLOBAL.jQuery = GLOBAL.sortable = undefined;
      require('jsdom').env({
        html: '<html><body></body></html>',
        scripts: [
          path.resolve(__dirname, '../../node_modules/jquery/dist/jquery.js'),
          path.resolve(__dirname, '../../dist/html.sortable.js')
        ],
        done: function (errors, window) {
          test.$ = window.$;
          test.jQuery = window.jQuery;
          test.sortable = window.sortable;
          done();
        }
      });
    });

    it('jQuery and $ should be defined as a function', function(){
      assert.typeOf(test.$,"function");
      assert.typeOf(test.jQuery,"function");
    });

    it('sortable should be defined as a function', function(){
      assert.typeOf(test.sortable,"function");
    });

    it('$().sortable should be defined as a function', function(){
      assert.typeOf(test.$().sortable,"function");
    });

  });

  describe('CommonJS Module', function(){
    before(function(){
      GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
      GLOBAL.window = GLOBAL.document.defaultView;
      GLOBAL.$ = GLOBAL.jQuery = GLOBAL.sortable = undefined;
    });

    it('should be able to require jquery', function() {
      var $ = require('jquery');
      assert.typeOf($,"function");
    });
    it('should be able to require html.sortable', function() {
      var sortable = require('../../dist/html.sortable.js');
      assert.typeOf(sortable,"function");
    });
    it('should find the exported function on a jQuery object', function() {
      var $ = require('jquery');
      var sortable = require('../../dist/html.sortable.js');
      assert.equal((typeof $().sortable), 'function');
    });
  });


  describe('AMD (Asynchronous module definition)', function(){
    var test = {};
    before(function(done){
      GLOBAL.$ = GLOBAL.jQuery = GLOBAL.sortable = undefined;
      require('jsdom').env({
        file: path.resolve(__dirname, 'amd.html'),
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        },
        done: function (errors, window) {
          test.requirejs = window.require;
          setTimeout(function(){
            // timeout is needed so requirejs can load the resources
            test.$ = window.$;
            test.sortable = window.sortable;
            done();
          },200);
        }
      });
    });

    it("should require jQuery", function () {
      assert.typeOf(test.requirejs,"function");
      assert.typeOf(test.$,"function");
    });

    it("should define sortable", function () {
      assert.typeOf(test.sortable,"function");
    });

    it("should define $().sortable", function () {
      assert.typeOf(test.$().sortable,"function");
    });

  });
});
