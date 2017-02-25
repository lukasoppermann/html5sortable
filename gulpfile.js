'use strict'
/* ---------- */
/* variables */
var srcFile = 'html.sortable.src.js'
/* ---------- */
/* setup */
var gulp = require('gulp')
var rename = require('gulp-rename')
var del = require('del')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var umd = require('gulp-umd')
var strip = require('gulp-strip-code')

/* ---------- */
/* convert to umd */
gulp.task('umd', function () {
  return gulp.src('src/' + srcFile)
    .pipe(strip({
      // jscs:disable
      start_comment: 'start-testing',
      end_comment: 'end-testing'
      // jscs:enable
    }))
    .pipe(umd({
      exports: function () {
        return 'sortable'
      },
      namespace: function () {
        return 'sortable'
      }
    }))
    .pipe(rename('html.sortable.js'))
    .pipe(gulp.dest('src/'))
})
/* ---------- */
/* build */
gulp.task('build-version', ['umd'], function () {
  // clear dist
  del.sync('./dist/*', {force: true})
  // copy files to dist
  gulp.src(['src/html.sortable.js'])
    .pipe(gulp.dest('./dist'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    // remove umd
    .on('end', function () {
      del.sync('./src/html.sortable.js', {force: true})
    })
})
/* ---------- */
/* tasks */
gulp.task('build', ['umd', 'build-version', 'test'])
