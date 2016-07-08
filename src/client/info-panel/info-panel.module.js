(function() {
  'use strict';
  var angular = require('angular');

  var dependencies = [];
  module.exports = angular
    .module('mjhtest.info-panel', dependencies)
    .directive('mjhtestInfoPanel', require('./info-panel.directive'));
})();
