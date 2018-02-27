'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const spawn = require('child_process').spawnSync

module.exports = {
  instrument: function (sourcePath) {
    const instrumented = spawn(process.execPath, ['./node_modules/.bin/nyc', 'instrument', path.resolve(process.cwd(), sourcePath)], {
      cwd: process.cwd(),
      env: process.env
    })
    return instrumented.stdout.toString('utf8')
  },
  writeCoverage: function (window) {
    mkdirp.sync('./.nyc_output')
    fs.writeFileSync('./.nyc_output/' + Date.now() + '_' + process.pid + '.json', JSON.stringify(window.__coverage__), 'utf8')
  }
}
