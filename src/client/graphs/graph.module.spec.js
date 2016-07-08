'use strict';

describe('mjhtest.graphs module', function() {
  var $scope;

  beforeEach(
    'Load the test module',
    angular.mock.module(require('mjhtest-graphs')));
  beforeEach(
    'Create $scope',
    inject(function(_$rootScope_) {
      $scope = _$rootScope_.$new();
    }));

  afterEach(
    'Destroy the $scope',
    function() {
      $scope.$destroy();
    });

  describe('loading a graph', function() {
    describe('the displayed data', function() {
      it('should contain a budget line');
      it('should contain an actual line');
    });
    describe('loading a new graph', function() {
      it('should no longer contain the old data');
      it('should contain the new data');
    });
  });
});
