'use strict';

const gulp = require('gulp'),
      clean = require('gulp-clean'),
      sequence = require('run-sequence'),
      include = require("gulp-include"),
      babel = require('gulp-babel'),  
      uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
      sassglob = require('gulp-sass-glob'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssnano = require('cssnano'),
      pump = require('pump'),         
      svgmin = require('gulp-svgmin'), 
      svgSprite = require("gulp-svg-sprite"),
      haml = require('gulp-haml'),
      htmlmin = require('gulp-htmlmin');

// Operational tasks
gulp.task('clear_public', () => {
  return gulp.src('public/*', {read: false})
  .pipe(clean());
});

// Scripts tasks
gulp.task('include', () => { 
  return gulp.src("app/scripts/main.js")  
  .pipe(include())
  .on('error', eatError)
  .pipe(gulp.dest("public/js"));
});

gulp.task('babel', () => {
  return gulp.src('public/js/*.js')  
  .pipe(babel({
    presets: ['es2015']
  }))
  .on('error', eatError)
  .pipe(gulp.dest('public/js'));
});

gulp.task('uglify', (cb) => {
  pump([
    gulp.src('public/js/*.js'),
    uglify(),
    gulp.dest('public/js')],
    cb);
});

gulp.task('scripts', () => {
  sequence('include', 'babel', 'uglify');
});


// CSS tasks
gulp.task('sass', () => {
  return gulp.src('app/styles/main.sass')  
  .pipe(sassglob())
  .pipe(sass())
  .on('error', eatError)
  .pipe(gulp.dest('public/css'));
});

gulp.task('postcss', () => {
  const plugins = [
  autoprefixer({browsers: ['last 10 versions']}),
  cssnano()];
  return gulp.src('public/css/*.css')  
  .pipe(postcss(plugins))
  .on('error', eatError)
  .pipe(gulp.dest('public/css'));
});

gulp.task('styles', () => {
  sequence('sass', 'postcss');
});


// Assets tasks
gulp.task('svgmin', () => {
  return gulp.src('app/images/*.svg')
  .pipe(svgmin({
    plugins: [{
      cleanupIDs: false
    }]
  }))
  .on('error', eatError)
  .pipe(gulp.dest('public/images'));
}); 

gulp.task('sprite', () => {
  return gulp.src('app/images/*.svg')
  .pipe(svgSprite([{ 
    shape : { 
      svgo: {
        plugins : [{
          removeTitle : true,
          cleanupIDs : false
        }]
      },
      dest : '.'
    }
  },
    { svg: {
      namespaceIDs: false
    } 
  }]))
  .on('error', eatError)
  .pipe(gulp.dest('public/images'));
});

gulp.task('assets', () => {
  sequence('svgmin');
});


// HTML tasks
gulp.task('haml', () => {
  return gulp.src('app/layouts/*.haml')  
  .pipe(haml())
  .on('error', eatError)
  .pipe(gulp.dest('public'));
});

gulp.task('htmlmin', () => {
  return gulp.src('public/*.html')  
  .pipe(htmlmin({collapseWhitespace: true}))
  .on('error', eatError)
  .pipe(gulp.dest('public'));
});

gulp.task('layouts', () => {
  sequence('haml', 'htmlmin');
});


// Common tasks
gulp.task('deploy', () => {
  sequence('clear_public', ['scripts', 'styles', 'assets', 'layouts']);
});

gulp.task('watch', () => {
  gulp.watch('app/images/*', ['assets']);
  gulp.watch('app/styles/**/*.sass', ['sass']);
  gulp.watch('app/scripts/**/*.js', ['include']);
  gulp.watch('app/layouts/**/*.haml', ['haml']);
})


// Aliases
gulp.task('d', ['deploy']);
gulp.task('w', ['watch']);
gulp.task('h', ['layouts']);
gulp.task('js', ['scripts']);
gulp.task('css', ['styles']);


function eatError(err) {
  console.log(err.toString());
  this.emit('end');
}