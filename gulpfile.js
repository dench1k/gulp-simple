const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");

const isDev = process.argv.indexOf("--dev") !== -1;
const isProd = !isDev;
const isSync = process.argv.indexOf("--sync") !== -1;

const jsFiles = ["./src/js/lib.js", "./src/js/app.js"];

const cssFiles = [
  "./node_modules/normalize.css/normalize.css",
  "./src/css/styles.css",
  "./src/css/additional.css",
];

function styles() {
  return gulp
    .src(cssFiles)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(concat("all.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest("build/css"))
    .pipe(gulpif(isSync, browserSync.stream()));
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
    .pipe(gulp.dest("build/js"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
  if (isSync) {
    browserSync.init({
      server: {
        baseDir: "./",
      },
    });
  }

  gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

function clear() {
  return del(["build/*"]);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("build", gulp.series(clear, gulp.parallel(styles, scripts)));
gulp.task("dev", gulp.series("build", "watch"));
