const gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    $ = require('cheerio'),
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
    rimraf = require('gulp-rimraf'),
    p = require('path'),
    proj = p.resolve(__dirname).substring(p.resolve(__dirname).lastIndexOf('\\') + 1),
    hhp = `${proj}.hhp`,
    hhc = `${proj}.hhc`,
    hhk = `${proj}.hhk`,
    chm = `${proj}.chm`,
    path = {
        root: `${proj}`,
        build: {
            html: 'articles/',
            js: 'assets/',
            css: 'assets/',
            img: 'assets/images/',
            chm: 'dist',
            web: {
                articles: 'dist/web/articles/',
                assets: 'dist/web/assets/',
                index: 'dist/web/'
            }
        },
        src: {
            html: 'src/articles/*.htm*',
            js: 'src/assets/**/*.js',
            scss: 'src/assets/sass/*.scss',
            img: 'src/assets/images/**/*.*',
            chm: chm,
            web: {
                articles: 'articles/**/*.*',
                assets: ['assets/**/*.*', 'src/assets/*.css'],
                index: 'index.html'
            }
        },
        watch: {
            html: ['src/articles/**/*.*', 'src/assets/partials/*.*'],
            js: 'src/assets/**/*.js',
            scss: 'src/assets/sass/*.scss',
            img: 'src/assets/images/**/*.*',
            hhc: '*.hhc'
        }
    },
    get = (file) => {
        return fs.readFileSync(file, 'utf8', (err, data) => {
            if (err) console.error(err);
            return data;
        });
    },
    write = (file, text) => {
        return fs.writeFile(file, text, 'utf8', (err) => {
            if (err) console.error(err)
        });
    },

    makeHHK = (req) => {
        const hhToc = get(`${hhc}`);
        const header = hhToc.substring(0, hhToc.indexOf('<BODY>') + 6);
        const footer = hhToc.substring(hhToc.lastIndexOf('<\/UL>'));
        let index = '<UL>' + hhToc
            .substring(hhToc.indexOf('<UL>'),hhToc.lastIndexOf('<\/UL>'))
            .replace(/<UL>|<\/UL>/g, '')
            .replace(/<param name=\"Name\" value=\"(.+?)\">/g, '<param name="Name" value="$1"><param name="Name" value="$1">');        
        const html = `
                ${header}
                ${index}
                ${footer}
            `;
        write(`${hhk}`, html);
    },

    makeWeb = (req) => {
        const hhToc = get(`${hhc}`);
        const header = get(`src/assets/partials/webHeader.html`);
        const footer = get(`src/assets/partials/webFooter.html`);
        let toc = hhToc
            .substring(hhToc.indexOf('<UL>'))
            .replace(/<OBJECT type=\"text\/sitemap\">/g, '<a')
            .replace(/<param name=\"Name\" value=\"(.+?)\">/g, ' title="$1"')
            .replace(/<param name=\"Local\" value=\"(.+?)\">/g, ' href="$1" target="article"')
            .replace(/<\/OBJECT>/g, '></a>')
            .replace(/\"\s*\n\t*\s*/g, '" ')
            .replace(/<a\s*\n*/g, '<a ')
            .replace(/<a title="(.+?)"(.+?)>/g, '<a title="$1"$2>$1');
        toc = toc.substring(0, toc.indexOf('</BODY>'));
        let index = toc.replace(/<UL>|<\/UL>|<\/LI>|<!--|-->|,/g, '');
        toc = $(toc).attr("id", "toc");
        const compare = (a1, a2) => {
            var t1 = $(a1).text(), t2 = $(a2).text();
            return t1 > t2 ? 1 : (t1 < t2 ? -1 : 0);
        };
        const sortList = (list) => {
            const lis = list.split('<LI>');
            return lis.sort(compare);
        };
        index = `<UL id="index">${sortList(index).join('<LI>')}</UL>`;

        const html = `
                    ${header}
                    ${toc}
                    ${index}
                    ${footer}
                `;
        write('index.html', html);
    };


gulp.task('js:build', function () {
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

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(filerigger())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('chm:build', function () {
    makeHHK();
    makeWeb();
    return run(hhp).exec();
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('build', [
    'js:build',
    'style:build',
    'html:build',
    'image:build'
], function () {
    browserSync.reload();
    gulp.start('chm:build')
});

gulp.task('watch', function () {
    watch(path.watch.html, function (event, cb) {
        gulp.start('build');
    });
    watch(path.watch.scss, function (event, cb) {
        gulp.start('build');
    });
    watch(path.watch.js, function (event, cb) {
        gulp.start('build');
    });
    watch(path.watch.img, function (event, cb) {
        gulp.start('build');
    });
});


gulp.task('default', ['build','browser-sync', 'watch']);