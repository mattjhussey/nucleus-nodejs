'use strict';
var expect = require('chai').expect;
var $ = require('jquery');
var sinon = require('sinon');

describe('mjhtest.view-map module', function() {
  var element;
  var html = '<mjhtest-view-map></mjhtest-view-map>';
  var sandbox;
  var $scope;
  var filterPanelScope;
  var graphScope;
  var mapScope;

  beforeEach(
    'Create Mock Sandbox',
    function() {
      sandbox = sinon.sandbox.create();
    });
  beforeEach(
    'Load the test module',
    angular.mock.module(require('mjhtest-view-map')));
  beforeEach(
    'Fake the mjhtest-graphs directive',
    angular.mock.module(function(_$compileProvider_) {
      _$compileProvider_.directive('mjhtestGraph', directive);

      /**
       * Directive configuration function.
       *
       * @returns {Object} Data Definition Object for Directive
       */
      function directive() {
        return {
          link: link,
          priority: 100,
          restrict: 'E',
          scope: {
            selected: '@selected'
          },
          template: '<fake-mjhtest-graph></fake-mjhtest-graph>',
          terminal: true
        };

        /**
         * UI Logic
         *
         * @param {Object} scope - Scope for UI.
         */
        function link(scope) {
          graphScope = scope;
        }
      }
    })
  );
  beforeEach(
    'Fake the mjhtest-filter-panel directive',
    angular.mock.module(function(_$compileProvider_) {
      _$compileProvider_.directive('mjhtestFilterPanel', directive);

      /**
       * Directive configuration function.
       *
       * @returns {Object} Data Definition Object for Directive
       */
      function directive() {
        return {
          link: link,
          priority: 100,
          restrict: 'E',
          scope: {
            selected: '@selected'
          },
          template: '<fake-mjhtest-filter-panel></fake-mjhtest-filter-panel>',
          terminal: true
        };

        /**
         * UI Logic
         *
         * @param {Object} scope - Scope for UI.
         */
        function link(scope) {
          filterPanelScope = scope;
        }
      }
    })
  );
  beforeEach(
    'Fake the mjhtest-maps directive',
    angular.mock.module(function(_$compileProvider_) {
      _$compileProvider_.directive('mjhtestMap', directive);

      /**
       * Directive constructor function for the fake mjhtestMap directive.
       */
      function directive() {
        return {
          link: link,
          priority: 100,
          restrict: 'E',
          scope: {
            onSelected: '&onSelected',
            selected: '@selected'
          },
          template: '<fake-mjhtest-map></fake-mjhtest-map>',
          terminal: true
        };

        /**
         * Link function. Being used to capture the scope for later use.
         *
         * @param {object} scope - Scope to capture.
         */
        function link(scope) {
          mapScope = scope;
        }
      }
    })
  );
  beforeEach(
    'Create $scope',
    inject(function(_$rootScope_) {
      $scope = _$rootScope_.$new();
    }));
  beforeEach(
    'Render the view',
    inject(function(_$compile_) {
      element = _$compile_(html)($scope);
      mapScope.$digest();
      $scope.$digest();
    }));

  afterEach(
    'Destroy the $scope',
    function() {
      $scope.$destroy();
    });
  afterEach(
    'Clean the mock sandbox',
    function() {
      sandbox.restore();
    }
  );

  describe('view-map', function() {

    it('should contain a fake mjhtest map', function() {
      var fakeMap = $(element).find('fake-mjhtest-map');
      expect(fakeMap.length).to.equal(1);
    });

    it('should contain a fake mjhtest graph', function() {
      var fakeGraph = $(element).find('fake-mjhtest-graph');
      expect(fakeGraph.length).to.equal(1);
    });

    describe('fake map', function() {
      it('should be initialised to New England', function() {
        $scope.$digest();
        expect(mapScope.selected).to.equal('division1');
      });
    });

    describe('fake graph', function() {
      it('should be initialised to New England', function() {
        $scope.$digest();
        expect(graphScope.selected).to.equal('division1');
      });
    });

    describe('change graph selection', function() {
      var newGraph = 'ChangedGraph';
      beforeEach(
        'Change the graph selection',
        function() {
          $scope.graph = newGraph;
          $scope.$digest();
        }
      );

      describe('fake graph', function() {
        it('should update the graph with the new selection', function() {
          expect(graphScope.selected).to.equal(newGraph);
        });
      });
    });

    describe('change map selection', function() {
      var newMap = 'ChangedMap';
      beforeEach(
        'Change the map selection',
        function() {
          $scope.region = newMap;
          $scope.$digest();
        }
      );

      describe('fake map', function() {
        it('should update the map with the new selection', function() {
          expect(mapScope.selected).to.equal(newMap);
        });
      });
    });

    describe('when selection is changed by mjhtest-map directive', function() {
      var selected = 'test-selected';
      beforeEach(
        'send a message from mjhtest-maps to notify the selection change',
        function() {
          mapScope.onSelected({
            selected: selected});
          $scope.$digest();
        });

      it('should update the map with the new selection', function() {
        expect(mapScope.selected).to.equal(selected);
      });

      it('should update the graph with the new selection', function() {
        expect(graphScope.selected).to.equal(selected);
      });
    });
  });
});
