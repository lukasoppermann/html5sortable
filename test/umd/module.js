/* global describe,before,it */
// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/html.sortable.js', function () {
  var assert = require('chai').assert
  var path = require('path')
  const jsdom = require('jsdom')
  const { JSDOM } = jsdom

  describe('Assignment to global variable', function () {
    before(function (done) {
      global.sortable = undefined
      global.document = new JSDOM(`<!DOCTYPE html><html><script src="dist/html.sortable.js" /></html>`,
        {
          runScripts: 'dangerously',
          resources: 'usable'
        }
      )
      setTimeout(() => done(), 500)
    })

    it('sortable should be defined as a function', function () {
      assert.typeOf(global.document.window.sortable, 'function')
    })
  })

  describe('CommonJS Module', function () {
    before(function () {
      global.document = new JSDOM(`<!DOCTYPE html>`)
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
      JSDOM.fromFile(path.resolve(__dirname, 'amd.html'), {
        runScripts: 'dangerously',
        resources: 'usable'
      }).then(dom => {
        test.requirejs = dom.window.require
        setTimeout(function () {
          // timeout is needed so requirejs can load the resources
          test.sortable = dom.window.sortable
          done()
        }, 200)
      })
    })

    it('should define sortable', function () {
      assert.typeOf(test.sortable, 'function')
    })
  })
})
