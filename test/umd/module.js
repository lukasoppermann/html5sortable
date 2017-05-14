/* global describe,before,it */
// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/html.sortable.js', function () {
  let assert = require('chai').assert
  let path = require('path')
  const { JSDOM } = require('jsdom')
  const sortable = require('fs').readFileSync('./src/html.sortable.js', { encoding: 'utf-8' })

  describe('Assignment to global variable', function () {
    before(function () {
      window = (new JSDOM(``, { runScripts: 'dangerously' })).window
      // Execute my library by inserting a <script> tag containing it.
      const scriptEl = window.document.createElement('script')
      scriptEl.textContent = sortable
      window.document.head.appendChild(scriptEl)
    })

    it('sortable should be defined as a function', function () {
      assert.typeOf(window.sortable, 'function')
    })
  })

  describe('CommonJS Module', function () {
    it('should be able to require html.sortable', function () {
      var sortable = require('../../dist/html.sortable.js')
      assert.typeOf(sortable, 'function')
    })
  })

  describe('AMD (Asynchronous module definition)', function () {
    before(function () {
      window = JSDOM.fromFile('./test/umd/amd.html', { runScripts: 'dangerously' }).then(dom => {

      })
    })

    it('should define sortable', function () {
      console.log(window)
      assert.typeOf(window.requiredSortable, 'function')
    })
  })
})
