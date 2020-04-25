const gulp = require("gulp");
const concat = require("gulp-concat");

function styles() {
  return gulp
    .src("./src/css/**/*.css")
    .pipe(concat("all.css"))
    .pipe(gulp.dest("build/css"));
}

function scripts() {}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
