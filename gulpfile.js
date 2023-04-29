import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import minify from 'gulp-minify';
import squoosh from 'gulp-libsquoosh';
import {deleteAsync} from 'del';
import csso from 'postcss-csso';
// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Минификация
//Styles

export const stylesMin = () => {
  return gulp.src('source/css/style.css', {sourcemaps: true})
  .pipe (postcss([
    csso ()
  ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
  .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace:true}))
  .pipe(gulp.dest('build'))
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(minify())
  .pipe(gulp.dest('build/js'))
}
//

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Copy

const copy = (done) => {
  gulp.src ([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

// Оптимизация изображений
//SVG

const svg = () =>
  gulp.src(['source/img/*.svg','source/img/sprite/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

export const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg:true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

//WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp:{}
  }))
  .pipe(gulp.dest('build/img'))
}
//
//Удалить папку build

export const clean = () => {
  return deleteAsync('build')
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html').on('change', browser.reload);
}


//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    stylesMin,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
);

//Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
gulp.series (
  server,
  watcher)
)
