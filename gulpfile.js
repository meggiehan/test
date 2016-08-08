var gulp = require('gulp'),
    less = require('gulp-less'),
     //确保本地已安装gulp-minify-css [cnpm install gulp-minify-css --save-dev]
    cssmin = require('gulp-minify-css');
 
gulp.task('less', function () {
    gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(cssmin()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('./src/build/css'));
});
