const { src, dest, series } = require('gulp');

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// gulp top level functions

// 1. gulp.tasks => define tasks

function minifyJS() {
    return src('src/**/*.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('dist'));
  }
  
  exports.default = series(minifyJS);
