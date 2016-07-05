(function() {
  'use strict';
  module.exports = Service;

  function Service($http) {
    this.getFilters = getFilters;

    function getFilters() {
      return $http.get('/data/filters.json')
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
