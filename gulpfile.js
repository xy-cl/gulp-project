var gulp = require('gulp'),
   less = require('gulp-less'),
   livereload = require('gulp-livereload'),
   babel = require("gulp-babel"),
   minifycss = require('gulp-minify-css'),
   concat = require('gulp-concat'),
   uglify = require('gulp-uglify'),
   rename = require('gulp-rename'),
   notify = require('gulp-notify'),
   del = require('del'),
   LessPluginAutoPrefix = require('less-plugin-autoprefix'),
   plumber = require('gulp-plumber'),
   //livereload
   connect = require('gulp-connect'),
   proxy = require('http-proxy-middleware'),
   proxyConfigArr = require('./proxy.config'),
  //  browserify
   browserify  = require('browserify'),
   babelify    = require('babelify'),
   source      = require('vinyl-source-stream'),
   buffer      = require('vinyl-buffer'),
   sourcemaps  = require('gulp-sourcemaps'),
// handleErrors = require('./util/handleErrors'),
   //gulp-html-import
   htmlImport = require('gulp-html-import'),

   autoprefix = new LessPluginAutoPrefix({
     browsers: ["last 5 versions"],
     cascade: true
   });

gulp.task('commonjs',['js'],function () {
    return browserify({entries: './js/main.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
//      .on('error', handleErrors)
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task("js", function () {
    return gulp.src(["js/**","!js/main.js"])
          .pipe(gulp.dest('build/js'))
          .pipe(connect.reload());
});

gulp.task('style', function() {
   return gulp.src('less/**')
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//防止less编译出错
      .pipe(less({
          plugins: [autoprefix]
      }))
      // .pipe(minifycss())
      .pipe(gulp.dest('build/css'))
      .pipe(connect.reload());
});

//gulp.task("src", function () {
//  return gulp.src("src/**")
//      .pipe(gulp.dest("build/src"))
//});

gulp.task('html', function () {
    gulp.src('html/**')
        .pipe(htmlImport('components/'))
        .pipe(gulp.dest('build/html'))
        .pipe(connect.reload());
})

gulp.task('clean', function (cb) {
  del([
    'build/**',
    // 我们不希望删掉这个文件，所以我们取反这个匹配模式
    // '!build/src'
  ], cb);
});

//定义livereload任务
gulp.task('connect', function () {
   connect.server({
       host:'0.0.0.0',
       port: 8080,
       livereload: true,
       middleware: function(connect, opt) {
            return proxyConfigArr;
        }
   });
});

gulp.task('default',['connect','html','commonjs', 'style'],function() {
    gulp.start(['watch']);
});

gulp.task('watch',function () {
  gulp.watch('less/**',['style']);
  gulp.watch('js/**',['commonjs']);
  gulp.watch('html/**',['html']);
  gulp.watch('components/**',['html']);
//gulp.watch('src/**',['src']);
})