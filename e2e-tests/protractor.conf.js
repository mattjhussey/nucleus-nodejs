'use strict';
/* globals exports: false */
var express = require('express');
var path = require('path');

var server;

exports.config = {

  /**
   * Close the Web Server.
   *
   * @returns {Promise} A promise to asynchronously close the Web Server.
   */
  afterLaunch: function() {
    return new Promise(function(resolve, reject) {
      server.close(function() {
        resolve();
      });
    });
  },

  allScriptsTimeout: 11000,

  /**
   * Start the Web Server.
   */
  beforeLaunch: function() {
    var app = express();
    var root = path.join(__dirname, '..\\public');
    app.use(express.static(root));
    server = app.listen(3000);
    // The sockets have keep alives and this stops the server from closing.
    // This listener sets the timeouts to 2 seconds to stop tests failing
    // due to timeouts.
    server.on('connection', function(stream) {
      stream.setTimeout(2000);
    });
  },

  baseUrl: 'http://localhost:3000/',

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'mocha',

  mochaOpts: {
    timeout: 30000
  },

  specs: [
    '*.spec.js'
  ]
};
