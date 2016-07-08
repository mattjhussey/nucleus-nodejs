(function() {
  'use strict';

  // Require 3rd party libraries
  require('html5-boilerplate/dist/css/normalize.css');
  require('html5-boilerplate/dist/css/main.css');
  require('html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js');

  // Module
  module.exports = require('./app.module').name;

  // Export name
  module.exports = 'app';
})();
