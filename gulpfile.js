const
    gulp = require('gulp'),
    inc = require('gulp-file-include'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    path = require('path');

const
    src = {
        sass: path.resolve('./src/sass/**/*.scss'),
        html: path.resolve('./src/html/**/*.htm')
    },
    dest = {
        css: path.resolve('./build/assets/style.css'),
        html: path.resolve('./build/articles/')
    };

    gulp.task('watch:style', () => {
        return watch(src.sass, () => {
            gulp.src(src.sass)
                .pipe(sass())
                .pipe(gulp.dest(dest.css));
        });
    });
    gulp.task('watch:html', () => {
        return watch(src.html, () => {
            gulp.src(src.html)
                .pipe(inc())
                .pipe(gulp.dest(dest.html));
        });
    });
    gulp.task('default', ['watch:html','watch:style']);