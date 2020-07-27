var gulp = new require('gulp');
var spritesmith = new require('gulp.spritesmith');
var spritesmithTexturepacker = new require('spritesmith-texturepacker')
var browserSync = new require('browser-sync');
var reload = browserSync.reload;

gulp
    .task('sprite', function () {
        return [
            gulp.src('./src/assets/images/bubles/*.png')
                .pipe(spritesmith({
                    imgName: "bubles.png",
                    cssName: "bubles.json",
                    algorithm: 'binary-tree',
                    cssTemplate: spritesmithTexturepacker
                }))
                .pipe(gulp.dest('./public/assets/sprites')),

            gulp.src('./src/assets/images/cards/*.png')
                .pipe(spritesmith({
                    imgName: "cards.png",
                    cssName: "cards.json",
                    algorithm: 'binary-tree',
                    cssTemplate: spritesmithTexturepacker
                }))
                .pipe(gulp.dest('./public/assets/sprites')),

            gulp.src('./src/assets/images/backgrounds/*.png')
                .pipe(spritesmith({
                    imgName: "backgrounds.png",
                    cssName: "backgrounds.json",
                    algorithm: 'binary-tree',
                    cssTemplate: spritesmithTexturepacker
                }))
                .pipe(gulp.dest('./public/assets/sprites')),
        ]
    });