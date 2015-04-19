/* ---------- */
/* setup */
var gulp = require('gulp');
var log = require('gulp-util').log;
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
/* ---------- */
/* error handling */
var reportError = function(error) {
  if( error.message !== undefined ) {
    log(error.message);
  }else{
    log(error);
  }
};
/* ---------- */
/* linting */
gulp.task('lint', function () {
  gulp.src(['src/html.sortable.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
      .on('error', reportError);
});
/* ---------- */
/* tasks */
gulp.task('test', ['lint']);
