(function() {
  'use strict';
  var angular = require('angular');

  var dependencies = [
    require('angular-animate'),
    require('angular-aria'),
    require('angular-material')];
  module.exports = angular
    .module('mjhtest.filter-panel', dependencies)
    .directive('mjhtestFilterPanel', require('./filter-panel.directive'))
    .service('filterPanelService', require('./filter-panel.service'));

  // Sub Parts
  require('angular-material/angular-material.css');
})();
