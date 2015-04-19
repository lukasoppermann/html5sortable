'use strict';
/* ---------- */
/* setup */
var gulp = require('gulp');
var log = require('gulp-util').log;
var rename = require('gulp-rename');
var del = require('del');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
/* ---------- */
/* error handling */
var reportError = function(error) {
  if (error.message !== undefined) {
    log(error.message);
  } else {
    log(error);
  }
};
/* ---------- */
/* linting */
gulp.task('lint', function() {
  gulp.src(['gulpfile.js', 'src/html.sortable.js', 'src/html.sortable.angular.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
      .on('error', reportError);
});
/* ---------- */
/* build */
gulp.task('build-version', function() {
  // clear dist
  del.sync('./dist/*', {force: true});
  // copy files to dist
  gulp.src(['src/html.sortable.js', 'src/html.sortable.angular.js'])
    .pipe(gulp.dest('./dist'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(jshint())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});
/* bumo version */
gulp.task('bump-version', function() {
  gulp.src(['./package.json', './bower.json'])
  .pipe(bump())
  .pipe(gulp.dest('./'));
});
/* ---------- */
/* tasks */
gulp.task('test', ['lint']);
gulp.task('build', ['test', 'build-version', 'bump-version']);
