(function() {
  'use strict';
  module.exports = directive;

  var template = require('./filter-panel.html');

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
    
    function link($scope) {
      $scope.filter = JSON.stringify({
        "id": undefined,
        "name": "None"
      });
      
      $scope.$watch('selected', function(newValue) {
        if($scope.filters !== undefined) {
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
            "id": undefined,
            "name": "None"
          });
          $scope.filters = filtersWithNone;
          updateSelectedFilter($scope.filter);
        });

      function updateSelectedFilter(filterId) {
        $scope.filters.forEach(function(filter) {
          if(filter.id === filterId) {
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
