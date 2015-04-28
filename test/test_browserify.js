assert = require('assert');


describe('Browserify', function(){
    it('should be able to require jquery', function() {
      require('jquery');
    });
    it('should be able to require html.sortable', function() {
      require('../dist/html.sortable.js');
    });
    it('should find the exported function on a jQuery object', function() {
      var $ = require('jquery');
      assert.equal((typeof $().sortable), 'function');
    });
});
