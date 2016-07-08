'use strict';

var exec = require('child_process').exec;
var gulp = require('gulp-help')(require('gulp'));
var gulpUtil = require('gulp-util');
var httpServer = require('http-server');
var karma = require('karma');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
/**
 * Wrap Gulp's _runTask and collect the task so it can be interrogated.
 *
 * @param {object} task - The task to execute.
 */
gulp.Gulp.prototype._runTask = function(task) {
  this.currentTask = task;
  this.__runTask(task);
};

/**
 * Build the webpack
 *
 * @param {object} done - Callback to signify that the build is complete.
 */
var buildWebpack = function(done) {
  webpack(
    require('./webpack.config.js'),
    function(err, stats) {
      if (err) {
        throw new gulpUtil.PluginError('webpack', err);
      } else {
        gulpUtil.log('[webpack]', stats.toString({}));
      }
      done();
    });
};

/**
 * Create a callback function to copy a directory from a to b.
 *
 * @param {object} from - The source for the copy.
 * @param {object} to - The target for the copy.
 * @returns {object} Function to copy the defined directories.
 */
var copyDir = function(from, to) {
  return function() {
    gulp.src(from).
      pipe(gulp.dest(to));
  };
};

/**
 * Create a callback function to delete a directory.
 *
 * @param {object} folder - The folder to delete.
 * @returns {object} Function to delete the defined directory.
 */
var deleteFolder = function(folder) {
  return function(done) {
    rimraf(folder, done);
  };
};

/**
 * Create a callback function to execute a script.
 *
 * @param {object} script - The script to execute.
 * @returns {object} Function to run the defined script.
 */
var execute = function(script) {
  return function(done) {
    exec(script, output(this.currentTask.name, done));
  };
};

/**
 * Send logs to gulp log.
 *
 * @param {Object} name - The name of the task to prepend to logs.
 * @param {Object} done - The callback to inform of completion.
 *
 * @returns {Object} A function that forwards stdout and stderr to gulp log.
 */
var output = function(name, done) {
  return function(err, stdout, stderr) {
    if (stdout) {
      gulpUtil.log(name + ' [out] ' + stdout);
    }
    if (stderr) {
      gulpUtil.log(name + ' [err] ' + stderr);
    }
    done(err);
  };
};

/**
 * Wrap an exec inside a Promise.
 * The Promise is wrapped inside another function so that it can be chained.
 *
 * @param {Object} name - Name of the exec function to prepend to logs.
 * @param {Object} func - The function to execute.
 *
 * @returns {Object} Function that returns a Promise to execute the function.
 */
var promiseExec = function(name, func) {
  return function() {
    return new Promise(function(resolve, reject) {
      exec(func, output(name, function(err) {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      }));
    });
  };
};

/**
 * Wrap a callback function in a Promise.
 *
 * @param {object} callbackFunction - The function to call within a Promise.
 * @returns {object} Function that returns a Promise to run the callback function.
 */
var promiseWrapper = function(callbackFunction) {
  return function() {
    return new Promise(function(resolve, reject) {
      callbackFunction(function(err) {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };
};

/**
 * Start a webpack dev server.
 *
 * @param {object} done - Callback once complete.
 */
var runDevServer = function(done) {
  var config = require('./webpack.config.js');
  config.entry.app.unshift(
    'webpack-dev-server/client?http://localhost:8080/',
    'webpack/hot/dev-server');
  var compiler = webpack(config);

  var webpackDevServerConfig = {
    contentBase: './public',
    hot: true
  };
  new WebpackDevServer(
    compiler,
    webpackDevServerConfig
  ).listen(8080, function(err) {
    if (err) {
      throw new gulpUtil.PluginError('webpack-dev-server', err);
    }
    gulpUtil.log(
      '[webpack-dev-server]',
      'http://localhost:8080/webpack-dev-server/index.html');
  });
};

/**
 * Start the karma test server.
 *
 * @param {object} done - Callback to indicate the server has completed.
 */
var runKarmaServer = function(done) {
  new karma.Server(
    {
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
};

/**
 * Start the karma test server in watch mode.
 *
 * @param {object} done - Callback to indicate the server has completed.
 */
var runAndWatchKarmaServer = function(done) {
  new karma.Server(
    {
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }, done).start();
};

/**
 * Start a webserver. (Runs indefinitely)
 *
 * @param {object} done - Callback to indicate the server has completed. (Which it won't).
 */
var runWebServer = function(done) {
  var options = {
    root: './public'
  };
  var server = httpServer.createServer(options);
  server.listen(3000);
};

gulp.task('clean:compile', deleteFolder('public'));

gulp.task('clean:coverage:base', deleteFolder('coverage/base'));

gulp.task('clean:coverage:report', deleteFolder('coverage/report'));

gulp.task('clean:documentation', deleteFolder('docs'));

gulp.task('clean:unitcoverage', deleteFolder('coverage/karma'));

gulp.task('compile', ['clean:compile', 'copy:static'], buildWebpack);

gulp.task(
  'copy:static', ['clean:compile'], copyDir('./static/**/*', './public/'));

gulp.task(
  'coverage',
  [
    'clean:coverage:base',
    'clean:coverage:report',
    'test'
  ], function(done) {
    promiseExec(
      'isanbul cover',
      'istanbul cover ./istanbul_trigger.js --include-all-sources ' +
        '--dir ./coverage/base/')().
      then(promiseExec(
        'istanbul report',
        'istanbul report --dir ./coverage/report')).
      then(promiseExec(
        'istanbul summary',
        'istanbul report text-summary')).
      then(done);
  });

gulp.task('csslint', execute('csslint src/ static/'));

gulp.task('default', ['coverage', 'documentation', 'lint', 'test']);

gulp.task(
  'documentation', ['clean:documentation'],
  execute('jsdoc --configure ./.jsdoc.conf.json .'));

gulp.task('htmllint',
          execute('htmllint static/**/*.html e2e-tests/**/*.html'));

gulp.task('jscs', execute('jscs .'));

gulp.task('jshint', execute('jshint .'));

gulp.task('lint', ['csslint',
                   'htmllint',
                   'jscs',
                   'jshint',
                   'puglint',
                   'sasslint']);

gulp.task('lint:watch', function() {
  return gulp.watch(
    [
      '*.*',
      './e2e-tests/*.*',
      './src/**/*.*',
      './static/**/*.*',
      './utilities/**/*.*'
    ],
    [
      'csslint',
      'htmllint',
      'jscs',
      'jshint',
      'puglint',
      'sasslint']);
});

gulp.task('puglint', execute('pug-lint src/ static/'));

gulp.task('sasslint',
          execute('sass-lint --config ./.sass-lint.yml --verbose --no-exit'));

gulp.task('start', ['compile'], runWebServer);

gulp.task('start:dev-server', ['compile'], runDevServer);

gulp.task('test', ['test:e2e', 'test:unit']);

gulp.task('test:e2e', ['compile', 'update-webdriver'],
          execute('protractor ./e2e-tests/protractor.conf.js'));

gulp.task('test:unit', ['clean:unitcoverage'], runKarmaServer);

gulp.task('test:unit:watch', ['clean:unitcoverage'], runAndWatchKarmaServer);

gulp.task('update-webdriver', execute('webdriver-manager update'));
