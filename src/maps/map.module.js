(function() {
  'use strict';
  var angular = require('angular');

  var dependencies = [];
  module.exports = angular
    .module('mjhtest.maps', dependencies)
    .directive('mjhtestMap', require('./map.directive'))
    .service('mapService', require('./map.service'));

  // Sub Parts
  require('./map.scss');
})();
