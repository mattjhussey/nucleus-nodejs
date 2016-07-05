'use strict';
var path = require('path');

/**
 * Use the browser name as the folder name.
 *
 * @param {Object} browser - Browser used.
 * @returns {Object} Echoed browser to use as folder name.
 */
var echoBrowser = function(browser) {
  return browser;
};

var isDebug = (function() {
  return process.argv.some(function(argument) {
    return argument === '--debug';
  });
})();

var mochaTimeout = isDebug ? 0 : undefined;

/**
 * Configure the karma settings for test runs.
 *
 * @param {Object} config - The config object to add the new config to.
 */
module.exports = function(config) {
  var webpackConfig = (
    function(config) {
      delete config.entry;
      delete config.output;
      config.devtool = 'inline-source-map';
      var module = config.module || {};
      var preLoaders = module.preLoaders || [];
      if (!isDebug) {
        preLoaders.push(
          [
            {
              exclude: [
                path.resolve('node_modules')
              ],
              include: [
                path.resolve('.')
              ],
              loader: 'istanbul-instrumenter',
              test: /\.js$/
            }
          ]);
      }
      module.preLoaders = preLoaders;
      config.module = module;

      config.externals = config.externals || {};
      // Stop angular being required multiple times
      config.externals.angular = 'angular';
      // Stop D3 being included multiple times
      config.externals.d3 = 'd3';

      return config;
    })(require('./webpack.config.js'));

  var includedFiles = [
    'node_modules/angular/angular.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'node_modules/d3/d3.js',
    'src/**/*.spec.js'
  ];

  var preprocessors = {};
  includedFiles.forEach(function(file) {
    preprocessors[file] = ['webpack', 'sourcemap'];
  }, preprocessors);

  config.set({

    autoWatch: true,

    basePath: './',

    browsers: ['Chrome', 'Firefox'],

    client: {
      mocha: {
        timeout: mochaTimeout
      }
    },

    coverageReporter: {
      dir: 'coverage/karma',
      reporters: [
        {
          type: 'json',
          subdir: echoBrowser
        },
        {
          type: 'lcov',
          subdir: echoBrowser
        }
      ]
    },

    files: includedFiles,

    frameworks: ['mocha'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-junit-reporter',
      'karma-sourcemap-loader',
      'karma-mocha-reporter',
      'karma-webpack'
    ],

    preprocessors: preprocessors,

    reporters: ['coverage', 'mocha'],

    webpack: webpackConfig

  });
};
