'use strict';

exports.config = {
  allScriptsTimeout: 11000,

  baseUrl: 'http://localhost:8000/app/',

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  specs: [
    '*.js'
  ]
};
