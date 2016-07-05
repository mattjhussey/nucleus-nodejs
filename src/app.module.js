(function() {
  'use strict';

  var angular = require('angular');

  var dependencies = [
    require('view-map'),
  ];

  module.exports = angular
    .module('app', dependencies);

  // Sub parts
  require('./app.scss');
})();
