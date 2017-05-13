const gulp = require("gulp");
const uglify = require("gulp-uglify");

/*
	TODO: Add gulp-watch
*/

gulp.task("js", function() {
	return gulp.src("./src/**/*.js")
		.pipe(uglify())
		.pipe(gulp.dest("./build"));
});

gulp.task("default", ["js"]);