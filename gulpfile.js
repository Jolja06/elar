'use strict';

var 
  gulp = require('gulp'),
  browserSync = require('browser-sync'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  merge = require('merge-stream'),
  cssGlobbing = require('gulp-css-globbing'),
  rename = require("gulp-rename"),
  wiredep = require('wiredep').stream,
  changed = require('gulp-changed'),
  useref = require('gulp-useref');

var paths = {
  src: {
    app : 'app',
    html : 'app/*.html',
    js : 'app/js/**/*.js',
    css : 'app/css/*.css',
    scss : 'app/sass/**/*.scss',
    jade : 'app/jade/**/*.jade',
    sprite: 'app/img/sprites/'
  },
  dest: {
    css : 'app/css',
    app : 'app/',
    scss : 'app/sass',
    img : 'app/img/'
  }
};

//Сервер
gulp.task('server', function () {
  browserSync({
    port : 9000,
    server: {
      baseDir : paths.src.app
    }
  });
});

//Слежка
gulp.task('watch', function () {
  gulp.watch([
    paths.src.html,
    paths.src.js,
    paths.src.css,
  ]).on('change', browserSync.reload);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch(paths.src.jade, ['jade']);
  gulp.watch(paths.src.scss, ['scss']);
});

//Слежка за Bower
gulp.task('wiredep', function () {
  gulp.src(paths.src.html)
    //.pipe(plumber())
    .pipe(wiredep({
      directory : "app/bower"
    }))
    .pipe(gulp.dest(paths.dest.app));
});

//jade
gulp.task('jade', function () {
     return gulp.src('app/jade/index.jade')
      .pipe(plumber())
      .pipe(jade({
          pretty: true
      }))
    .pipe(gulp.dest(paths.dest.app));
});

//scss
gulp.task('scss', function() {
  return gulp.src('app/sass/main.scss')
   .pipe(cssGlobbing({
        extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(prefix("last 2 version", "> 5%", "ie 9"))
    .pipe(sourcemaps.write())
    .pipe(rename('main.css'))
    .pipe(gulp.dest(paths.dest.css));

});

//build

gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref({}))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['server', 'watch']);