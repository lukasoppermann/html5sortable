/* global describe,before,it */
// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/html.sortable.js', function () {
  var assert = require('chai').assert
  var path = require('path')

  describe('Assignment to global variable', function () {
    var test = {}
    before(function (done) {
      global.sortable = undefined
      require('jsdom').env({
        html: '<html><body></body></html>',
        scripts: [
          path.resolve(__dirname, '../../dist/html.sortable.js')
        ],
        done: function (errors, window) {
          test.sortable = window.sortable
          done()
        }
      })
    })

    it('sortable should be defined as a function', function () {
      assert.typeOf(test.sortable, 'function')
    })
  })

  describe('CommonJS Module', function () {
    before(function () {
      global.document = require('jsdom').jsdom('<html lang="en-US"></html>')
      global.window = global.document.defaultView
      global.sortable = undefined
    })

    it('should be able to require html.sortable', function () {
      var sortable = require('../../dist/html.sortable.js')
      assert.typeOf(sortable, 'function')
    })
  })

  describe('AMD (Asynchronous module definition)', function () {
    var test = {}
    before(function (done) {
      global.sortable = undefined
      require('jsdom').env({
        file: path.resolve(__dirname, 'amd.html'),
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script']
        },
        done: function (errors, window) {
          test.requirejs = window.require
          setTimeout(function () {
            // timeout is needed so requirejs can load the resources
            test.sortable = window.sortable
            done()
          }, 200)
        }
      })
    })

    it('should define sortable', function () {
      assert.typeOf(test.sortable, 'function')
    })
  })
})
