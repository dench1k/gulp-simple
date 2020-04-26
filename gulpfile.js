const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");

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
    .pipe(gulp.dest("build/css"));
}

function scripts() {}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
