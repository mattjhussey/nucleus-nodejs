(function() {
  'use strict';
  module.exports = directive;

  var template = require('./filter-panel.html');

  /**
   * Directive configuration function.
   *
   * @param {Object} filterPanelService - Service to retrieve info values.
   * @returns {Object} Data Definition Object for the filter panel directive.
   */
  function directive(filterPanelService) {
    return {
      link: link,
      restrict: 'E',
      scope: {
        selected: '@filter',
        onFilterChanged: '&onFilterChanged'
      },
      template: template
    };

    /**
     * UI Logic for the filter panel.
     *
     * @param {Object} $scope - The scope to use for the UI.
     */
    function link($scope) {
      $scope.filter = JSON.stringify({
        'id': undefined,
        'name': 'None'
      });

      $scope.$watch('selected', function(newValue) {
        if ($scope.filters !== undefined) {
          updateSelectedFilter(newValue);
        }
      });

      $scope.$watch('filter', function(newValue, oldValue) {
        $scope.onFilterChanged({
          filter: JSON.parse(newValue).id
        });
      });

      filterPanelService.getFilters()
        .then(function(filters) {
          var filtersWithNone = JSON.parse(JSON.stringify(filters));
          filtersWithNone.unshift({
            'id': undefined,
            'name': 'None'
          });
          $scope.filters = filtersWithNone;
          updateSelectedFilter($scope.filter);
        });

      /**
       * Handle an updated filter.
       *
       * @param {Object} filterId - The selected filter.
       */
      function updateSelectedFilter(filterId) {
        $scope.filters.forEach(function(filter) {
          if (filter.id === filterId) {
            var cleanFilter = {
              id: filter.id,
              name: filter.name
            };
            $scope.filter = JSON.stringify(cleanFilter);
          }
        });
      }
    }
  }
})();
