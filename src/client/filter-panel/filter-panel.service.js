(function() {
  'use strict';
  module.exports = Service;

  /**
   * Service constructor.
   *
   * @param {Object} $http - The http service to retrieve data from the server.
   */
  function Service($http) {
    this.getFilters = getFilters;

    /**
     * Retrieve the filters available.
     *
     * @returns {Object} Promise to return the filters.
     */
    function getFilters() {
      return $http.get('/data/filters.json')
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
