(function() {
  'use strict';
  module.exports = Service;

  /**
   * Service constructor function.
   *
   * @param {Object} $http - The http service to retrieve data from the server.
   */
  function Service($http) {
    this.getData = getData;

    /**
     * Retrieve the data for the path.
     *
     * @param {Object} path - The path to get data for.
     * @returns {Object} The data for the path.
     */
    function getData(path) {
      return $http.get('/data/' + path + '.json')
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
