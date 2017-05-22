/* global describe,before,it,afterEach */
// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/html.sortable.js', function () {
  let assert = require('chai').assert
  let window = null
  const helper = require('../helper')
  const { JSDOM } = require('jsdom')
  const sortable = helper.instrument('./src/html.sortable.js')

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
      // assert.typeOf(window.requiredSortable, 'function')
    })
  })

  afterEach(() => {
    helper.writeCoverage(window)
  })
})
