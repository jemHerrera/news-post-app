const { src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass')); // This is different from the video since gulp-sass no longer includes a default compiler. Install sass as a dev dependency `npm i -D sass` and change this line from the video.
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');

//compile, prefix, and min scss
function compilescss() {
  return src('styles/style.scss') // change to your source directory
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest('docs')) // change to your final/public directory
};

//watchtask
function watchTask(){
  watch('styles/style.scss', compilescss); // change to your source directory
}

// Default Gulp task 
exports.default = series(
  compilescss,
  watchTask
);