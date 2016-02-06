const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const path = require('path');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

const source_dir = path.join(__dirname, 'src');

const js_source_dir = path.join(source_dir, 'js');
const js_app_source_path = path.join(js_source_dir, 'main.js');

const dest_dir = path.join(__dirname, 'public');
const assets_dir = path.join(dest_dir, 'assets');
const js_app_dest_dir = path.join(assets_dir, 'js');

gulp.task('js', () => {
    const bundle = browserify(js_app_source_path).bundle();
    return bundle
        .pipe(source('snake.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(js_app_dest_dir));
});

gulp.task('default', ['js']);
