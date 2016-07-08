(function() {
  'use strict';
  var angular = require('angular');

  var dependencies = [
    require('mjhtest-filter-panel'),
    require('mjhtest-graphs'),
    require('mjhtest-info-panel'),
    require('mjhtest-maps')
  ];

  module.exports = angular
    .module('mjhtest.view-map', dependencies)
    .directive('mjhtestViewMap', require('./view-map.directive'));

  // Subparts
  require('./view-map.scss');
})();
