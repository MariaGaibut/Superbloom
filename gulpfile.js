const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber');

// функция обновления страницы при изменениях в файлах билда
function browserSyncFunc(){
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    })
}
// функция копирования изображений
function images() {
    return gulp.src('src/assets/imgs/**/*')
        .pipe(gulp.dest('build/assets/imgs'))
        .pipe(browserSync.stream())
}
// функция преобразования scss в css
function scss() {
    return gulp.src('src/assets/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        grid: 'autoplace',
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.stream())
}
// функция для преобразования pug в html
function pugFunc() {
    return gulp.src('src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty:true
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build'))
    .on('end', browserSync.reload)
}
// функция отслеживания изменения в файлах исходников
function watcher() {
    gulp.watch('src/pug/**/*.pug', pugFunc)
    gulp.watch('src/assets/scss', scss)
    gulp.watch('src/assets/imgs/**/*', images)
}
//команда запуска по умолчанию (gulp)
gulp.task(
    'default',
    gulp.series(
        gulp.parallel(browserSyncFunc, watcher),
        gulp.parallel(scss, images, pugFunc)
    )
);
