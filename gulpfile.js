'use strict';

// modules
const assemble    = require('fabricator-assemble');
const browserSync = require('browser-sync').create();
const csso        = require('gulp-csso');
const del         = require('del');
const fs          = require('fs');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const gulpif      = require('gulp-if');
const imagemin    = require('gulp-imagemin');
const prefix      = require('gulp-autoprefixer');
const rename      = require('gulp-rename');
const reload      = browserSync.reload;
const runSequence = require('run-sequence');
const sass        = require('gulp-sass');
const webpack     = require('webpack');

const hbRepeat    = require('handlebars-helper-repeat');

const regexRename = require('gulp-regex-rename');
const replace     = require('gulp-replace');
const pngquant    = require('imagemin-pngquant');
const svgstore    = require('gulp-svgstore');

const rp = (path) => fs.realpathSync(path);

const assetsPath = `${__dirname}/src/assets`;

// configuration
const config = {
  dev: gutil.env.dev,
  src: {
    scripts: {
      fabricator: `${assetsPath}/fabricator/scripts/fabricator.js`,
      toolkit: `/${assetsPath}/toolkit/scripts/toolkit.js`
    },
    styles: {
      fabricator: [
        `${assetsPath}/fabricator/styles/fabricator.scss`,
      ],
      toolkit: [
        `${assetsPath}/toolkit/scss/*.**scss`,
      ],
    },
    images: `${assetsPath}/toolkit/img/raw/**/*`,
    icons: `${assetsPath}/toolkit/img/raw/svg/inline-icons/**/*`,
    fonts: `${assetsPath}/toolkit/fnt/**/*`,
    views: 'src/toolkit/views/*.html',
  },
  dest: 'dist'
};


// webpack
const webpackConfig = require('./webpack.config')(config);
const webpackCompiler = webpack(webpackConfig);

const watchStyles = () => {
  gulp.watch(`${assetsPath}/fabricator/styles/**/*.scss`, ['styles:fabricator:watch']);
  gulp.watch(fs.realpathSync(`${assetsPath}/toolkit/scss`) + '/**/*.scss', ['styles:toolkit:watch']);
};

// clean
gulp.task('clean', function (cb) {
  return del([config.dest], cb);
});


// styles
gulp.task('styles:fabricator', function () {
  return gulp.src(config.src.styles.fabricator)
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
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
  assemble({
    helpers: {
      repeat: hbRepeat,
    },
  });
  done();
});

gulp.task('watch:styles', watchStyles);
gulp.task('styles:fabricator:watch', ['styles:fabricator'], reload);
gulp.task('styles:toolkit:watch', ['styles:toolkit', 'styles:fabricator'], reload);

// server
gulp.task('serve', function () {

  browserSync.init({
    server: {
      baseDir: config.dest
    },
    injectChanges: true,
    notify: false,
    logPrefix: 'FABRICATOR',
  });

  /**
   * Because webpackCompiler.watch() isn't being used
   * manually remove the changed file path from the cache
   */
  function webpackCache(e) {
    const keys = Object.keys(webpackConfig.cache);
    let key, matchedKey;
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
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

  watchStyles();

  gulp.task('assemble:watch', ['assemble'], reload);
  gulp.watch('src/**/*.{html,md,json,yml}', ['assemble:watch']);

  gulp.task('scripts:watch', ['scripts'], reload);
  gulp.watch([
    `${assetsPath}/{fabricator,toolkit}/scripts/**/*.js`,
  ], ['scripts:watch']).on('change', webpackCache);

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
  const tasks = [
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
