/* global describe,before,it,afterEach */
// testing the UMD (module loading capabilities)
describe('Testing UMD (Universal Module Definition) against /dist/', () => {
  let window
  const helper = require('../helper')
  const { JSDOM } = require('jsdom')
  const sortable = require('fs').readFileSync('./_test/html5sortable.js', { encoding: 'utf-8' })

  describe('Assignment to global variable', () => {
    beforeAll(function () {
      window = (new JSDOM(``, { runScripts: 'dangerously' })).window
      // Execute my library by inserting a <script> tag containing it.
      const scriptEl = window.document.createElement('script')
      scriptEl.textContent = sortable
      window.document.head.appendChild(scriptEl)
    })

    test('sortable should be defined as a function', () => {
      expect(typeof window.sortable).toBe('function')
    })
  })

  describe('CommonJS Module', () => {
    test('should be able to require html.sortable', () => {
      var sortable = require('../../_test/html5sortable.cjs.js')
      expect(typeof sortable).toBe('function')
    })
  })

  describe('AMD (Asynchronous module definition)', () => {
    test('should define sortable', () => {
      window = (new JSDOM(``, { runScripts: 'dangerously', url: 'file:///Users/lukasoppermann/Code/html5sortable/' })).window
      const requirejs = require('fs').readFileSync('./node_modules/requirejs/require.js', { encoding: 'utf-8' })
      const scriptEl = window.document.createElement('script')
      scriptEl.textContent = requirejs
      window.document.head.appendChild(scriptEl)
      scriptEl.textContent = `
        requirejs(['./dist/html5sortable.amd'], function (sortable) {
          window.requiredSortable = sortable
        })`
      window.document.head.appendChild(scriptEl)
      setTimeout(function () {
        expect(typeof window.requiredSortable).toBe('function')
      }, 100)
    })
  })

  afterEach(() => {
    helper.writeCoverage(window)
  })
})
