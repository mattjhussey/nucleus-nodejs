(function() {
  'use strict';
  module.exports = directive;

  var template = require('./view-map.html');

  /**
   * Directive constructor function for the view-map
   */
  function directive() {
    return {
      link: link,
      restrict: 'E',
      template: template
    };

    /**
     * DOM logic for the directive.
     *
     * @param {object} $scope - Scope object to work with.
     */
    function link($scope) {
      $scope.filter = undefined;
      $scope.region = 'division1';
      $scope.graph = buildGraph();
      $scope.onFilterChanged = onFilterChanged;
      $scope.onRegionChanged = onRegionChanged;

      function buildGraph() {
        var graph = $scope.region;
        if($scope.filter !== undefined) {
          graph += '_' + $scope.filter;
        }
        return graph;
      }

      /**
       * Callback function for child elements to update the selection.
       *
       * @param {object} selected - The requested selection.
       */
      function onRegionChanged(region) {
        $scope.region = region;
        $scope.graph = buildGraph();
      }

      function onFilterChanged(filter) {
        $scope.filter = filter;
        $scope.graph = buildGraph();
      }
    }
  }
})();
