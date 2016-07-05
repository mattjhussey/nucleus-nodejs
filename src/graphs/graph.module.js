(function() {
  'use strict';
  var angular = require('angular');

  var dependencies = [];
  module.exports = angular
    .module('mjhtest.graphs', dependencies)
    .directive('mjhtestGraph', require('./graph.directive'))
    .service('graphService', require('./graph.service'));

  // Sub Parts
  require('./graph.scss');
})();
