var gulp         = require('gulp'),                          // подключаем gulp в gulpfile
    sass         = require('gulp-sass'),                     // sass компилятор
    browserSync  = require('browser-sync'),                  // сервер
    concat       = require('gulp-concat'),                   // конкатинация
    uglify       = require('gulp-uglifyjs'),                 // минимизация
    cssnano      = require('gulp-cssnano'),                  // минификация css
    rename       = require('gulp-rename'),                   // для добавления суффиксов
    del          = require('del'),                           // для удаления папки build
    imagemin     = require('gulp-imagemin'),                 // минификация картинок
    pngquant     = require('imagemin-pngquant'),             // минификация картинок
    cache        = require('gulp-cache'),                    // для удалиния кеша
    autoprefixer = require('gulp-autoprefixer'),             // автопрефиксер
    gcmq         = require('gulp-group-css-media-queries'),  // группировка media запросов
    notify       = require('gulp-notify'),                   // показ ошибок в компиляции sass
    svgSprite    = require('gulp-svg-sprite'),               // sprites
    pug          = require('gulp-pug'),                      // html препроцессор 
    deploy       = require('gulp-gh-pages');                 // деплой на github pages


/*--------Push build to gh-pages----------*/

 gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
  .pipe(deploy())
});

/*------------sass compile--------------*/

gulp.task('sass', function() { // Создаем таск Sass
  return gulp.src('source/sass/*.sass') // Берем источник
    .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError())) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(gcmq()) // группировка медиа запросов в 1(Для smartgrid'a)
    .pipe(autoprefixer(['last 15 versions', '> 1%'], {cascade: true, grid: true }))
    .pipe(gulp.dest('source/css')) // Выгружаем результата в папку source/css
    .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

/*------------pug compile--------------*/

gulp.task('pug', function buildHTML() {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .on("error", notify.onError())
  .pipe(gulp.dest('source'))
});

/*------------svg sprites--------------*/

gulp.task('svg', function() {
  var svgConfig = {
    svg: {
      namespaceClassnames: false
    },
    mode: {
      symbol: {
        dest: '.',
        sprite: 'sprite.svg'
      }
    }
  };
  return gulp.src('source/img/svg-source-gulp/*.svg')
  .pipe(svgSprite(svgConfig))
  .pipe(gulp.dest('source/img'));
});

/*------------scripts compile--------------*/

gulp.task('scripts', function() {
  return gulp.src([
    'source/libs/jquery/dist/jquery.min.js',
    'source/libs/owl.carousel/dist/owl.carousel.min.js',
    'source/libs/svgxuse/svgxuse.js',
    ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('source/js'));
});

/*------------libs compile--------------*/

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('source/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('source/css'));
});

/*------------browser sync--------------*/

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
    server: { // Определяем параметры сервера
      baseDir: 'source' // Директория для сервера - source
    },
    notify: false // Отключаем уведомления
  });
});

/*------------delete build--------------*/

gulp.task('clean', function() {
  return del.sync('build');
});

/*------------delete cache--------------*/

gulp.task('clear', function() {
  return cache.clearAll();
});

/*------------img minify--------------*/

gulp.task('img', function() {
  return gulp.src('source/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('build/img'));
});

/*------------watcher--------------*/

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'pug'], function() { // в квадратных скобках, то что делаем до watch
  gulp.watch('source/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass(если есть изменение выполняем sass)
  gulp.watch('source/template/**/*.pug', ['pug']);
  gulp.watch('source/*.html', browserSync.reload);
  gulp.watch('source/js/**/*.js', browserSync.reload);
});

/*------------build--------------*/

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

  var buildCss = gulp.src([
    'source/css/main.css',
    'source/css/libs.min.css',
    ])
  .pipe(gulp.dest('build/css'));

  var buildFonts = gulp.src('source/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));

  var buildJs = gulp.src('source/js/**/*')
    .pipe(gulp.dest('build/js'));

  var buildHtml = gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
});

//    (/*.sass) - берем все файлы с разрешение sass;
//    (/**/*.sass) - берем все файлы в папке, то есть даже во всех подпапках;
//    (['!source/sass/main.sass' , 'source/sass/**/*.sass']) можно выбирать масивом, и делать исключения через '!'
//    ('source/sass/**/*.+(scss│sass)') выбираем все файлы расзрешений scss и sass
