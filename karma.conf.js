'use strict';

/**
 * Configure karma test runner.
 *
 * @param {object} config - Karma object to configure.
 */
module.exports = function(config) {
  config.set({

    autoWatch: true,

    basePath: './',

    browsers: ['Chrome', 'Firefox'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-route/angular-route.js',
      'src/components/**/*.js',
      'src/view*/**/*.js',
      'static/components/**/*.js',
      'static/view*/**/*.js'
    ],

    frameworks: ['jasmine'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ]

  });
};
