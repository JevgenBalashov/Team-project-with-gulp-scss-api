const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
// const purgecss = require('gulp-purgecss')

// Налаштування browsersync
function browserServe(finish) {
    browsersync.init({
        server: {
            baseDir: './' // буде відкривати файл index.html що знаходиться в корені папки
        }
    })

    finish()
}

function browserReload(finish) {
    browsersync.reload();
    finish()
}

// видаляє весь вміст папки dist
function cleandist(finish) {
    del.sync('dist')
    finish()
}

function css() {
    return gulp.src('./src/style/**/*.scss')
    // компіляція scss файлів у css
    .pipe(sass())
    // вендорні автопрефікси
    .pipe(autoprefixer())
    // мініфікація css
    .pipe(cleanCSS())
    // .pipe(purgecss({
    //     content: ['./index.html']
    // }))
    // зібрати всі файли стилів в одну кучу та помістити в styles.min.css
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./dist'))
}

function javascript() {
    return gulp.src('./src/js/**/*.js')
    // збираємо всі js файли в scripts.min.js
    .pipe(concat('scripts.min.js'))
    // мініфікуємо javascript
    .pipe(uglify())
    // поміщаємо в папку dist
    .pipe(gulp.dest('./dist'))
}

// оптимізація картинок та копіювання їх у папку dist/img
function optimizeImages() {
    return gulp.src('./src/img/**.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
}

function watch() {
    gulp.watch('src/**/*.*', gulp.series(cleandist, gulp.parallel(css, javascript), browserReload))
}

exports.cleandist = cleandist;
exports.css = css;
exports.javascript = javascript;
exports.optimizeImages = optimizeImages;

// Будуємо проект - видаляємо папку dist, виконуємо функції css, javascript та optimizeImages
exports.build = gulp.series(cleandist, gulp.parallel(css, javascript), optimizeImages);
// Додаємо об'єднані та мініфіковані файли styles.min.css та scripts.min.js в папку dist, 
// запускаємо браузер; викликаємо функцію watch - при будь-якій зміні коду файлів в папці src 
// видаляємо папку dist та перезавантажуємо html-сторінку 
exports.dev = gulp.series(gulp.parallel(css, javascript), browserServe, watch);