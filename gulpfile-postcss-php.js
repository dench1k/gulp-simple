var gulp = require("gulp");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var postcssinitial = require("postcss-initial");
var atImport = require("postcss-import");
var discardDuplicates = require("postcss-discard-duplicates");
var nesting = require("postcss-nesting");
var pxtorem = require("postcss-pxtorem");
var browserSync = require("browser-sync").create();
var calcFunction = require("postcss-calc-function").default;
var cssvariables = require("postcss-css-variables");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");
var ext_replace = require("gulp-ext-replace");

gulp.task("css", function () {
  var plugins = [
    cssvariables(),
    calcFunction(),
    atImport(),
    postcssinitial([require("postcss-initial")({ reset: "inherited" })]),
    nesting(),
    discardDuplicates(),
    autoprefixer({
      overrideBrowserslist: ["last 4 version"],
      cascade: false,
    }),
    pxtorem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ["font", "font-size", "line-height", "letter-spacing"],
      selectorBlackList: [],
      replace: false,
      mediaQuery: false,
      minPixelValue: 0,
    }),
  ];

  return (
    gulp
      .src("./src/css/*.pcss")
      .pipe(postcss(plugins))
      .pipe(cleanCSS())
      .pipe(ext_replace(".css", ".pcss"))
      // .pipe(concat('main.min.css'))
      .pipe(gulp.dest("./dest/css"))
      .pipe(browserSync.stream())
  );
});

gulp.task("scripts", function () {
  return gulp.src("./js/*.js").pipe(concat("all.js")).pipe(gulp.dest("./js/"));
});

browserSync.init({
  open: "external",
  host: "my-website.loc",
  proxy: "my-website.loc",
  port: 8080,
});

gulp.task("serve", function (done) {
  gulp.watch("src/css/*.pcss", gulp.series("css"));
  gulp.watch(["*.php", "auction/*.php"]).on("change", () => {
    browserSync.reload();
  });
});

gulp.task("default", gulp.series("css", "scripts", "serve"));
