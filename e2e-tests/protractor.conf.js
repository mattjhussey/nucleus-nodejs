'use strict';

var express = require('express');
var path = require('path');

var server;

exports.config = {
  afterLaunch: function(exitCode) {
    console.log('Web Server: Stopping');
    var promise = new Promise(function(resolve, reject) {
      server.close(function() {
        console.log('Web Server: Stopped');
        resolve();
      });
    });
    return promise;
  },
  
  allScriptsTimeout: 11000,

  baseUrl: 'http://localhost:8000/app/',

  beforeLaunch: function() {
    console.log('Web Server: Starting');
    var app = express();
    app.use(express.static(path.join(__dirname, '../')));
    server = app.listen(8000);
    console.log('Web Server: Listening');
    server.on('connection', function(socket) {
      socket.setTimeout(2000);
      console.log('Web Server: Timeout configured');
    });
  },

  multiCapabilities: [
    {
      'browserName': 'chrome'
    },
    {
      'browserName': 'firefox'
    }
  ],

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  specs: [
    '*.js'
  ]
};
