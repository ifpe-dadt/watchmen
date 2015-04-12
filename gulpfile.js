var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var main_bower_files = require('main-bower-files');

function js(shouldMinify) {
    return gulp.src('./webserver/public/js/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.if(shouldMinify, plugins.uglify()))
        .pipe(gulp.dest('webserver/public/build'));
}

function less(){
    return gulp.src('./webserver/public/less/*.less')
        .pipe(plugins.less())
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('webserver/public/build'));
}

// todo: fix bootstrap font path
function bowerCSS() {
    return gulp.src(main_bower_files())
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.minifyCss({keepBreaks:true}))
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest('webserver/public/build'));
}

function bowerJS() {
    return gulp.src(main_bower_files())
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest('webserver/public/build'));
}

// ---------------
//  TASKS
// ---------------

gulp.task('js-dev', function () {
    return js(false);
});

gulp.task('js-prod', function () {
    return js(true);
});

gulp.task('bower-js', function() {
    return bowerJS();
});

gulp.task('bower-css', function() {
    return bowerCSS();
});

gulp.task('less', function () {
    return less();
});

gulp.task('build', function () {
    less();
    js(true);
});

gulp.task('watch', function () {
    gulp.watch('./webserver/public/bower_components/**/*', ['bower-js']);
    gulp.watch('./webserver/public/js/*', ['js-dev']);
    gulp.watch('./webserver/public/less/*', ['less']);
});