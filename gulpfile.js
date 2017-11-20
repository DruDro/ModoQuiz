'use strict';

const gulp = require('gulp'),
    watch = require('gulp-watch'),
    filerigger = require('gulp-file-include'), 
    sass = require('gulp-sass'),
    sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    },
    browsers = ['last 3 versions', 'ie >= 9'],
    autoprefixer = require('gulp-autoprefixer'),
    autoprefixerOptions = {
        browsers: browsers
    },
    run = require('gulp-run'),
    fs = require('fs'),
    p = require('path'),
    path = {
        root: p.resolve(__dirname),
        build: {
            html: 'articles/',
            js: 'assets/',
            css: 'assets/',
            img: 'assets/images/'
        },
        src: {
            html: 'src/articles/*.htm*', 
            js: 'src/assets/**/*.js',
            scss: 'src/assets/sass/*.scss',
            img: 'src/assets/images/**/*.*'
        },
        watch: {
            html: 'src/articles/**/*.htm*', 
            js: 'src/assets/**/*.js',
            scss: 'src/assets/sass/*.scss',
            img: 'src/assets/images/**/*.*',
            hhc: '*.hhc'
        }
    };

gulp.task('js:build', function() {
    gulp.src(path.src.js) 
        .pipe(filerigger({
            prefix: '@@',
            basepath: path.root
          }))
        .pipe(gulp.dest(path.build.js)); 
});


gulp.task('style:build', function () {
    gulp.src(path.src.scss)
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('html:build', function() {
    gulp.src(path.src.html) 
        .pipe(filerigger())
        .pipe(gulp.dest(path.build.html)); 
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(gulp.dest(path.build.img));
});

gulp.task('chm:build', function() {
    return run('ModoQuiz.hhp').exec();
});



gulp.task('build', [
    'js:build',
    'style:build',
    'html:build',
    'image:build',
    'chm:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
        gulp.start('chm:build');
    });
    watch([path.watch.scss], function(event, cb) {
        gulp.start('style:build');
        gulp.start('chm:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
        gulp.start('chm:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
        gulp.start('chm:build');
    });
});




gulp.task('default', ['build', 'watch']);