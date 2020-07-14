const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const gcmq = require("gulp-group-css-media-queries");
const babel = require("gulp-babel");
const less = require("gulp-less");
const inject = require("gulp-inject");

const isDev = process.argv.indexOf("--dev") !== -1;
const isProd = !isDev;
const isSync = process.argv.indexOf("--sync") !== -1;

const jsFiles = ["./src/js/lib.js", "./src/js/app.js"];

// const cssFiles = [
//   "./node_modules/normalize.css/normalize.css",
//   "./src/css/general.css",
//   "./src/css/additional.css",
// ];

function styles() {
  return gulp
    .src("./src/css/style.less")
    .on("error", console.error.bind(console))
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(less())
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest("./build/css"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(concat("app.js"))
    .pipe(babel({ presets: ["@babel/env"] }))
    .on("error", console.error.bind(console))
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest("./build/js"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

// scripts alternative start
/*gulp.task('scripts', function () {
	return gulp.src('./js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./js/'));
});*/

function images() {
  return gulp.src("./src/images/**/*").pipe(gulp.dest("./build/images"));
}

function fonts() {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./build/fonts"));
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
  if (isSync) {
    browserSync.init({
      server: {
        baseDir: "./build/",
      },
    });
  }

  gulp.watch("./src/css/**/*.less", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./src/*.html", html);
}

function clear() {
  return del(["build/*"]);
}

function injectScripts() {
  var target = gulp.src("./src/index.html");
  var sources = gulp.src("./src/**/*.js", { read: false }, { relative: true });
  return target.pipe(inject(sources)).pipe(gulp.dest("./src"));
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("inject", injectScripts);
gulp.task(
  "build",
  gulp.series(
    clear,
    injectScripts,
    gulp.parallel(styles, images, fonts, html, scripts)
  )
);
gulp.task("dev", gulp.series("build", "watch"));
