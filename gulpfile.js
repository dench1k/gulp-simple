const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");

const jsFiles = ["./src/js/lib.js", "./src/js/app.js"];

const cssFiles = [
  "./node_modules/normalize.css/normalize.css",
  "./src/css/styles.css",
  "./src/css/additional.css",
];

function styles() {
  return gulp
    .src(cssFiles)
    .pipe(concat("all.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("build/css"));
}

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(concat("all.js"))
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(gulp.dest("build/js"));
}

function watch() {
  gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/js/**/*.js", scripts);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
