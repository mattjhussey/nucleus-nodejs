(function() {
  'use strict';
  module.exports = Service;

  /**
   * Service constructor function.
   *
   * @param {object} $http - Angular $http provider to use.
   */
  function Service($http) {
    this.getMap = getMap;

    /**
     * Retrieve the map from http and return the features.
     *
     * @param {object} path - Map to retrieve.
     * @returns {Promise} Promise with object containing features.
     */
    function getMap(path) {
      return $http.get('/data/geodata/' + path + '.json')
        .then(resolveFeatures);
    }

    /**
     * Retrieve and return the features from the response.
     *
     * @param {object} response - geojson map response from server.
     * @returns {object} Object containing features.
     */
    function resolveFeatures(response) {
      return response.data;
    }
  }
})();
