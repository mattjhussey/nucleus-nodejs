module.exports = function(config){
  config.set({

    autoWatch : true,

    basePath : './',

    browsers : ['Chrome'],

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/components/**/*.js',
      'app/view*/**/*.js'
    ],

    frameworks: ['jasmine'],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ]

  });
};
