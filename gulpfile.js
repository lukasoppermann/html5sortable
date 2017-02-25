'use strict'
/* ---------- */
/* setup */
var gulp = require('gulp')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var umd = require('gulp-umd')
var strip = require('gulp-strip-code')

/* ---------- */
/* convert to umd */
gulp.task('umd', function () {
  return gulp.src('src/html.sortable.js')
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
    .pipe(gulp.dest('dist/'))
})
/* ---------- */
/* build */
gulp.task('minify', ['umd'], function () {
  // copy files to dist
  gulp.src(['dist/html.sortable.js'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./docs'))
})
/* ---------- */
/* tasks */
gulp.task('default', ['umd', 'minify'])
