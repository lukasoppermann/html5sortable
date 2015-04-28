'use strict';
/* ---------- */
/* variables */
var srcFile = 'html.sortable.src.js';
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
var mochify = require('mochify');
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
  gulp.src([
    'gulpfile.js',
    'src/' + srcFile,
    'src/html.sortable.angular.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
      .on('error', reportError);
});
/* ---------- */
/* Rename file */
gulp.task('rename', function() {
  return gulp.src('src/' + srcFile)
    .pipe(rename('html.sortable.js'))
    .pipe(gulp.dest('src/'));
});
/* ---------- */
/* build */
gulp.task('build-version', ['rename'], function() {
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
    .pipe(gulp.dest('./dist'))
    // remove previously renamed file
    .on('end', function() {
      del.sync('./src/html.sortable.js', {force: true});
    });

});
/* bump version */
gulp.task('bump-version', function() {
  gulp.src(['./package.json', './bower.json'])
  .pipe(bump())
  .pipe(gulp.dest('./'));
});
/* ---------- */
/* tasks */
gulp.task('test', function() {
  return mochify('./test/*.js', {}).bundle();
});
gulp.task('build', ['lint', 'test', 'rename', 'build-version']);
