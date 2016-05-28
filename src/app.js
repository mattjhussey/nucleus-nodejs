'use strict';

require('html5-boilerplate/dist/css/normalize.css');
require('html5-boilerplate/dist/css/main.css');
require('./app.css');
require('html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js');
var angular = require('angular');
var angularRoute = require('angular-route');
require('./view1/view1');
require('./view2/view2');

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
