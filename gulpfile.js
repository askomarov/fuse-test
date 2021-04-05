const gulp = require("gulp");
const plumber = require("gulp-plumber"); //обработчик ошибок
const sourcemap = require("gulp-sourcemaps"); //добавляет карты кода для css
const sass = require("gulp-sass"); //делает из scss - css
const postcss = require("gulp-postcss"); //библиотека со своими настройками
const csso = require("gulp-csso"); //минификация стилей
const autoprefixer = require("autoprefixer"); //префиксы проставляет
const sync = require("browser-sync").create();
const htmlmin = require('gulp-htmlmin'); //минификация html
const fileinclude = require('gulp-file-include');
const webp = require("gulp-webp");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const del = require("del");
const terser = require("gulp-terser"); //обратка и минифик файлов js

//svg sprite
const sprite = () => {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("docs/img"))
};
exports.sprite = sprite;

//webp
const makewebp = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(webp({ quality: 70 }))
    .pipe(gulp.dest('source/img'));
};
exports.makewebp = makewebp;

//images
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}") //** - смотрит в любую вложенность
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('source/img'))
};
exports.images = images;

// Styles
const styles = (params) => {
  return gulp.src("source/sass/style.scss") //находим файлы в папке и какой файл
    .pipe(plumber())  // перерабатываем через функцию -кидаем файл в трубу
    .pipe(sourcemap.init()) //еще переработки через функции
    .pipe(sass()) //получаем готовый файл css
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write(".")) //положил файл с картами кодами в корневую папку
    .pipe(gulp.dest("docs/css")) //галп положи файлы в папку.
    .pipe(sync.stream());
};
exports.styles = styles;  //говорим галпу что есть теперь такая задача

// html
const html = () => {
  return gulp.src("source/*.html")
    .pipe(fileinclude())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('docs'));
};
exports.html = html;

//javascript
// const scripts = () => {
//   return gulp.src('source/js/main.js')
//     .pipe(gulp.dest('docs/js'))
//     .pipe(terser())
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('docs/js'))
//     .pipe(sync.stream());
// }
// exports.scripts = scripts;

//copy
const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico",
    "source/img/**",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("docs"));
};
exports.copy = copy;

//clean
const clean = () => {
  return del("docs");
};
exports.clean = clean;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "docs/"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

//docs
const docs = gulp.series(
  clean,
  gulp.parallel(html, styles,
    // scripts,
    sprite), gulp.series(copy));
exports.docs = docs;

// Watcher
const watcher = () => {
  // gulp.watch("source/js/**/*.js", gulp.series("scripts"));
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
}

exports.default = gulp.series(
  docs, server, watcher
);
