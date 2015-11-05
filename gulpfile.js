
var gulp         = require('gulp');
var del          = require('del');
var runSequence  = require('run-sequence');
var debug        = require('gulp-debug');
var gulpif       = require('gulp-if');
var useref       = require('gulp-useref');
var notify       = require('gulp-notify');
var size         = require('gulp-size');
var sizereport   = require('gulp-sizereport');

var jade         = require('gulp-jade');
var ejs          = require('gulp-ejs');
var less         = require('gulp-less');
var stylus       = require('gulp-stylus');
var coffee       = require('gulp-coffee');
var cson         = require('gulp-cson');

var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var uglify       = require('gulp-uglify');
var jsonlint     = require('gulp-jsonlint');

var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');

// ##########################################################################
// ##########################################################################
// ##########################################################################

gulp.task('html', function () {
	var harp = require('./harp.json');

	var lessStreem = gulp.src([ '!public/**/_*', 'public/css/**/*.less' ])
		.pipe(less());

	var stylusStreem = gulp.src([ '!public/**/_*', 'public/css/**/*.styl' ])
		.pipe(stylus({ 'include css': true }));

	var coffeeStreem = gulp.src([ '!public/**/_*', 'public/js/**/*.coffee' ])
		.pipe(coffee({ bare: true }));

	var assets = useref.assets({
		additionalStreams: [ lessStreem, stylusStreem, coffeeStreem ]
	});

	return gulp.src([
		'!public/**/_*', '!public/layout.{jade,ejs}',
		'public/*.{html,jade,ejs}'
		])
		.pipe(gulpif('*.jade', jade({ pretty: true, locals: harp.globals })))
		.pipe(gulpif('*.ejs', ejs()))
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', autoprefixer()))
		.pipe(gulpif('*.css', minifyCss({ compatibility: 'ie8' })))
		.pipe(assets.restore())
		.pipe(useref())
		.on('error', error)
		.pipe(gulp.dest('dist/'));
});

gulp.task('json', function () {
	return gulp.src([
		'!public/**/_*', '!public/bower{,/**}',
		'public/**/*.{json,cson}'
		])
		.pipe(gulpif('*.cson', cson()))
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError())
		.on('error', error)
		.pipe(gulp.dest('dist/'));
});

gulp.task('img', function () {
	return gulp.src([
		'!public/img/**/_*', '!public/bower{,/**}',
		'public/img/**/*.{gif,jpg,jpeg,png,svg}'
		])
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img/'));
});

gulp.task('other', function () {
	return gulp.src([
		'!public/**/_*', '!public/bower{,/**}',
		'!public/js/**/*.{js,coffee}',
		'!public/css/**/*.{css,less,styl}',
		'!public/img**/*.{gif,jpg,jpeg,png,svg}',
		'!public/*.{html,jade,ejs}',
		'!public/**/*.{json,cson}',
		'public/**/*.*'
		])
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', function(cb) {
	runSequence(
		'clean',
		['html', 'json', 'img', 'other'],
		'notify',
		'size',
		cb);
});

gulp.task('notify', function () {
	var	s = size();
	return gulp.src('dist/**/*')
		.pipe(s)
		.pipe(notify({
			onLast: true,
			title: 'Well done!',
			message: function () { return 'Project size: ' + s.prettySize; }
		}));
});

gulp.task('clean', del.bind(null, ['dist']));

function error(e) {
	console.log(e.toString());
	notify.onError({ title: 'Error', message: 'check terminal' })(e);
}

// ##########################################################################
// ##########################################################################
// ##########################################################################

gulp.task('size', function () {
	return gulp.src('dist/**/*.*')
		.pipe(sizereport({'*': { 'maxSize': 100000 }, gzip: true }));
});

gulp.task('size:js', function () {
	return gulp.src('dist/**/*.js')
		.pipe(sizereport({'*': { 'maxSize': 100000 }, gzip: true }));
});

gulp.task('size:css', function () {
	return gulp.src('dist/**/*.css')
		.pipe(sizereport({'*': { 'maxSize': 100000 }, gzip: true }));
});

gulp.task('size:img', function () {
	return gulp.src('dist/**/*.{gif,jpg,jpeg,png,svg,ico}')
		.pipe(sizereport({'*': { 'maxSize': 100000 } }));
});
