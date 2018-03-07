var gulp = require('gulp');

var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
// var cssnano = require('gulp-cssnano');

gulp.task('default', function(){
  return gulp.src('index.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    //.pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});
