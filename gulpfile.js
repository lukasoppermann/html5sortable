'use strict'
/* ---------- */
/* setup */
var gulp = require('gulp')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var pump = require('pump')
var umd = require('gulp-umd')
var strip = require('gulp-strip-code')

/* ---------- */
/* convert to umd */
gulp.task('umd', function () {
  return gulp.src('src/html.sortable.js')
    .pipe(strip({
      start_comment: 'start-testing',
      end_comment: 'end-testing'
    }))
    .pipe(umd({
      exports: function () {
        return 'sortable'
      },
      namespace: function () {
        return 'sortable'
      }
    }))
    .pipe(gulp.dest('dist/'))
})
/* ---------- */
/* build */
gulp.task('minify', ['umd'], function (cb) {
  // copy files to dist
  pump([
    gulp.src(['dist/html.sortable.js'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename({
      suffix: '.min'
    })),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest('./dist'),
    gulp.dest('./docs')
  ],cb)
})
/* ---------- */
/* tasks */
gulp.task('default', ['umd', 'minify'])
