'use strict';

// modules
var assemble    = require('fabricator-assemble');
var browserSync = require('browser-sync').create();
var csso        = require('gulp-csso');
var del         = require('del');
var fs          = require('fs');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var gulpif      = require('gulp-if');
var imagemin    = require('gulp-imagemin');
var prefix      = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var reload      = browserSync.reload;
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var webpack     = require('webpack');

const regexRename = require('gulp-regex-rename');
const replace     = require('gulp-replace');
const pngquant    = require('imagemin-pngquant');
const svgstore    = require('gulp-svgstore');


// configuration
var config = {
  dev: gutil.env.dev,
  src: {
    scripts: {
      fabricator: './src/assets/fabricator/scripts/fabricator.js',
      toolkit: './src/assets/toolkit/scripts/toolkit.js'
    },
    styles: {
      fabricator: 'src/assets/fabricator/styles/fabricator.scss',
      toolkit: 'src/assets/toolkit/assets/css/scss/style.scss'
    },
    images: 'src/assets/toolkit/assets/img/**/*',
    icons: 'src/assets/toolkit/assets/img/raw/svg/inline-icons/**/*',
    fonts: 'src/assets/toolkit/assets/fnt/**/*',
    views: 'src/toolkit/views/*.html',
  },
  dest: 'dist'
};


// webpack
var webpackConfig = require('./webpack.config')(config);
var webpackCompiler = webpack(webpackConfig);


// clean
gulp.task('clean', function (cb) {
  return del([config.dest], cb);
});


// styles
gulp.task('styles:fabricator', function () {
  return gulp.src(config.src.styles.fabricator)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix('last 1 version'))
    .pipe(gulpif(!config.dev, csso()))
    .pipe(rename('f.css'))
    .pipe(gulp.dest(config.dest + '/assets/styles'))
    .pipe(gulpif(config.dev, browserSync.stream()));
});

gulp.task('styles:toolkit', function () {
  return gulp.src(config.src.styles.toolkit)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix('last 1 version'))
    .pipe(gulpif(!config.dev, csso()))
    .pipe(gulp.dest(config.dest + '/assets/css'))
    .pipe(gulpif(config.dev, browserSync.stream()));
});

gulp.task('styles', ['styles:fabricator', 'styles:toolkit']);


// scripts
gulp.task('scripts', function (done) {
  webpackCompiler.run(function (error, result) {
    if (error) {
      gutil.log(gutil.colors.red(error));
    }
    result = result.toJson();
    if (result.errors.length) {
      result.errors.forEach(function (error) {
        gutil.log(gutil.colors.red(error));
      });
    }
    done();
  });
});


// images
gulp.task('images', ['favicon'], function () {
  return gulp.src(config.src.images)
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/assets/img'));
});

gulp.task('icons', function () {
  return gulp.src(config.src.icons)
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(imagemin({
      svgoPlugins: [
        { removeViewBox: false },
      ],
    }))
    .pipe(svgstore())
    .pipe(regexRename(/\.svg/, '.svg.html'))
    .pipe(gulp.dest('src/views/layouts/includes'))
});

// fonts
gulp.task('fonts', function () {
  return gulp.src(config.src.fonts)
    .pipe(gulp.dest(config.dest + '/assets/fnt'));
});

gulp.task('favicon', function () {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest(config.dest));
});


// assemble
gulp.task('assemble', function (done) {
  assemble();
  done();
});


// server
gulp.task('serve', function () {

  browserSync.init({
    server: {
      baseDir: config.dest
    },
    notify: false,
    logPrefix: 'FABRICATOR',
    injectChanges: true
  });

  /**
   * Because webpackCompiler.watch() isn't being used
   * manually remove the changed file path from the cache
   */
  function webpackCache(e) {
    var keys = Object.keys(webpackConfig.cache);
    var key, matchedKey;
    for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      key = keys[keyIndex];
      if (key.indexOf(e.path) !== -1) {
        matchedKey = key;
        break;
      }
    }
    if (matchedKey) {
      delete webpackConfig.cache[matchedKey];
    }
  }

  gulp.task('assemble:watch', ['assemble'], reload);
  gulp.watch('src/**/*.{html,md,json,yml}', ['assemble:watch']);

  gulp.task('styles:fabricator:watch', ['styles:fabricator'], reload);
  gulp.watch('src/assets/fabricator/styles/**/*.scss', ['styles:fabricator:watch']);

  gulp.task('styles:toolkit:watch', ['styles:toolkit', 'styles:fabricator'], reload);
  gulp.watch(fs.realpathSync('src/assets/toolkit') + '/**/*.scss', ['styles:toolkit:watch']);

  gulp.task('scripts:watch', ['scripts'], reload);
  gulp.watch('src/assets/{fabricator,toolkit}/scripts/**/*.js', ['scripts:watch']).on('change', webpackCache);

  gulp.task('images:watch', ['images'], reload);
  gulp.watch(config.src.images, ['images:watch']);

  gulp.task('icons:watch', ['icons'], reload);
  gulp.watch(config.src.icons, ['icons:watch']);

  gulp.task('fonts:watch', ['fonts'], reload);
  gulp.watch(config.src.fonts, ['fonts:watch']);

});


// default build task
gulp.task('default', ['clean'], function () {

  // define build tasks
  var tasks = [
    'styles',
    'scripts',
    'icons',
    'images',
    'fonts',
    'assemble'
  ];

  // run build
  runSequence(tasks, function () {
    if (config.dev) {
      gulp.start('serve');
    }
  });

});
