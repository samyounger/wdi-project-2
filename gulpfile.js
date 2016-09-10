const gulp     	       = require("gulp");                     // => use gulp
const babel    	       = require("gulp-babel");               // => es6 to es6 conversion
const cleanCSS 	       = require("gulp-clean-css");           // => minify css
const stripCssComments = require('gulp-strip-css-comments');  // => strip comments from css
const sass 	   	       = require("gulp-sass");                // => write scss and convert to css
const autoprefixer     = require("gulp-autoprefixer");        // => add web prefixes to CSS
const uglify           = require("gulp-uglify");              // => uglify js
const livereload       = require("gulp-livereload");          // => no browser refresh on changes
const nodemon          = require("gulp-nodemon");             // => run nodemon
const filter           = require('gulp-filter');              // => selects files of a certain type
const flatten          = require('gulp-flatten');             // => brings all files into one directory
const concat           = require('gulp-concat');              // => compress multiple files into one
const order            = require('gulp-order');               // => change order of gulp tasks
const sourcemaps       = require('gulp-sourcemaps');          // => ability to refer back to pre-compiled=
const cache            = require('gulp-cached');              // => only look at files that have changed
const mainBowerFiles   = require('main-bower-files');         // => grab main files for bower
const del              = require('del');                      // => delete files from directory
const replace = require('gulp-replace');
const strip = require('gulp-strip-comments');

const bower            = mainBowerFiles({
  "overrides": {
    "bootstrap": {
      "main": [
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js",
      ]
    },
    "font-awesome": {
      "main": "css/font-awesome.css"
    }
  }
});

const src  = "src";
const dist = "public";

// bower
gulp.task('bower', [
  'bower:js',
  'bower:css',
  'bower:fonts',
]);

gulp.task('bower:js', () => gulp.src(bower)
  .pipe(cache('bower:js'))
  .pipe(filter(['**/*.js']))
  // .pipe(sourcemaps.init())
  .pipe(concat('_bower.js'))
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${src}/js`)));
gulp.task('bower:css', () => gulp.src(bower)
  .pipe(cache('bower:css'))
  .pipe(filter(['**/*.css}']))
  // .pipe(sourcemaps.init({loadMaps:true}))
  .pipe(concat('_bower.scss'))
  .pipe(stripCssComments())
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${src}/scss`)));
gulp.task('bower:fonts', () => gulp.src(bower)
  .pipe(cache('bower:fonts'))
  .pipe(filter(['**/*.{eot,svg,ttf,woff,woff2}']))
  .pipe(flatten())
  .pipe(gulp.dest(`${src}/fonts`)));


// nodemon
gulp.task('nodemon', () => {
  return nodemon({
    script: 'index.js',
    // ignore: [
    //   'public/',
    //   'src/',
    // ]
  });
});


// sass
gulp.task('sass', () => {
	return gulp.src(`${src}/scss/style.scss`)
    .pipe(cache('sass'))
    .pipe(sass(sass()).on('error', sass.logError))
    // .pipe(sourcemaps.init())
    .pipe(stripCssComments())
    .pipe(cleanCSS({ compatibility: "ie8"}))
    // .pipe(sourcemaps.write(''))
    .pipe(flatten())
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${dist}/css`))
    .pipe(livereload());
});

// scripts & es6
gulp.task("scripts", () => {
	return gulp.src(`${src}/**/*.js`)
    .pipe(cache('scripts'))
		.pipe(babel({
			presets: ["es2015"],
      compact: true,
      ignore: [
        '_bower.js',
      ]
		}))
    .pipe(flatten())
    .pipe(order([
      "_bower.js",
      "**/*.js"
    ]))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`${dist}/js`));
});

gulp.task('copy', [
  'copy:fonts',
  'copy:images'
]);

// copy fonts from src to dist
gulp.task("copy:fonts", () => {
  return gulp.src(`${src}/**/*.{eot,svg,ttf,woff,woff2}`)
    .pipe(gulp.dest(dist));
});
// copy images  from src to dist
gulp.task("copy:images", () => {
  return gulp.src(`${src}/**/*.{png,gif,jpg,ico}`)
    .pipe(gulp.dest(dist));
});

// clean public
gulp.task('clean:public', () => {
  return del([
    'public/**/*',
  ]);
});

// watch changes
gulp.task("watch", () => {
	  livereload.listen();
    gulp.watch(`${src}/**/*.js, !${src}/js/_bower.js`, ['scripts']);
	  gulp.watch(`${src}/**/*.scss, !${src}/js/_bower.scss`, ['sass']);
});

gulp.task("default", [
  'clean:public',
  'bower',
  'sass',
  'copy',
  'scripts',
  'nodemon',
  'watch',
]);
